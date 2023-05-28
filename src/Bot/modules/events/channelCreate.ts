import { ChannelType, GuildChannel, TextChannel } from 'discord.js';
import { createEvent } from '../../utils/creator';
import { SubscriptionDatabase } from '../../../Database/classes/subscriptions';

createEvent({
  name: 'Channel Created',
  id: 'channelCreate',
  invoke: async (channel: GuildChannel) => {
    let guild = channel.guild;

    let sub = new SubscriptionDatabase();

    // if(!sub.checkIfServerIsPremium(guild.id)) return;
    console.log(guild);
    console.log(channel);
    if (channel.name.endsWith('live-battles')) {
      const chan = channel as TextChannel;
      await chan.setTopic('\nConfigurations:\nstyle=Pretty');
      console.log('success');
      try {
        let name = channel.name.split('live-battles')[0];
        await guild.channels.create({
          name: `${name}match-results`,
          parent: channel.parentId,
          type: ChannelType.GuildText,
        });
      } catch (err) {
        console.log(err);
        return;
      }
    }
  },
});
