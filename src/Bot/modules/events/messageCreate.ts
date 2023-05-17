import { Message } from 'discord.js';
import { createEvent } from '../../utils/creator';
import { handleMonitor } from '../../utils/handler';
import { client } from '../../core/client';

createEvent({
  name: 'Message Event',
  id: 'messageCreate',
  invoke: async (message: Message) => {

    if (message.author.bot) return;

    try {
      const urlRegex = /(https?:\/\/[^ ]*)/;
      let url = message.content.match(urlRegex);
      console.log(url);
      if (url) {
        handleMonitor('showdown_battle', message);
      }
    } catch (err) {
      console.error(err);
      return;
    }
  },
});
