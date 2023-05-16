import {
	SlashCommandBuilder,
	PermissionResolvable
} from "discord.js";
import { CommandContext } from "../core/commandContext";

export interface ICommand {
	data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	disabled?: boolean;
	permissions?: PermissionResolvable[];
	selfPermissions?: PermissionResolvable[];
	category?: string;
	invoke: (ctx: CommandContext) => Promise<unknown> | unknown;
}