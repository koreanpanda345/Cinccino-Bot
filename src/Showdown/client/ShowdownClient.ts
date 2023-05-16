import EventEmitter = require("events");
import { IShowdownClient } from "../interfaces/IShowdownClient";
import { ShowdownSettings } from "../types/ShowdownSettings";
import { WebsocketManager } from "../websocket/WebsocketManager";
import { IWebsocketManager } from "../interfaces/IWebsocketManager";
import { ShowdownClientUser } from "./ShowdownClientUser";

export class ShowdownClient extends EventEmitter implements IShowdownClient {
	ws: IWebsocketManager;
	user?: ShowdownClientUser;
	constructor(settings: ShowdownSettings) {
		super();
		this.ws = new WebsocketManager(this, settings);
	}
	
	public async connect() {
		try {
			await this.ws.connect();
		} catch(err) {
			console.error(err);
			return null;
		}
	}
}