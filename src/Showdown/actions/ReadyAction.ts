import { ShowdownClient } from "../client/ShowdownClient";
import { ShowdownClientUser } from "../client/ShowdownClientUser";

export default async function(client: ShowdownClient, data: any) {
	client.user = new ShowdownClientUser(data);
	client.emit('ready');
}