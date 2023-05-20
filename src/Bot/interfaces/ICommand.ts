import { SlashCommandBuilder, PermissionResolvable, ContextMenuCommandBuilder } from 'discord.js';
import { CommandContext } from '../core/commandContext';

export interface ICommand {
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  supportServerOnly?: boolean;
  disabled?: boolean;
  permissions?: PermissionResolvable[];
  selfPermissions?: PermissionResolvable[];
  category?: string;
  invoke: (ctx: CommandContext) => Promise<unknown> | unknown;
}
