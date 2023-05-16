import * as ws from "ws";

export interface IWebsocketManager {

	connect(): Promise<void>;
	sendCommand(command: string, data: string[]): Promise<void>;
	saveReplay(battleId: string): Promise<void>;
	requestReplay(data: any): Promise<any>;
	leaveBattle(battleId: string): Promise<any>;
	joinBattle(battleId: string, listener: (battle: any) => void): Promise<void>;
	disconnect(): Promise<void>;
}