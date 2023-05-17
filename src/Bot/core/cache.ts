import { ButtonInteraction, Collection } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { IEvent } from "../interfaces/IEvent";
import { IMonitor } from "../interfaces/IMonitor";
import { ShowdownBattle } from "../../Showdown/models/ShowdownBattle";
import { BattleSystem } from "../system/BattleSystem";
import { Types, Document } from "mongoose";
import { ISubscription } from "../../Database/models/Subscriptions";

export const cache = {
	bot: {
		commands: new Collection<string, ICommand>(),
		events: new Collection<string, IEvent>(),
		monitors: new Collection<string, IMonitor>(),
		interactions: {
			buttons: new Collection<string, (ctx: ButtonInteraction) => Promise<unknown>>(),
		}
	},
	database: {
		subscriptions: new Collection<string, Document<unknown, {}, ISubscription> & Omit<ISubscription & {
			_id: Types.ObjectId;
		}, never>>(),
		// subscriptions: new Collection<string, Document<unknown, {}, ISubscription> & Omit<ISubscription & {
		// 	_id: Types.ObjectId;
		// }>(),
	},
	showdown: {
		battles: new Collection<string, BattleSystem>(),
	}
}