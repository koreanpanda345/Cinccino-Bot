import { cache } from "../core/cache";
import { client } from "../core/client";
import { ICommand } from "../interfaces/ICommand";
import { IEvent } from "../interfaces/IEvent";
import { IMonitor } from "../interfaces/IMonitor";

export function createEvent(event: IEvent) {
	try {
		if(cache.bot.events.has(event.name)) return;

		cache.bot.events.set(event.name, event);

		if(event.onlyOnce) client.once(event.id, async (...args: any[]) => await event.invoke(...args));
		else client.on(event.id, async (...args: any[]) => await event.invoke(...args));

		console.log(`Create event ${event.id}`);
	} catch (err) {
		console.error(err);
		return null;
	}
}

export function createMontior(monitor: IMonitor) {
	try {
		if(cache.bot.monitors.has(monitor.id)) return;

		cache.bot.monitors.set(monitor.id, monitor);

		console.log(`Created Monitor ${monitor.id}`);
	} catch (err) {
		console.error(err);
		return null;
	}
}

export function createCommand(command: ICommand) {
	try {
		if(cache.bot.commands.has(command.data.name)) return;

		cache.bot.commands.set(command.data.name, command);

		console.log(`Created Slash Command ${command.data.name}`);
	} catch (err) {
		console.error(err);
		return null;
	}
}