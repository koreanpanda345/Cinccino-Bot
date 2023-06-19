// import { Collection } from 'discord.js';
// import { BattleDataType, BattlePlayerData, BattlePokemonData } from '../structure/BattleData';
// import { ShowdownBattle } from '../../Showdown/models/ShowdownBattle';
// import { PokemonId } from '../../Showdown/types/PokemonId';
// import { Status } from '../constants/status';
// import { type } from 'os';

// export class BattleSystem {
//   private _data: BattleDataType = {
//     winner: '',
//     players: new Collection<string, BattlePlayerData>(),
//     field: {
//       weather: ['', '', ''],
//       hazards: new Collection(),
//     },
//     turns: 0,
//     format: '',
//     replay: '',
//     details: [],
//   };
//   private _current_move = '';
//   constructor(private _battle: ShowdownBattle) {
//     ///////////////////////// Set Hazards ////////////////////////////
//     this._data.field.hazards.set('Stealth Rocks', new Collection());
//     this._data.field.hazards.set('Spikes', new Collection());
//     this._data.field.hazards.set('Toxic Spikes', new Collection());
//     /////////////////////////////////////////////////////////////////

//     // Setup the player's data
//     _battle.on('player', (player, username, avatar, rating) => {
//       this._data.players.set(player, {
//         username,
//         score: 6,
//         hazard_setters: new Collection(),
//         status_inflictor: new Collection(),
//         current_pokemon: '',
//         pokemons: new Collection<string, BattlePokemonData>(),
//       });
//     });
//     // Who is the winner
//     _battle.on('win', (user) => {
//       this._data.winner = user;
//     });
//     // New Turn
//     _battle.on('turn', (turn) => {
//       this._data.turns = turn;
//     });
//     // The format of the match
//     _battle.on('tier', (tier) => {
//       this._data.format = tier;
//     });
//     // The pokemon's data object
//     _battle.on('poke', (data: { player: string; pokemon: string }, other: string[]) => {
//       let name = data.pokemon.includes(', ') ? data.pokemon.split(', ')[0] : data.pokemon;
//       if (!this._data.players.get(data.player)?.pokemons.has(name)) {
//         this._data.players.get(data.player)?.pokemons.set(name, {
//           nickname: name || '',
//           name: name,
//           forme: '',
//           kills: 0,
//           isDead: false,
//         });
//       }
//     });
//     // If a pokemon changes for some reason. Example is zoroark's Illusion. :'(
//     _battle.on('detailschange', (player: string, old: string, _new: string) => {
//       this._data.players.get(player)!.current_pokemon = _new;

//       let old_pokemon = this._data.players.get(player)!.pokemons.find((x) => x.nickname === old);
//       this._data.players.get(player)!.pokemons.set(_new, old_pokemon!);
//       this._data.players.get(player)!.pokemons.delete(old_pokemon?.name!);
//       this._data.players.get(player!)!.pokemons.get(_new)!.forme = _new;
//       this._data.players.get(player)!.pokemons.get(_new)!.name = _new;
//     });
//     // When a pokemon switches in, or is dragged out.
//     _battle.on('switchAndDrag', (pokemon: PokemonId, hp: [number, number]) => {
//       if (
//         !this._data.players.get(pokemon.player)?.pokemons.has(pokemon.pokemon) ||
//         !this._data.players.get(pokemon.player)?.pokemons.find((x) => x.name === pokemon.pokemon)
//       ) {
//         this._data.players.get(pokemon.player)?.pokemons.set(pokemon.pokemon, {
//           nickname: pokemon.name || '',
//           name: pokemon.pokemon,
//           forme: pokemon.name?.includes('-mega') ? pokemon.name : '',
//           kills: 0,
//           isDead: false,
//         });
//       }
//       let poke = this._data.players.get(pokemon.player)?.pokemons.find((x) => x.name === pokemon.pokemon);
//       if (poke?.nickname !== pokemon.name) poke!.nickname = pokemon.name!;

