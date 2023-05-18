import { client } from './core/client';
import { loadFolder } from './utils/loader';

export default new (class CinccinoBot {
  public async startBot() {
    await loadFolder('commands');
    await loadFolder('monitors');
    await loadFolder('events');
    client.login(process.env.DISCORD_BOT_TOKEN);
  }
})();
