import { IShowdownBattleEvents } from "./IShowdownBattleEvents";

export interface IShowdownBattle {
	on<Event extends keyof IShowdownBattleEvents>(event: Event, listener: IShowdownBattleEvents[Event]): this;
	off<Event extends keyof IShowdownBattleEvents>(event: Event, listener: IShowdownBattleEvents[Event]): this;
	emit<Event extends keyof IShowdownBattleEvents>(event: Event, ...args: Parameters<IShowdownBattleEvents[Event]>): boolean;

	addLine(command: string, sections: string[]): void;
}