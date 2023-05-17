import { ChannelType, Message } from "discord.js";
import { createMontior } from "../../utils/creator";
import { SubscriptionDatabase } from "../../../Database/classes/subscriptions";
import { handleMonitor } from "../../utils/handler";

createMontior({
	id: "premium_check",
	invoke: async (message: Message) => {
		if(message.channel.type === ChannelType.DM) return;

		let sub = new SubscriptionDatabase();

		if(!sub.checkIfServerIsPremium(message.guildId!)) {
			await handleMonitor("showdown_battle", message);
		} else {
			await handleMonitor("premium_showdown_battle", message);
		}
	}
})