import { config } from "dotenv";
import CinccinoBot from "./CinccinoBot";
config();
(async () => {
	console.log("Successfully Started");
	await CinccinoBot.startBot();
})();