import { ButtonInteraction } from 'discord.js';
import { createMontior } from '../../../utils/creator';

createMontior({
  id: 'csv_import',
  invoke: async (ctx: ButtonInteraction) => {
    let msg = '';

    let embed = ctx.message.embeds[0];

    let desc = embed.description;
    msg += `Winner: ${desc?.split('||')[1]}\n`;
    msg += `Score: ${desc?.split('||')[3].replace('\n', '').trim()}\n`;
    msg += `\n`;
    let fields = embed.fields;
    console.log(fields);
    msg += `${fields[0].name}\n`;

    for (let poke of embed.fields[0].value.split('||')[1].split('\n')) {
      if (poke !== '') {
        if (poke.includes('|')) {
          msg += `${poke.split('|')[0].trim()},${poke.split('|')[1].replace(' Kills', '').trim()},${poke
            .split('|')[2]
            .replace(' Deaths', '')
            .trim()}\n`;
        } else {
          msg += `${poke.split('has')[0].replace('**', '').trim().replace('**', '')},${poke
            .split('has')[1]
            .split('Kills')[0]
            .trim()
            .replace('**', '')},${poke.split('and')[1].split('Deaths')[0].trim().replace('**', '')}\n`;
        }
      }
    }
    msg += `\n`;
    msg += `${fields[1].name}\n`;
    for (let poke of embed.fields[1].value.split('||')[1].split('\n')) {
      if (poke !== '') {
        if (poke.includes('|')) {
          msg += `${poke.split('|')[0].trim()},${poke.split('|')[1].replace(' Kills', '').trim()},${poke
            .split('|')[2]
            .replace(' Deaths', '')
            .trim()}\n`;
        } else {
          msg += `${poke.split('has')[0].replace('**', '').trim().replace('**', '')},${poke
            .split('has')[1]
            .split('Kills')[0]
            .trim()
            .replace('**', '')},${poke.split('and')[1].split('Deaths')[0].trim().replace('**', '')}\n`;
        }
      }
    }

    ctx.reply({
      content: msg,
      ephemeral: true,
    });
  },
});
