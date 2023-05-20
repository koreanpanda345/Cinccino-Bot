import { Message, TextChannel } from 'discord.js';
import { createMontior } from '../../../utils/creator';
import { channel } from 'diagnostics_channel';
import { handleMonitor } from '../../../utils/handler';

createMontior({
  id: 'configurations',
  invoke: async (message: Message, premium: boolean) => {
    let channel = message.channel as TextChannel;
    let topic = channel.topic;
    console.log(topic);
    let _config = {
      ping: '',
      style: 'simple',
      forfeit_turns: 5,
      detailed: true,
    };
    if (!topic) return await handleMonitor('showdown_battle', _config);
    let config = topic?.split('Configurations:\n')[1].split('\n');
    config?.forEach((x) => {
      let value = x.split('=')[1].toLowerCase().trim();
      // Role to Ping
      if (x.startsWith('ping')) _config.ping = value;
      // Style to print the data out in
      if (x.startsWith('style')) _config.style = value;
      // What turn to consider a match to be a forfeit. (This is for matches that are restarted.)
      if (x.startsWith('forfeit turns')) _config.forfeit_turns = Number(value);
      // Whether or not to send the detailed important turns or not in the embed.
      if (x.startsWith('detailed')) _config.detailed = value === 'yes' ? true : value === 'no' ? false : true;
    });

    await handleMonitor('showdown_battle', message, premium, _config);
  },
});
