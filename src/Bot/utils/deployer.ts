import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import { cache } from '../core/cache';
import { client } from '../core/client';

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const supportCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
cache.bot.commands.forEach((x) => {
  if (x.supportServerOnly) supportCommands.push(x.data.toJSON());
  else commands.push(x.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN as string);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    console.log(`Started refreshing ${supportCommands.length} application (/) guild commands.`);
    const data: any = await rest.put(
      Routes.applicationGuildCommands(client.user?.id as string, process.env.TEST_GUILD_ID as string),
      { body: commands },
    );
    const supportData: any = await rest.put(
      Routes.applicationGuildCommands(client.user?.id as string, process.env.TEST_GUILD_ID as string),
      { body: supportCommands },
    );
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    console.log(`Successfully reloaded ${supportData.length} application (/) guild commands.`);
  } catch (err) {
    console.error(err);
    return null;
  }
})();
