import { Collection } from 'discord.js';
import { BattleDataType, BattlePlayerData, BattlePokemonData } from '../structure/BattleData';
import { ShowdownBattle } from '../../Showdown/models/ShowdownBattle';
import { PokemonId } from '../../Showdown/types/PokemonId';
import { Status } from '../constants/status';

export class BattleSystem {
  private _data: BattleDataType = {
    winner: '',
    players: new Collection<string, BattlePlayerData>(),
    format: '',
    replay: '',
  };

  constructor(private _battle: ShowdownBattle) {
    _battle.on('player', (player, username, avatar, rating) => {
      this._data.players.set(player, {
        username,
        score: 6,
        hazard_setters: new Collection(),
        weather_setters: new Collection(),
        status_inflictor: new Collection(),
        current_pokemon: '',
        pokemons: new Collection<string, BattlePokemonData>(),
      });
    });

    _battle.on('win', (user) => {
      this._data.winner = user;
    });

    _battle.on('tier', (tier) => {
      this._data.format = tier;
    });

    _battle.on('poke', (data: { player: string; pokemon: string }, other: string[]) => {
      let name = data.pokemon.includes(', ') ? data.pokemon.split(', ')[0] : data.pokemon;
      // console.log(name);
      if (!this._data.players.get(data.player)?.pokemons.has(name)) {
        this._data.players.get(data.player)?.pokemons.set(name, {
          nickname: name || '',
          name: name,
          forme: '',
          kills: 0,
          isDead: false,
        });
      }
    });

    _battle.on('detailschange', (player: string, old: string, _new: string) => {
      this._data.players.get(player)!.current_pokemon = _new;

      // console.log(this.data.players.get(player)?.pokemons);
      this._data.players.get(player)!.pokemons.set(_new, this._data.players.get(player)?.pokemons.get(old)!);
      this._data.players.get(player)!.pokemons.delete(old);

      this._data.players.get(player!)!.pokemons.get(_new)!.forme = _new;
      this._data.players.get(player)!.pokemons.get(_new)!.name = _new;
    });

    _battle.on('switchAndDrag', (pokemon: PokemonId, hp: [number, number]) => {
      if (
        !this._data.players.get(pokemon.player)?.pokemons.has(pokemon.pokemon) ||
        !this._data.players.get(pokemon.player)?.pokemons.find((x) => x.name === pokemon.pokemon)
      ) {
        this._data.players.get(pokemon.player)?.pokemons.set(pokemon.pokemon, {
          nickname: pokemon.name || '',
          name: pokemon.pokemon,
          forme: pokemon.name?.includes('-mega') ? pokemon.name : '',
          kills: 0,
          isDead: false,
        });
      }
      let poke = this._data.players.get(pokemon.player)?.pokemons.find((x) => x.name === pokemon.pokemon);
      if (poke?.nickname !== pokemon.name) poke!.nickname = pokemon.name!;

      const player = pokemon.player;
      const current = this._data.players.get(player)!.current_pokemon;
      console.log('Switch ', current);
      this._data.players.get(player)!.current_pokemon = this._data.players
        .get(player)!
        .pokemons.get(pokemon.pokemon)!.name;
    });

    _battle.on('-status', (pokemon: PokemonId, status: string) => {
      if (status == Status.Toxic || status == Status.Burn) {
        const player = pokemon.player;
        this._data.players
          .get(player === 'p1' ? 'p2' : 'p1')
          ?.status_inflictor.set(this._data.players.get(player)!.current_pokemon, {
            inflictor: {
              side: pokemon.player === 'p1' ? 'p2' : 'p1',
              pokemon: this._data.players.get(player === 'p1' ? 'p2' : 'p1')?.current_pokemon!,
            },
            status: status,
            inflicte: {
              side: pokemon.player as 'p1' | 'p2',
              pokemon: this._data.players.get(player)!.current_pokemon,
            },
          });
      }
    });

    _battle.on('-sidestart', async (side: string, condition: string) => {
      if (condition === 'move: Stealth Rock') {
        let player = side.split(':')[0];

        let _player = this._data.players.get(player === 'p1' ? 'p2' : 'p1');
        _player?.hazard_setters.set('Stealth Rock', _player.pokemons.get(_player.current_pokemon!)!);
      }
    });

    _battle.on('-sideend', async (side: string, condition: string) => {
      console.log(this._data.players.get('p1')?.hazard_setters);
      if (condition === 'move: Stealth Rock') {
        let player = side.split(':')[0];
        let _player = this._data.players.get(player === 'p1' ? 'p2' : 'p1');
        _player?.hazard_setters.delete('Stealth Rock');
      }
    });

    _battle.on('-weather', (weather: string, from?: string, _of?: string) => {
      if (_of) {
        let side = _of.split(':')[0].split(' ')[1].slice(0, 2);
      }
    });

    _battle.on('-damage', async (pokemon: PokemonId, hp: string, from?: string) => {
      try {
        if (hp === '0 fnt') {
          if (from && (from === '[from] psn' || from === '[from] brn')) {
            // Status kill
            let _player = this._data.players.get(pokemon.player === 'p1' ? 'p2' : 'p1')!;
            let _status = _player.status_inflictor.get(pokemon.pokemon!);
            let _pokemon = _player.pokemons.get(_status?.inflictor.pokemon!);
            _pokemon!.kills++;
          } else if (from && from === '[from] Stealth Rock') {
          } else {
            // Normal Kill
            if (this._data.players.get(pokemon.player === 'p1' ? 'p2' : 'p1')!.pokemons) {
              let current = this._data.players.get(pokemon.player === 'p1' ? 'p2' : 'p1')?.current_pokemon!;
              this._data.players.get(pokemon.player === 'p1' ? 'p2' : 'p1')!.pokemons.get(current)!.kills++;
            }
          }
          let current = this._data.players.get(pokemon.player)!.current_pokemon;

          this._data.players.get(pokemon.player)!.score--;
          this._data.players.get(pokemon.player)!.pokemons.get(current)!.isDead = true;
          console.log('Kill ', this._data.players.get(pokemon.player === 'p1' ? 'p2' : 'p1')?.current_pokemon);
          console.log('Kills', this._data.players.get(pokemon.player === 'p1' ? 'p2' : 'p1')?.pokemons);
        }
      } catch (err) {
        console.error(err);

        return null;
      }
    });
  }

  public get data() {
    return this._data;
  }
}
