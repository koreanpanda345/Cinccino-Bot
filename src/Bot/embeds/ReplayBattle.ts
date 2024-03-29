import { EmbedBuilder } from 'discord.js';
import { BattleDataType } from '../structure/BattleData';

export function createReplayBattleEmbed(
  data: BattleDataType,
  config: {
    ping: string;
    style: string;
    forfeit_turns: number;
    detailed: boolean;
  },
  battlelink: string,
) {
  let embed = new EmbedBuilder();

  embed.setTitle(`Replay: ${data.players.at(0)?.username} vs ${data.players.at(1)?.username}`);
  let team1 = '';
  let team2 = '';
  data.players.at(0)?.pokemons.forEach((x) => {
    if (x.name !== '') {
      if (config.style.toLowerCase().trim() === 'simple')
        team1 += `${x.name} | ${x.kills} Kills | ${x.isDead ? 1 : 0} Deaths\n`;
      else if (config.style.toLowerCase().trim() === 'pretty')
        team1 += `***${x.name}*** has **${x.kills} Kills** and **${x.isDead ? 1 : 0} Deaths**\n`;
      else team1 += `***${x.name}*** has **${x.kills} Kills** and **${x.isDead ? 1 : 0} Deaths**\n`;
    }
  });

  data.players.at(1)?.pokemons.forEach((x) => {
    if (x.name !== '') {
      if (config.style.toLowerCase().trim() === 'simple')
        team2 += `${x.name} | ${x.kills} Kills | ${x.isDead ? 1 : 0} Deaths\n`;
      else if (config.style.toLowerCase().trim() === 'pretty')
        team2 += `***${x.name}*** has **${x.kills} Kills** and **${x.isDead ? 1 : 0} Deaths**\n`;
      else team2 += `***${x.name}*** has **${x.kills} Kills** and **${x.isDead ? 1 : 0} Deaths**\n`;
    }
  });

  embed.setDescription(
    `Winner: ||${data.winner}||\nScore: ||${data.players.at(0)?.score} - ${data.players.at(1)?.score}||`,
  );

  embed.addFields(
    { name: `${data.players.at(0)?.username}`, value: `||${team1}||` },
    { name: `${data.players.at(1)?.username}`, value: `||${team2}||` },
  );

  embed.setColor(`Green`);
  if (config.detailed) {
    let turns: string[] = [];
    data.details.forEach((x) => {
      turns.push(
        `**Turn ${x.turn}** - ${
          x.type === 'normal' ? `${x.killer} killed ${x.kille} ${x.method}` : `${x.kille} ${x.method} ${x.killer}`
        }`,
      );
    });

    embed.addFields({ name: `Important Turn`, value: `||${turns.join('\n')}||` });
  }

  embed.setFooter({
    text: `Format: ${data.format} | Turns: ${data.turns}`,
  });

  embed.setURL(battlelink);

  return embed;
}
