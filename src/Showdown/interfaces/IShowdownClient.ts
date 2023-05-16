import { ShowdownClientUser } from "../client/ShowdownClientUser";
import { IShowdownEvents } from "./IShowdownEvents";
import { IWebsocketManager } from "./IWebsocketManager";

export interface IShowdownClient {
	on<Event extends keyof IShowdownEvents>(event: Event, listener: IShowdownEvents[Event]): this;
	off<Event extends keyof IShowdownEvents>(event: Event, listener: IShowdownEvents[Event]): this;
	emit<Event extends keyof IShowdownEvents>(event: Event, ...args: Parameters<IShowdownEvents[Event]>): boolean;
	ws: IWebsocketManager;
	user?: ShowdownClientUser;
}