import { EventEmitter } from 'events';
import { IShowdownBattle } from '../interfaces/IShowdownBattle';
import { PokemonId } from '../types/PokemonId';

export class ShowdownBattle extends EventEmitter implements IShowdownBattle {
  private _data: string[] = [];
  constructor(private _battleId: string) {
    super();
  }
  addLine(command: string, sections: string[]): void {
    this._data.push(`|${command}|${sections.join('|')}`);
    switch (command) {
      // Battle Initialization
      case 'player':
        this.emit('player', sections[0] as 'p1' | 'p2', sections[1], sections[2], Number(sections[3]));
        break;
      case 'teamsize':
        this.emit('teamsize', sections[0] as 'p1' | 'p2', Number(sections[1]));
        break;
      case 'gametype':
        this.emit('gametype', sections[0]);
        break;
      case 'gen':
        this.emit('gen', Number(sections[0]));
        break;
      case 'tier':
        this.emit('tier', sections[0]);
        break;
      case 'rated':
        this.emit('rated', sections[0]);
        break;
      case 'rule':
        this.emit('rule', sections[0].split(':')[0], sections[0].split(':')[1].trim());
        break;
      case 'clearpoke':
        this.emit('clearpoke');
        break;
      case 'poke':
        console.log(sections);
        this.emit(
          'poke',
          {
            player: sections[0],
            pokemon: sections[1],
          },
          sections[2],
        );
        break;
      case 'start':
        this.emit('start');
        break;
      // Battle Progress
      case '|':
        break;
      case 'request':
        this.emit('request', JSON.parse(sections[0]));
        break;
      case 'inactive':
        this.emit('inactive', sections[0]);
        break;
      case 'inactiveoff':
        this.emit('inactiveoff', sections[0]);
        break;
      case 'upkeep':
        this.emit('upkeep');
        break;
      case 'turn':
        this.emit('turn', Number(sections[0]));
        break;
      case 'win':
        this.emit('win', sections[0]);
        break;
      case 'tie':
        this.emit('tie');
        break;
      case 't:':
        this.emit('t:', new Date(sections[0]));
        break;
      // Identifying Pokemon
      case 'switch':
      case 'drag':
        this.emit('switchAndDrag', this.getPokemonDetails(sections[0]), [
          Number(sections[2].split('/')[0]),
          Number(sections[2].split('/')[1]),
        ]);
        break;
      case 'faint':
        this.emit('faint', this.getPokemonDetails(sections[0]));
        break;
      case 'move':
        this.emit(
          'move',
          this.getPokemonDetails(sections[0]),
          sections[2] === '' ? '' : this.getPokemonDetails(sections[2]),
          sections[1],
        );
        break;
      case 'detailschange':
      case '-formechange':
        this.emit('detailschangeAndFormechange', this.getPokemonDetails(sections[0]), [
          Number(sections[1].split('/')[0]),
          Number(sections[1].split('/')[1]),
        ]);
        break;
      case 'replace':
        this.emit('replace', this.getPokemonDetails(sections[0]), [
          Number(sections[1].split('/')[0]),
          Number(sections[1].split('/')[1]),
        ]);
        break;
      case 'swap':
        this.emit('swap', sections[0], Number(sections[1]));
        break;
      // Minor Actions
      case '-sidestart':
        this.emit('-sidestart', sections[0], sections[1]);
        break;
      case '-sideend':
        this.emit('-sideend', sections[0], sections[1]);
        break;
      case '-status':
        this.emit('-status', this.getPokemonDetails(sections[0]), sections[1]);
        break;
      case '-curestatus':
        this.emit('-curestatus', this.getPokemonDetails(sections[0]), sections[1]);
        break;
      case '-cureteam':
        this.emit('-cureteam', this.getPokemonDetails(sections[0]));
        break;
      case '-swapsidecondition':
        this.emit('-swapsidecondition');
        break;
      case '-damage':
        this.emit(
          '-damage',
          this.getPokemonDetails(sections[0]),
          sections.length > 1 ? sections[1] : undefined,
          sections.length > 2 ? sections[2] : undefined,
        );
        break;
      case '-weather':
          this.emit('-weather', sections[0], sections.length > 1 ? sections[1] : undefined, sections.length > 2 ? sections[2] : undefined);
          break;
      // Default
      default:
      // console.log('Battle Command not implemented yet.');
    }
  }

  private getPokemonDetails(str: string) {
    const player = str.split(':')[0];
    const pokemon = str.split(':')[1].trim();
    const data: PokemonId = {
      player: (player[0] + player[1]) as 'p1' | 'p2' | 'p3' | 'p4',
      position: player[2] as 'a' | 'b',
      pokemon: pokemon.split(',')[0],
    };

    return data;
  }

  public toLog() {
    return this._data.join('\n');
  }

  public toJson() {
    const json: {
      [key: string]: {
        [key: string]: string;
      };
    } = {};

    let turn = 0;
    for (const line of this._data) {
      if (line.startsWith('|turn|')) {
        turn++;
      } else {
        console.log(json);
        json[turn][`${line.split('|')[1]}`] = line.split('|')[2];
      }
    }

    return json;
  }

  public get data() {
    return this._data;
  }
}
