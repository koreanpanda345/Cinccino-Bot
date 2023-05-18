import { PokemonId } from '../types/PokemonId';

export interface IShowdownBattleEvents {
  // Battle Initialization
  player: (player: 'p1' | 'p2', username: string, avatar: string, rating: number) => void;
  teamsize: (player: 'p1' | 'p2', size: number) => void;
  gametype: (gametype: string) => void;
  gen: (gen: number) => void;
  tier: (format: string) => void;
  rated: (message?: string) => void;
  rule: (name: string, description: string) => void;
  clearpoke: () => void;
  poke: (pokemon: PokemonId, item: string) => void;
  start: () => void;
  // Battle Progress
  request: (request: JSON) => void;
  inactive: (message: string) => void;
  inactiveoff: (message: string) => void;
  upkeep: () => void;
  turn: (turn: number) => void;
  win: (user: string) => void;
  tie: () => void;
  't:': (timestamp: Date) => void;
  // Identifying Pokemon
  move: (attacker: PokemonId, target: PokemonId | string, move: string) => void;
  switchAndDrag: (pokemon: PokemonId, hp: [number, number]) => void;
  replace: (pokemon: PokemonId, hp: [number, number]) => void;
  swap: (pokemon: string, position: number) => void;
  cant: (pokemon: string, reason: string, move?: string) => void;
  faint: (pokemon: PokemonId) => void;
  detailschange: (side: string, old: string, _new: string) => void;
  // Minor Actios
  '-sidestart': (side: string, condition: string) => void;
  '-sideend': (side: string, condition: string) => void;
  '-status': (pokemon: PokemonId, status: string) => void;
  '-curestatus': (pokemon: PokemonId, status: string) => void;
  '-cureteam': (pokemon: PokemonId) => void;
  '-swapsideconditions': () => void;
  '-damage': (pokemon: PokemonId, hp: string, from?: string) => void;
  '-weather': (weather: string, from?: string, of?: string) => void;
}
