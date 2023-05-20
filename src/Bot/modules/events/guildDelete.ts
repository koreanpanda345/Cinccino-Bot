import { ActivityType, Guild } from 'discord.js';
import { createEvent } from '../../utils/creator';
import { client } from '../../core/client';

createEvent({
  name: 'Guild Delete Event',
  id: 'guildDelete',
  invoke: async (guild: Guild) => {
    client.user?.setActivity({
      name: `How cute I am in ${client.guilds.cache.size} Server`,
      type: ActivityType.Watching,
    });
  },
});