//       const player = pokemon.player;
//       this._data.players.get(player)!.current_pokemon = this._data.players
//         .get(player)!
//         .pokemons.get(pokemon.pokemon)!.name;
//     });
//     // If a pokemon is inflicted with a status.
//     _battle.on('-status', (pokemon: PokemonId, status: string) => {
//       const player = pokemon.player;
//       let defPlayer = this._data.players.get(pokemon.player);
//       let atkPlayer = this._data.players.get(pokemon.player === 'p1' ? 'p2' : 'p1');
//       console.debug(atkPlayer?.hazard_setters)
//       if (['psn', 'brn', 'tox'].includes(status)) {
//         // We are checking to see if the previous line was not a move, and if there are tspikes set.
//         let lastLine = this._battle.data[this._battle.data.length - 2];
//         // If status is Toxic AND last line of turns does NOT start with "|move"
//         // AND Hazards does include Toxic Spikes on the inflictee's side.
//         if (
//           status == 'psn' &&
//           !lastLine?.startsWith('|move') &&
//           this._data.field.hazards.get('Toxic Spikes')?.get(player == 'p1' ? 'p2' : 'p1')
//         ) {
//           atkPlayer!.status_inflictor.set(defPlayer!.current_pokemon, {
//             inflictor: {
//               side: pokemon.player === 'p1' ? 'p2' : 'p1',
//               pokemon: atkPlayer!.pokemons.get(this._data.field.hazards.get('Toxic Spikes')?.get(pokemon.player)!)
//                 ?.name!,
//             },
//             status: status,
//             inflicte: {
//               side: pokemon.player as 'p1' | 'p2',
//               pokemon: defPlayer?.current_pokemon!,
//             },
//           });
//         } else {
//           atkPlayer?.status_inflictor.set(this._data.players.get(player)!.current_pokemon, {
//             inflictor: {
//               side: pokemon.player === 'p1' ? 'p2' : 'p1',
//               pokemon: this._data.players.get(player === 'p1' ? 'p2' : 'p1')?.current_pokemon!,
//             },
//             status: status,
//             inflicte: {
//               side: pokemon.player as 'p1' | 'p2',
//               pokemon: this._data.players.get(player)!.current_pokemon,
//             },
//           });
//         }
//       }
//     });
//     // When a side effect starts. Usually invokes hazards.
//     _battle.on('-sidestart', async (side: string, condition: string) => {
//       if (['move: Stealth Rock', 'move: Spikes', 'move: Toxic Spikes'].includes(condition)) {
//         let player = side.split(':')[0];

