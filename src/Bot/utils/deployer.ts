import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { cache } from "../core/cache";
import { client } from "../core/client";

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

cache.bot.commands.forEach((x) => commands.push(x.data.toJSON()));

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN as string);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data: any = await rest.put(Routes.applicationGuildCommands(client.user?.id as string, process.env.TEST_GUILD_ID as string), { body: commands });

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (err) {
		console.error(err);
		return null;
	}
})()