import { ActivityType } from 'discord.js';
import { client } from '../../core/client';
import { createEvent } from '../../utils/creator';

createEvent({
  name: 'Ready Event',
  id: 'ready',
  invoke: async () => {
    console.log('Client is ready');
    let status = process.env.STATUS as string;

    if (status === 'PRODUCTION') {
      client.user?.setActivity({
        name: `How cute I am in ${client.guilds.cache.size} Server`,
        type: ActivityType.Watching,
      });
      client.user?.setStatus('online');
    } else if (status === 'DEVELOPMENT') {
      client.user?.setActivity({
        name: `How cute I am in ${client.guilds.cache.size} Server`,
        type: ActivityType.Watching,
      });
      client.user?.setStatus('dnd');
    }

    await import('./../../utils/deployer');
  },
});
