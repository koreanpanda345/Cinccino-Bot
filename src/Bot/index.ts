import { config } from "dotenv";
import CinccinoBot from "./CinccinoBot";
import { connect } from "mongoose";
import { SubscriptionDatabase } from "../Database/classes/subscriptions";
config();
(async () => {
	console.log("Successfully Started");
	await CinccinoBot.startBot();
	await connect(process.env.MONGO_CONNECT_URL as string);
	let sub = new SubscriptionDatabase();
	// await sub.addSubscription("304446682081525772", "439111274828136453");
	await sub.updateCache();
})();