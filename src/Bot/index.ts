import { config } from "dotenv";
import CinccinoBot from "./CinccinoBot";
import { connect } from "mongoose";
config();
(async () => {
	console.log("Successfully Started");
	await CinccinoBot.startBot();
	await connect(process.env.MONGO_CONNECT_URL as string);
})();