import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../../utils/creator';
import { CommandContext } from '../../../core/commandContext';

let data = new SlashCommandBuilder();
data.setName('setup');
data.setDescription('Gives you a manual on how to setup Cinccino Bot');
createCommand({
  data,
  invoke: async (ctx: CommandContext) => {
    let row = new ActionRowBuilder<ButtonBuilder>();
    let btn = new ButtonBuilder();
    btn.setLabel('Manual');
    btn.setURL('https://docs.google.com/document/d/1WHK104RQSCB4kCqzpc4qDU-tuy0EpAOrajVr6g--SjE/edit?usp=sharing');
    btn.setStyle(ButtonStyle.Link);
    btn.setEmoji('📃');
    row.addComponents(btn);
    ctx.ctx.reply({
      content: `Below is a link to a google doc that will have all of the information you need!`,
      ephemeral: true,
      components: [row],
    });
  },
});
