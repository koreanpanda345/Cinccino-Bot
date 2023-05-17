import { ActivityType } from 'discord.js';
import { client } from '../../core/client';
import { createEvent } from '../../utils/creator';

createEvent({
  name: 'Ready Event',
  id: 'ready',
  invoke: async () => {
    console.log('Client is ready');
    let status = process.env.STATUS as string;

    if(status === "PRODUCTION") {
      client.user?.setActivity({
        name: 'how cute I am!!',
        type: ActivityType.Watching,
      });
      client.user?.setStatus("online");
    } else if(status === "DEVELOPMENT") {
      client.user?.setActivity("Please do not use me at the moment. I am being worked on ^-^ I might leave due to being work on. Please wait till you see my normal status");
      client.user?.setStatus("dnd");
    }


    await import('./../../utils/deployer');
  },
});
