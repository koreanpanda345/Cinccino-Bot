import { ChannelType, Message } from "discord.js";
import { createMontior } from "../../utils/creator";
import { SubscriptionDatabase } from "../../../Database/classes/subscriptions";
import { handleMonitor } from "../../utils/handler";

createMontior({
	id: "premium_check",
	invoke: async (message: Message) => {
		if(message.channel.type === ChannelType.DM) return;

		let sub = new SubscriptionDatabase();

		await handleMonitor('configurations', message, sub.checkIfServerIsPremium(message.guildId!));
	}
})