import { EventCommand } from '@/commands/event.command';
import { config } from '@/config';
import { Commander } from 'discord-commander';
import { LargeEmoteCommand } from './commands/largeEmote.command';

export const commander = new Commander(config.commander.prefix, [
  EventCommand,
  LargeEmoteCommand,
]);

// Apply config
commander.deleteUnknownCommands = config.commander.deleteUnknownCommands;
commander.deleteProcessedCommands = config.commander.deleteProcessedCommands;
commander.allowBots = config.commander.allowBots;
commander.logLevel = config.commander.logLevel;
