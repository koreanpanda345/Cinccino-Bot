import {
  ActionRowBuilder,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Guild,
  TextChannel,
} from 'discord.js';
import { createEvent } from '../../utils/creator';
import { client } from '../../core/client';

createEvent({
  name: 'Guild Create Event',
  id: 'guildCreate',
  invoke: async (guild: Guild) => {
    if (guild.members.me?.permissions.has('ManageChannels')) {
      if (!guild.channels.cache.find((x) => x.name.includes('live-battles')))
        await guild.channels.create({
          name: 'live-battles',
          topic: 'Configurations:\n-ping',
        });
      if (!guild.channels.cache.find((x) => x.name.includes('match-results')))
        await guild.channels.create({
          name: 'match-results',
          topic: 'Configurations:\n-embed',
        });
      let livechannel = guild.channels.cache.find((x) => x.name.includes('live-battles'));
      let resultchannel = guild.channels.cache.find((x) => x.name.includes('match-results'));
      let general = guild.channels.cache.find((x) => x.name.includes('general'));
      if (!general) return;
      if (!guild.members.me.permissionsIn(general).has('SendMessages')) return;

      let embed = new EmbedBuilder();

      embed.setTitle('Setup is complete!!!');

      embed.setDescription(
        'Here is a brief summary on how to use me.\n\n' +
          `Put live battle links in ${livechannel}\n` +
          `I will then join the showdown battle.\n` +
          `Once the battle is done, I will send the match results to ${resultchannel}\n\n` +
          `That is all ^-^. If you need help, questions, or found a bug, make sure to join the support server\n`,
      );

      client.user?.setActivity({
        name: `How cute I am in ${client.guilds.cache.size} Server`,
        type: ActivityType.Watching,
      });

      embed.setColor('Green');

      embed.setAuthor({
        name: client.user?.username!,
        iconURL: client.user?.displayAvatarURL(),
      });

      let actionRow = new ActionRowBuilder<ButtonBuilder>();

      let serverButton = new ButtonBuilder();

      //   serverButton.setCustomId('server_invite_btn');
      serverButton.setLabel('Join Support Server');
      serverButton.setURL('https://discord.gg/CAEa75PJ6u');
      serverButton.setStyle(ButtonStyle.Link);

      actionRow.addComponents(serverButton);

      (general as TextChannel).send({
        embeds: [embed],
        components: [actionRow],
      });
    } else {
      return;
    }
  },
});
