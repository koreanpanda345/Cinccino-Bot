import { Schema, model } from "mongoose";

export interface ISubscription {
	discord_user_id: string;
	discord_server_id: string;
}

const subSchema = new Schema<ISubscription>({
	discord_user_id: String,
	discord_server_id: String,
});

export default model<ISubscription>('subscriptions', subSchema);