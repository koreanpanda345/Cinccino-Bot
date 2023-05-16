import { ButtonInteraction } from "discord.js";
import { createMontior } from "../../utils/creator";
import { cache } from "../../core/cache";

createMontior({
	id: 'button',
	invoke: async (ctx: ButtonInteraction) => {
		console.log(ctx);
		let btn = cache.bot.interactions.buttons.get(ctx.customId);

		if(!btn) return;

		await btn(ctx);
	}
});