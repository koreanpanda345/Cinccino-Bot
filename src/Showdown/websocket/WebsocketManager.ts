import { ShowdownClient } from '../client/ShowdownClient';
import { IWebsocketManager } from '../interfaces/IWebsocketManager';
import * as ws from 'ws';
import { ShowdownSettings } from '../types/ShowdownSettings';
import { stringify } from 'querystring';
import { ServerURLs } from '../constants/urls';
import axios from 'axios';
import { ShowdownBattle } from '../models/ShowdownBattle';
import ReadyAction from '../actions/ReadyAction';
export class WebsocketManager implements IWebsocketManager {
  private _ws: ws;

  constructor(private _client: ShowdownClient, private _settings: ShowdownSettings) {
    this._ws = new ws(this._settings.server);
  }

  async connect(): Promise<void> {
    this._ws
      .on('open', (_: WebSocket) => {
        this._client.emit('connected');
        this._ws.on('message', async (data) => {
          this._client.emit('debug', data.toString());
          await this.processCommand(data.toString());
        });
      })
      .on('error', (err) => {
        this._client.emit('error', err);
      })
      .on('close', (code, reason) => {
        this._client.emit('disconnected', code, reason.toString());
      });
  }
  async sendCommand(command: string, data: string[]): Promise<void> {
    const cmd = `|/${command} ${data.join(', ')}`;

    this._ws.on(cmd, (err) => {
      if (err) {
        console.log(err);
        return null;
      }
    });
  }
  async saveReplay(battleId: string): Promise<void> {
    this._ws.send(`${battleId}|/savereplay`);
  }
  requestReplay(data: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async leaveBattle(battleId: string) {
    const cmd = `${battleId}|/leave`;
    this._ws.send(cmd, (err) => {
      if (err) {
        console.error(err);
        return null;
      }
    });
  }
  async joinBattle(battleId: string, listener: (battle: ShowdownBattle) => void): Promise<void> {
    const cmd = `|/join ${battleId}`;

    this._ws.send(cmd, (err) => {
      if (err) {
        console.error(err);
        return null;
      }
      const battle = new ShowdownBattle(battleId);
      listener(battle);
      this._ws.on('message', (rawdata) => {
        const data = rawdata.toString();
        const lines = data.split('\n');
        for (const line of lines) {
          if (line.startsWith('|')) {
            const sections = line.split('|');
            sections.shift();
            const command = sections.shift();
            battle.addLine(command as string, sections);
          }
        }
      });
    });
  }
  async disconnect(): Promise<void> {
    this._ws.close(1000, `Disconnected from server ${this._settings.server}`);
  }

  private createLoginData(username: string, password: string, nonce: string) {
    return stringify({
      act: 'login',
      name: username.replace(/ +/g, '').toLowerCase(),
      pass: password,
      challstr: nonce,
    });
  }

  private async login(nonce: string) {
    const url = ServerURLs.LoginUrl.replace('<>', this._settings.name.toLowerCase());
    const data = this.createLoginData(this._settings.credentials.username, this._settings.credentials.password, nonce);

    const response = await axios.post(url, data);

    let json;

    try {
      json = JSON.parse((response.data as string).substring(1));
    } catch (err) {
      console.log(err);
      return null;
    }

    return json;
  }

  private async processCommand(str: string) {
    const sections = str.split('|');
    sections.shift();
    const topic = sections.shift()?.toLowerCase();
    switch (topic) {
      case 'queryresponse':
        this._client.emit('queryresponse', str);
        break;
      case 'challstr':
        console.log(str);
        const nonce = sections.join('|');
        const client = await this.login(nonce);
        const { assertion, actionsuccess, curuser } = client;

        if (!actionsuccess) {
          console.error(
            `Could not connect to server ${this._settings.server} with username: ${this._settings.credentials.username}`,
          );
          return null;
        } else if (assertion) {
          console.log(assertion);
          this._ws.send(`|/trn ${this._settings.credentials.username},0,${assertion}|`, (err) => {
            if (err) {
              console.error(err);
              return null;
            } else {
              console.log('success');
            }
          });

          await ReadyAction(this._client, client);
        }
        break;
    }
  }
}
