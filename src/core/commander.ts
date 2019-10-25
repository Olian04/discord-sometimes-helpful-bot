import { Commander } from 'discord-commander';
import { ConfigCommand } from '../lib/config';
import { EventCommand } from '../lib/event';
import { LargeEmoteCommand } from '../lib/large-emote';
import { commandToken } from '../util/command';

export const commander = new Commander(commandToken, [
  EventCommand,
  LargeEmoteCommand,
  ConfigCommand,
]);
commander.deleteUnknownCommands = false;