//         let _player = this._data.players.get(player === 'p1' ? 'p2' : 'p1');
//         let _con = condition.includes(':') ? condition.split(':')[1].trim() : condition.trim();
//         this._data.field.hazards.get(_con)?.set(player, _player?.current_pokemon!);
//         console.debug(this._data.field.hazards);
//         // _player?.hazard_setters.set(_con, _player.current_pokemon);
//       }
//     });
//     // When a side effect ends. Usually invokes hazards.
//     _battle.on('-sideend', async (side: string, condition: string) => {
//       if (['move: Stealth Rock', 'Spikes', 'Toxic Spikes'].includes(condition)) {
//         let player = side.split(':')[0];
//         let _player = this._data.players.get(player === 'p1' ? 'p2' : 'p1');
//         let _con = condition.includes(':') ? condition.split(':')[1].trim() : condition.trim();
//         this._data.field.hazards.get(_con)?.delete(player);
//         // _player?.hazard_setters.delete(_con);
//       }
//     });
//     // Weather check.
//     _battle.on('-weather', (weather: string, from?: string, _of?: string) => {
//       if (_of) {
//         let side = _of.split(':')[0].split(' ')[1];
//         let player = this._data.players.get(side[0] + side[1]);
//         this._data.field.weather = [
//           weather,
//           player!.pokemons.find((x) => x.nickname === _of.split(':')[1].trim())!.name,
//           side,
//         ];
//       }
//     });
//     // When a move is used.
//     _battle.on('move', async (attacker: PokemonId, target: PokemonId | string, move: string) => {
//       this._current_move = move;
//       if (
//         [
//           'Explosion',
//           'Self-Destruct',
//           'Misty Explosion',
//           'Memento',
//           'Healing Wish',
//           'Final Gambit',
//           'Lunar Dance',
//         ].includes(move) ||
//         (['Curse'].includes(move) && !(typeof target === 'string' || typeof target === 'undefined'))
//       ) {
//         this._data.players.get(attacker.player)!.pokemons.find((x) => x.nickname === attacker.name)!.isDead = true;
//         this._data.players.get(attacker.player)!.score--;
//       }
//     });
//     // When damage is inflicted.
//     // There is a reason why we are treating this event as the faint event, and not
//     // the actual faint event. We need reasons why they fainted, which the faint event
//     // does not provide. we could create a temp varible to collect that data from this event,
//     // and invoke the faint event, and piovt the data in, but that is a bit more work for no reason.
//     _battle.on('-damage', async (pokemon: PokemonId, hp: string, from?: string) => {
//       try {
//         // Setup
//         let atkPlayer = this._data.players.get(pokemon.player === 'p1' ? 'p2' : 'p1')!;
//         let defPlayer = this._data.players.get(pokemon.player)!;
//         // We are checking if the damage caused the pokemon to faint.
//         if (hp === '0 fnt') {
//           // Death caused by status.
//           if (from && ['[from] psn', '[from] brn'].includes(from)) {
//             let _status = atkPlayer?.status_inflictor.get(
//               defPlayer.pokemons.find((x) => x.nickname === pokemon.name)!.name,
//             );

//             atkPlayer.pokemons.get(_status!.inflictor.pokemon)!.kills++;

//             // Detailed Death
//             // Porygon Died to Poison that was inflicted by Cinccino

//             this._data.details.push({
//               type: 'status',
//               turn: this._data.turns,
//               killer: _status?.inflictor.pokemon!,
//               kille: _status?.inflicte.pokemon!,
//               method: `died to ${_status?.status!} that was inflicted by`,
//             });
//           }
//           // Next we are checking if death was caused by hazards.
//           // We are excluding tspikes because it can't cause damage. it only inflicts statuses.
//           else if (from && ['[from] Stealth Rock', '[form] Spikes'].includes(from)) {
//             let hazard = from.split(']')[1].trim();

//             let setter = this._data.field.hazards.get(hazard)?.get(pokemon.player === 'p1' ? 'p2' : 'p1');

//             atkPlayer.pokemons.get(setter!)!.kills++;

//             // Detailed Death
//             //Porygon died to Stealth Rocks that was lefted by Cinccino

//             this._data.details.push({
//               type: 'hazards',
//               turn: this._data.turns,
//               killer: atkPlayer.pokemons.get(setter!)?.name!,
//               kille: defPlayer.pokemons.get(defPlayer.current_pokemon)?.name!,
//               method: `died to ${hazard} that was lefted by`,
//             });
//           }
//           // Else we are assuming that this was death caused by normal means,
//           // a move was used causing damage to the kille.
//           else {
//             atkPlayer.pokemons.get(atkPlayer.current_pokemon!)!.kills++;

//             // Detailed Death
//             // Cinccino killed Porygon with Swfit

//             this._data.details.push({
//               type: 'normal',
//               turn: this._data.turns,
//               killer: atkPlayer.pokemons.get(atkPlayer.current_pokemon!)?.name!,
//               kille: defPlayer.pokemons.get(defPlayer.current_pokemon!)?.name!,
//               method: `with ${this._current_move}`,
//             });
//           }
//         }

//         defPlayer.score! -= 1;
//         defPlayer.pokemons.get(defPlayer.current_pokemon!)!.isDead = true;
//       } catch (err) {
//         console.error(err);

//         return null;
//       }
//     });
//   }

//   public get data() {
//     return this._data;
//   }
// }
