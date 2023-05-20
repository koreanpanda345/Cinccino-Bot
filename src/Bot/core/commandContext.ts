import { CommandInteraction, CommandInteractionOptionResolver, ContextMenuCommandInteraction } from 'discord.js';

export class CommandContext {
  constructor(private _ctx: CommandInteraction, private _args: CommandInteractionOptionResolver) {}

  public get ctx() {
    return this._ctx;
  }
  public get args() {
    return this._args;
  }
}
