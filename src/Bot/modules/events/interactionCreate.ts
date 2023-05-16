import { ButtonInteraction, Interaction } from "discord.js";
import { createEvent } from "../../utils/creator";
import { handleMonitor } from "../../utils/handler";

createEvent({
	name: "Interaction Create",
	id: "interactionCreate",
	invoke: async (interaction: Interaction) => {
		
		if(interaction.isButton()) await handleMonitor('button', interaction as ButtonInteraction);
	}
});