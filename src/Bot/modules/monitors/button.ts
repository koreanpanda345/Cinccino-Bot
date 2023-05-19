import { ButtonInteraction } from 'discord.js';
import { createMontior } from '../../utils/creator';
import { cache } from '../../core/cache';
import { handleMonitor } from '../../utils/handler';

createMontior({
  id: 'button',
  invoke: async (ctx: ButtonInteraction) => {
    let btn = cache.bot.interactions.buttons.get(ctx.customId);
    if (['csv_btn', 'csv_replay_btn'].includes(ctx.customId)) return await handleMonitor('csv_import', ctx);
    if (!btn) return;

    await btn(ctx);
  },
});
