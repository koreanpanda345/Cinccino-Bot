import { Collection } from 'discord.js';
import { Status } from '../constants/status';

export type BattleDataType = {
  winner: string;
  players: Collection<string, BattlePlayerData>;
  battle: {
            //Weather Pokemon Side
    weather: [string, string, string];
  };
  turns: number;
  format: string;
  replay: string;
  details: {
    type: "status" | "hazards" | "normal";
    turn: number;
    killer: string;
    kille: string;
    method: string;
  }[];
};

export type BattlePlayerData = {
  username: string;
  status_inflictor: Collection<string, BattleStatusInflictorType>;
  hazard_setters: Collection<string, string>;
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

export type BattleStatusInflictorType = {
  inflictor: {
    side: 'p1' | 'p2';
    pokemon: string;
  };
  status: string;
  inflicte: {
    side: 'p1' | 'p2';
    pokemon: string;
  };
};
