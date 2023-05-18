import { cache } from '../../Bot/core/cache';
import Subscriptions from '../models/Subscriptions';

export class SubscriptionDatabase {
  private _db = Subscriptions;

  constructor() {}

  public checkIfServerIsPremium(discordServerId: string) {
    return cache.database.subscriptions.has(discordServerId);
  }

  public async updateCache() {
    let records = await this._db.find();

    records.forEach((x) => {
      if (!cache.database.subscriptions.has(x.discord_server_id))
        cache.database.subscriptions.set(x.discord_server_id, x);
    });
  }

  public async addSubscription(discordUserId: string, discordServerId: string) {
    let newSub = new Subscriptions({
      discord_user_id: discordUserId,
      discord_server_id: discordServerId,
    });

    await newSub.save();

    cache.database.subscriptions.set(discordServerId, newSub);
  }

  public async removeSubscriptionByServer(discordServerId: string) {
    await this._db.deleteOne({
      discord_server_id: discordServerId,
    });

    cache.database.subscriptions.delete(discordServerId);
  }

  public async removeSubscriptionByUser(discordUserId: string) {
    await this._db.deleteOne({
      discord_user_id: discordUserId,
    });

    let serverId = cache.database.subscriptions.find((x) => x.discord_user_id === discordUserId)?.discord_server_id;
    cache.database.subscriptions.delete(serverId!);
  }
}
