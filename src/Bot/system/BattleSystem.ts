import { Collection } from 'discord.js';
import { BattleDataType, BattlePlayerData } from '../structure/BattleData';
import { ShowdownBattle } from '../../Showdown/models/ShowdownBattle';
import { PokemonId } from '../../Showdown/types/PokemonId';

export class BattleSystem {
  private _data: BattleDataType = {
    winner: '',
    players: new Collection<string, BattlePlayerData>(),
    field: {
      weather: {
        condition: 'None',
        side: '',
        pokemon: '',
      },
      hazards: new Collection(),
      status: new Collection(),
    },
    turns: 0,
    format: '',
    replay: '',
    details: [],
  };

  private _current_move = '';

  constructor(private _battle: ShowdownBattle) {
    try {
      this.setup();
      this.handleSetupEvents();
      this.handleMinorEvents();
      this.handleSwitchEvents();
      this.handleHazards();
      this.handleFaints();

      // Handles the event when a status has been inflicted.
      _battle.on('-status', (pokemon: PokemonId, status: string) => this.handleStatus(pokemon, status));

      // Handles the event when the weather event has been invoked.
      _battle.on('-weather', (weather: string, from?: string, _of?: string) => this.handleWeather(weather, from, _of));

      // Handles the event when a move has been used.
      _battle.on('move', (attacker: PokemonId, target: PokemonId | string, move: string) =>
        this.handleMoves(attacker, target, move),
      );
    } catch (error) {
      console.log(error);
      return;
    }
  }

  /**
   * Data setup. Mostly for variables that need to be setup in order to function correctly.
   */
  private setup() {
    // Set Hazards up
    this._data.field.hazards.set('Stealth Rocks', new Collection());
    this._data.field.hazards.set('Spikes', new Collection());
    this._data.field.hazards.set('Toxic Spikes', new Collection());

    // Set Status up
    this._data.field.status.set('psn', new Collection());
    this._data.field.status.set('brn', new Collection());
  }
  // This will invoke the events that are more minor and don't need logic.
  // More for grabbing said data from.
  private handleMinorEvents() {
    this._battle.on('win', (user) => (this._data.winner = user));
    this._battle.on('turn', (turn) => (this._data.turns = turn));
    this._battle.on('tier', (tier) => (this._data.format = tier));
  }
  // This will invoke the events that are used to setup, such as players and pokemon.
  private handleSetupEvents() {
    // Sets up the player when invoked.
    this._battle.on('player', (player, username, avatar, rating) => {
      this._data.players.set(player, {
        username,
        score: 6,
        pokemons: new Collection(),
        current_pokemon: '',
      });
    });

    this._battle.on('poke', (data: { player: string; pokemon: string }, other: string[]) => {
      let name = data.pokemon.includes(', ') ? data.pokemon.split(', ')[0] : data.pokemon;
      let player = this._data.players.get(data.player);
      if (!player?.pokemons.has(name)) {
        player?.pokemons.set(name, {
          nickname: name || '',
          name: name,
          forme: '',
          kills: 0,
          isDead: false,
        });
      }
    });
  }
  // This will invoke the events that involves the pokemo to be switch in some form.
  private handleSwitchEvents() {
    // If a pokemon changes for some reason. Example is Zoroark's Illusion.
    this._battle.on('detailschange', (player: string, old: string, _new: string) => {
      let _player = this._data.players.get(player);

      this._data.players.get(player)!.current_pokemon = _new;

      let old_pokemon = this._data.players.get(player)!.pokemons.find((x) => x.nickname == old);

      _player?.pokemons.set(_new, old_pokemon!);
      _player?.pokemons.delete(old_pokemon?.name!);
      _player!.pokemons.get(_new)!.forme = _new;
      _player!.pokemons.get(_new)!.name = _new;
    });

    this._battle.on('switchAndDrag', (pokemon: PokemonId, hp: [number, number]) => {
      let player = this._data.players.get(pokemon.player)!;

      if (player.pokemons.has(pokemon.pokemon) || player.pokemons.find((x) => x.name === pokemon.pokemon)) {
        player.pokemons.set(pokemon.pokemon, {
          nickname: pokemon.name || '',
          name: pokemon.pokemon,
          forme: pokemon.name?.includes('-mega') ? pokemon.name : '',
          kills: 0,
          isDead: false,
        });
      }

      let poke = player.pokemons.find((x) => x.name === pokemon.pokemon);

      if (poke?.nickname !== pokemon.name) poke!.nickname = pokemon.name!;

      player.current_pokemon = player.pokemons.get(pokemon.pokemon)!.name;
    });
  }
  // This will invoke the events that involves the setup of hanzards, like -sidestart and -sideend
  private handleHazards() {
    this._battle.on('-sidestart', (side: string, condition: string) => {
      let hazardList = ['move: Stealth Rock', 'move: Spikes', 'move: Toxic Spikes'];

      if (hazardList.includes(condition)) {
        let _side = side.split(':')[0];
        let _otherSide = _side === 'p1' ? 'p2' : 'p1';
        let player = this._data.players.get(_otherSide);
        // Accounting for multiple spikes/tspikes
        let _con = condition.includes(':') ? condition.split(':')[1].trim() : condition.trim();
        this._data.field.hazards.get(_con)?.set(_side, player?.current_pokemon!);
      }
    });

    this._battle.on('-sideend', (side: string, condition: string) => {
      let hazardList = ['move: Stealth Rock', 'move: Spikes', 'move: Toxic Spikes'];
      if (hazardList.includes(condition)) {
        let _side = side.split(':')[0];
        let _otherSide = _side == 'p1' ? 'p2' : 'p1';

        let _con = condition.includes(':') ? condition.split(':')[1].trim() : condition.trim();

        this._data.field.hazards.get(_con)?.delete(_otherSide);
      }
    });
  }

