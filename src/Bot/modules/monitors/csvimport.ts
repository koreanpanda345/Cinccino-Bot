import { ButtonInteraction } from 'discord.js';
import { createMontior } from '../../utils/creator';

createMontior({
  id: 'csv_import',
  invoke: async (ctx: ButtonInteraction) => {
    let team1Cvs = '';
    let team2Cvs = '';

    let msg = '';

    let embed = ctx.message.embeds[0];

    let desc = embed.description;
    msg += `Winner: ${desc?.split('||')[1]}\n`;
    msg += `Score: ${desc?.split('||')[3].replace('\n', '').trim()}\n`;
    msg += `\n`;
    let fields = embed.fields;
    msg += `${fields[0].name}\n`;
    for (let poke of embed.fields[0].value.split('||')[1].split('\n')) {
      if (poke !== '')
        msg += `${poke.split('|')[0].trim()},${poke.split('|')[1].replace(' Kills', '').trim()},${poke
          .split('|')[2]
          .replace(' Deaths', '')
          .trim()}\n`;
    }
    msg += `\n`;
    msg += `${fields[1].name}\n`;
    for (let poke of embed.fields[1].value.split('||')[1].split('\n')) {
      if (poke !== '')
        msg += `${poke.split('|')[0].trim()},${poke.split('|')[1].replace(' Kills', '').trim()},${poke
          .split('|')[2]
          .replace(' Deaths', '')
          .trim()}\n`;
    }

    ctx.reply({
      content: msg,
      ephemeral: true,
    });
  },
});
