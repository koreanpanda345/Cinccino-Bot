import { config } from "dotenv";
import CinccinoBot from "./CinccinoBot";
config();
(async () => {
	await CinccinoBot.startBot();
})();