  private handleStatus(pokemon: PokemonId, status: string) {
    const side = pokemon.player;
    const otherSide = pokemon.player === 'p1' ? 'p2' : 'p1';
    let atkPlayer = this._data.players.get(otherSide);
    let defPlayer = this._data.players.get(side);
    let list = ['psn', 'brn'];
    let lastLine = this._battle.data[this._battle.data.length - 2];
    if (list.includes(status)) {
      // Checks if the status that was inflicted came from toxic spikes.
      if (
        status === 'psn' &&
        !lastLine.startsWith('|move') &&
        this._data.field.hazards.get('Toxic Spikes')?.get(side)
      ) {
        let setter = this._data.field.hazards.get('Toxic Spikes')?.get(side);
        this._data.field.status.get('psn')?.set(defPlayer?.current_pokemon!, setter!);
      } else {
        this._data.field.status.get('psn')?.set(defPlayer?.current_pokemon!, atkPlayer?.current_pokemon!);
      }
    }
  }

  private handleWeather(weather: string, from?: string, _of?: string) {
    if (_of) {
      let side = _of.split(':')[0].split(' ')[1];
      let player = this._data.players.get(side[0] + side[1]);
      this._data.field.weather.condition = weather;
      this._data.field.weather.pokemon = player!.pokemons.find((x) => x.nickname === _of.split(':')[1].trim())!.name;
      this._data.field.weather.side = side;
    }
  }
  // Handles the event that is invoked when a move has been used.
  private handleMoves(attacker: PokemonId, target: PokemonId | string, move: string) {
    this._current_move = move;
    let selfOKList = [
      'Explosion',
      'Self-Destruct',
      'Misty Explosion',
      'Memento',
      'Healing Wish',
      'Final Gambit',
      'Lunar Dance',
    ];

    let curseCond = ['Curse'].includes(move) && !(typeof target === 'string' || typeof target === 'undefined');
    let player = this._data.players.get(attacker.player)!;
    // We are check to see if the attacker used a self OHKO move.
    // We had to make a separate condition for curse since it depends on the type of the user.

    // We will treat self OHKO conds as a lost to the offender, and do not reward the opposite side.
    if (selfOKList.includes(move) && curseCond) {
      player.pokemons.find((x) => x.nickname === attacker.name)!.isDead = true;
      player.score--;
    }
  }

  private handleFaints() {
    // We will be using the faint event to register the death.
    // And we will use the -damage event to obtain the data.

    // this is where we will have a funeral for the pokemon.
    this._battle.on('faint', (pokemon: PokemonId) => {
      let player = this._data.players.get(pokemon.player)!;

      player.pokemons.get(player.current_pokemon!)!.isDead = true;
      player.score -= 1;
    });

    // This is where we will do the autopshy on the victim.
    this._battle.on('-damage', (pokemon: PokemonId, hp: string, from?: string) => {
      let side = pokemon.player;
      let otherSide = side === 'p1' ? 'p2' : 'p1';

      let atkPlayer = this._data.players.get(otherSide)!;
      let defPlayer = this._data.players.get(side)!;

      // We first need to check if the victim is truly dead.
      if (hp === '0 fnt') {
        // we will first check to see if they were poison or burned.
        if (from && ['[from] psn', '[from] brn'].includes(from)) {
          let inflictor = this._data.field.status.get(from.split(']')[1].trim())?.get(defPlayer?.current_pokemon!);
          atkPlayer.pokemons.get(inflictor!)!.kills++;

          // Detailed Death
          // Porygon died to psn that was inflicted by Cinccino

          this._data.details.push({
            type: 'status',
            turn: this._data.turns,
            killer: inflictor!,
            kille: defPlayer.current_pokemon,
            method: `died to ${from.split(']')[1].trim()} that was inflicted by`,
          });
        }

        // Next we need to check to see if death was from hazards.
        // We are excluding Toxic Spikes because it can actually deal damage. It only inflicts statuses.
        // Which is already covered in our status check.
        else if (from && ['[from] Stealth Rock', '[from] Spikes'].includes(from)) {
          let hazard = from.split(']')[1].trim();

          let setter = this._data.field.hazards.get(hazard)!.get(otherSide);
          atkPlayer.pokemons.get(setter!)!.kills++;

          this._data.details.push({
            type: 'hazards',
            turn: this._data.turns,
            killer: atkPlayer.pokemons.get(setter!)!.name!,
            kille: defPlayer.pokemons.get(defPlayer.current_pokemon)?.name!,
            method: `died to ${hazard} that was leafted by`,
          });
        }

        // Else we are assuming that this was death caused by normal means.
        // As in a move was used causing damage to the victim.
        else {
          atkPlayer.pokemons.get(atkPlayer.current_pokemon!)!.kills++;

          this._data.details.push({
            type: 'normal',
            turn: this._data.turns,
            killer: atkPlayer.pokemons.get(atkPlayer.current_pokemon!)?.name!,
            kille: defPlayer.pokemons.get(defPlayer.current_pokemon!)?.name!,
            method: `with ${this._current_move}`,
          });
        }
      }
    });
  }

  public get data() {
    return this._data;
  }
}
