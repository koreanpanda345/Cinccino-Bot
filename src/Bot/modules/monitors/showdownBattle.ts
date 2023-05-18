import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  TextChannel,
} from 'discord.js';
import { createMontior } from '../../utils/creator';
import { ShowdownClient } from '../../../Showdown/client/ShowdownClient';
import { cache } from '../../core/cache';
import { showdownServers } from '../../constants/servers';
import { ShowdownBattle } from '../../../Showdown/models/ShowdownBattle';
import axios from 'axios';
import { BattleSystem } from '../../system/BattleSystem';
import { stringify } from 'querystring';
import { SubscriptionDatabase } from '../../../Database/classes/subscriptions';

createMontior({
  id: 'showdown_battle',
  invoke: async (message: Message, premium: boolean) => {
    try {
      if ((message.channel as TextChannel).name.includes('live-battles')) {
        const urlRegex = /(https?:\/\/[^ ]*)/;
        const links = message.content.match(urlRegex);

        let battlelink = '';
        if (links) battlelink = links[0];

        let battleId = battlelink && battlelink.split('/')[3];

        if (cache.showdown.battles.has(battleId) && battleId !== '') {
          await message.channel.send('I am already watching that match.');
          return;
        }
        let name = (message.channel as TextChannel).name;
        let matchresultchannel = message.guild?.channels.cache.find(
          (x) => x.name === name.replace('live-battles', '') + 'match-results',
        ) as TextChannel;
        if (!battlelink.startsWith('https://replay.pokemonshowdown.com')) {
          let server = Object.values(showdownServers).filter((s) => battlelink.includes(s.link))[0];

          if (!server) {
            await message.channel.send('This link is not a valid Pokemon Showdown battle url.');
            return;
          }
          const showdown = new ShowdownClient({
            name: server.name,
            server: server.server,
            ip: server.ip,
            link: server.link,
            credentials: {
              username: process.env.SHOWDOWN_USER as string,
              password: process.env.SHOWDOWN_PASS as string,
            },
          });

          await showdown.ws.connect();

          showdown.on('ready', async () => {
            message.channel.send(`Watching the battle now!`);
            await showdown.ws.joinBattle(battleId, (battle: ShowdownBattle) => {
              let sys = new BattleSystem(battle);

              cache.showdown.battles.set(battleId, sys);

              battle.on('win', (user) => {
                let embed = new EmbedBuilder();

                embed.setTitle(`${sys.data.players.at(0)?.username} vs ${sys.data.players.at(1)?.username}`);
                let team1 = '';
                let team2 = '';
                let team1Cvs = '';
                let team2Cvs = '';
                sys.data.players.at(0)?.pokemons.forEach((x) => {
                  if (x.name !== '') {
                    team1 += `${x.name} | ${x.kills} Kills | ${x.isDead ? 1 : 0} Deaths\n`;
                    team1Cvs += `${x.name},${x.kills},${x.isDead ? 1 : 0}\n`;
                  }
                });

                sys.data.players.at(1)?.pokemons.forEach((x) => {
                  if (x.name !== '') {
                    team2 += `${x.name} | ${x.kills} Kills | ${x.isDead ? 1 : 0} Deaths\n`;
                    team2Cvs += `${x.name},${x.kills},${x.isDead ? 1 : 0}\n`;
                  }
                });

                embed.setDescription(
                  `Winner: ||${sys.data.winner}||\nScore: ||${sys.data.players.at(0)?.score} - ${
                    sys.data.players.at(1)?.score
                  }||`,
                );

                embed.addFields(
                  { name: `${sys.data.players.at(0)?.username}`, value: `||${team1}||` },
                  { name: `${sys.data.players.at(1)?.username}`, value: `||${team2}||` },
                );

                embed.setColor(`Green`);

                embed.setFooter({
                  text: `Format: ${sys.data.format}`,
                });

                showdown.ws.saveReplay(battleId);

                showdown.on('queryresponse', async (str) => {
                  if (!str.includes('savereplay')) return;

                  const replayData = JSON.parse(str.substring(26));
                  const replayUrl = `https://play.pokemonshowdown.com/~~${server.name.toLowerCase()}/action.php`;
                  replayData.id = `${server.name.toLowerCase() == 'showdown' ? '' : `${server.name.toLowerCase()}-`}${
                    replayData.id
                  }`;

                  const replayNewData = stringify({
                    act: 'uploadreplay',
                    log: replayData.log,
                    id: replayData.id,
                  });
                  await axios.post(replayUrl, replayNewData).catch((err) => console.error(err));
                  sys.data.replay = `https://replay.pokemonshowdown.com/${replayData.id}`;

                  await axios.get(sys.data.replay).catch((err) => console.error(err));

                  await showdown.ws.leaveBattle(battleId).then(() => {
                    cache.showdown.battles.delete(battleId);
                  });

                  embed.setURL(sys.data.replay);

                  let actionRow = new ActionRowBuilder<ButtonBuilder>();

                  let cvsBtn = new ButtonBuilder();

                  cvsBtn.setCustomId('cvs_btn');
                  cvsBtn.setLabel('CSV Import');
                  cvsBtn.setStyle(ButtonStyle.Primary);

                  actionRow.addComponents(cvsBtn);
                  let channel: TextChannel | undefined;
                  let row: ActionRowBuilder<ButtonBuilder>[] = [];
                  if (premium) {
                    row.push(actionRow);
                    channel = matchresultchannel;
                  } else {
                    row.push(actionRow);
                    channel = matchresultchannel;
                    // channel = (await message.guild?.channels.cache.find(
                    //   (x) => x.name === 'match-results',
                    // )) as TextChannel;
                  }
                  channel.send({
                    embeds: [embed],
                    components: row,
                  });

                  cache.bot.interactions.buttons.set('cvs_btn', async (ctx) => {
                    let message =
                      `Winner: ${sys.data.winner}\n` +
                      `Score: ${sys.data.players.at(0)?.score} - ${sys.data.players.at(1)?.score}\n` +
                      `\n` +
                      `${sys.data.players.at(0)?.username}\n` +
                      `${team1Cvs}\n` +
                      `${sys.data.players.at(1)?.username}\n` +
                      `${team2Cvs}\n`;

                    ctx.reply({
                      content: message,
                      ephemeral: true,
                    });
                  });
                });
              });
            });
          });
        } else if (battlelink.startsWith('https://replay.pokemonshowdown.com')) {
          let data = await axios.get(battlelink + '.log');
          let battle = new ShowdownBattle(battleId);
          let sys = new BattleSystem(battle);
          battle.on('win', async (user: string) => {
            let embed = new EmbedBuilder();

            embed.setTitle(`Replay: ${sys.data.players.at(0)?.username} vs ${sys.data.players.at(1)?.username}`);
            let team1 = '';
            let team2 = '';
            let team1Cvs = '';
            let team2Cvs = '';
            sys.data.players.at(0)?.pokemons.forEach((x) => {
              if (x.name !== '') {
                team1 += `${x.name} | ${x.kills} Kills | ${x.isDead ? 1 : 0} Deaths\n`;
                team1Cvs += `${x.name},${x.kills},${x.isDead ? 1 : 0}\n`;
              }
            });

            sys.data.players.at(1)?.pokemons.forEach((x) => {
              if (x.name !== '') {
                team2 += `${x.name} | ${x.kills} Kills | ${x.isDead ? 1 : 0} Deaths\n`;
                team2Cvs += `${x.name},${x.kills},${x.isDead ? 1 : 0}\n`;
              }
            });

            embed.setDescription(
              `Winner: ||${sys.data.winner}||\nScore: ||${sys.data.players.at(0)?.score} - ${
                sys.data.players.at(1)?.score
              }||`,
            );

            embed.addFields(
              { name: `${sys.data.players.at(0)?.username}`, value: `||${team1}||` },
              { name: `${sys.data.players.at(1)?.username}`, value: `||${team2}||` },
            );

            embed.setColor(`Green`);

            embed.setFooter({
              text: `Format: ${sys.data.format}`,
            });

            embed.setURL(battlelink);

            let actionRow = new ActionRowBuilder<ButtonBuilder>();

            let cvsBtn = new ButtonBuilder();

            cvsBtn.setCustomId('csv_replay_btn');
            cvsBtn.setLabel('CSV Import');
            cvsBtn.setStyle(ButtonStyle.Primary);

            actionRow.addComponents(cvsBtn);
            let channel: TextChannel | undefined;
            let row: ActionRowBuilder<ButtonBuilder>[] = [];
            if (premium) {
              row.push(actionRow);
              channel = matchresultchannel;
            } else {
              row.push(actionRow);
              channel = matchresultchannel;
              // channel = (await message.guild?.channels.cache.find((x) => x.name === 'match-results')) as TextChannel;
            }

            if (!channel) channel = message.channel as TextChannel;
            channel.send({
              embeds: [embed],
              components: row,
            });

            cache.bot.interactions.buttons.set('csv_replay_btn', async (ctx) => {
              let message =
                `Winner: ${sys.data.winner}\n` +
                `Score: ${sys.data.players.at(0)?.score} - ${sys.data.players.at(1)?.score}\n` +
                `\n` +
                `${sys.data.players.at(0)?.username}\n` +
                `${team1Cvs}\n` +
                `${sys.data.players.at(1)?.username}\n` +
                `${team2Cvs}\n`;

              ctx.reply({
                content: message,
                ephemeral: true,
              });
            });
          });
          for (let line of data.data.split('\n')) {
            let sections = line.split('|');
            sections.shift();
            let command = sections.shift();
            battle.addLine(command, sections);
          }
        } else {
          return;
        }
      }
    } catch (err) {
      console.error(err);
      return;
    }
  },
});
