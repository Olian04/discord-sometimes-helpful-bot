import { Client, CommandInteraction } from 'discord.js';

export type CommandHandler = (interaction: CommandInteraction, app: Client) => void | Promise<void>;
