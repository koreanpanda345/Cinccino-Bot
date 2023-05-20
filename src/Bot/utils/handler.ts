import { CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import { cache } from '../core/cache';
import { CommandContext } from '../core/commandContext';

export async function handleMonitor(name: string, ...args: any[]) {
  try {
    let monitor = cache.bot.monitors.get(name);

    if (!monitor) {
      console.warn(`Monitor ${name} does not exist`);
      return null;
    }

    if (monitor.disabled) {
      console.warn(`Monitor ${name} is disabled right now.`);
      return null;
    }
    console.log(...args);
    await monitor.invoke(...args);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function handleCommand(name: string, ctx: CommandInteraction, args: CommandInteractionOptionResolver) {
  try {
    let command = cache.bot.commands.get(name);

    if (!command) {
      console.warn(`Command ${name} does not exist`);
      return null;
    }

    if (command.disabled) {
      console.warn(`Command ${name} is disabled right now.`);
      return null;
    }
    await command.invoke(new CommandContext(ctx, args));
  } catch (err) {
    console.error(err);
    return null;
  }
}
