import { ActivityType } from 'discord.js';
import { client } from '../../core/client';
import { createEvent } from '../../utils/creator';

createEvent({
  name: 'Ready Event',
  id: 'ready',
  invoke: async () => {
    console.log('Client is ready');

    client.user?.setActivity({
      name: 'how cute I am!!',
      type: ActivityType.Watching,
    });

    await import('./../../utils/deployer');
  },
});
