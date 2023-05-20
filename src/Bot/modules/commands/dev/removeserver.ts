import { SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../../utils/creator';
import { SubscriptionDatabase } from '../../../../Database/classes/subscriptions';

let data = new SlashCommandBuilder();

data.setName('removeserver');
data.setDescription('Removes a server from the list of premium paid servers');
data.addUserOption((opt) => {
  opt.setName('user');
  opt.setDescription('user that paid for the subscription');
  opt.setRequired(false);
  return opt;
});
data.addStringOption((opt) => {
  opt.setName('server_id');
  opt.setDescription('The server id that the user paid subscription for.');
  opt.setRequired(false);
  return opt;
});
createCommand({
  data,
  supportServerOnly: true,
  invoke: async (ctx) => {
    let user = ctx.args?.getUser('user');
    let serverId = ctx.args?.getString('server_id');
    if (ctx.ctx!.guildId !== '1108167860318122106') {
      return;
    }
    if (
      !(await ctx.ctx!.guild?.members.fetch(ctx.ctx!.user))?.roles.cache.hasAny(
        '1108167887644012625',
        '1108167995714445364',
      )
    ) {
      return;
    }

    const sub = new SubscriptionDatabase();
    if (!user && serverId) await sub.removeSubscriptionByServer(serverId);
    else if (!serverId && user) await sub.removeSubscriptionByUser(user.id);
    else ctx.ctx!.reply('I need either a user or a server id to do this action.');
    console.log('success');
    await (
      await user!.createDM()
    ).send(
      `Thank you for buying a subscription with me!!! Now the server with the id of ${serverId} can use premium features.`,
    );
  },
});
