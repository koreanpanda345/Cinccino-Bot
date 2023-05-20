import {
  ButtonInteraction,
  CommandInteraction,
  CommandInteractionOptionResolver,
  ContextMenuCommandInteraction,
  Interaction,
} from 'discord.js';
import { createEvent } from '../../utils/creator';
import { handleCommand, handleMonitor } from '../../utils/handler';

createEvent({
  name: 'Interaction Create',
  id: 'interactionCreate',
  invoke: async (interaction: Interaction) => {
    console.log(interaction);
    if (interaction.isCommand())
      await handleCommand(
        interaction.commandName,
        interaction as CommandInteraction,
        interaction.options as CommandInteractionOptionResolver,
      );
    if (interaction.isButton()) await handleMonitor('button', interaction as ButtonInteraction);
  },
});
