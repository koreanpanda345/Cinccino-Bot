import { Collection } from 'discord.js';
import { Status } from '../constants/status';

export type BattleDataType = {
  winner: string;
  players: Collection<string, BattlePlayerData>;
  field: BattleFieldData;
  turns: number;
  format: string;
  replay: string;
  details: {
    type: 'status' | 'hazards' | 'normal';
    turn: number;
    killer: string;
    kille: string;
    method: string;
  }[];
};

export type BattleFieldData = {
  weather: {
    condition: string,
    side: string,
    pokemon: string,
  }
  hazards: Collection<string, Collection<string, string>>;
  status: Collection<string, Collection<string, string>>;
};

export type BattlePlayerData = {
  username: string;
  current_pokemon: string;
  score: number;
  pokemons: Collection<string, BattlePokemonData>;
};

export type BattlePokemonData = {
  nickname: string;
  name: string;
  forme: string;
  kills: number;
  isDead: boolean;
};

