import { ButtonInteraction, Collection } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { IEvent } from "../interfaces/IEvent";
import { IMonitor } from "../interfaces/IMonitor";
import { ShowdownBattle } from "../../Showdown/models/ShowdownBattle";
import { BattleSystem } from "../system/BattleSystem";

export const cache = {
	bot: {
		commands: new Collection<string, ICommand>(),
		events: new Collection<string, IEvent>(),
		monitors: new Collection<string, IMonitor>(),
		interactions: {
			buttons: new Collection<string, (ctx: ButtonInteraction) => Promise<unknown>>(),
		}
	},
	showdown: {
		battles: new Collection<string, BattleSystem>(),
	}
}