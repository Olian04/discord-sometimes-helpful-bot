import { KnownCommandsMap, KnownCommand } from '../interfaces/KnownCommand';

export const isKnownCommand = (cmdName: string): cmdName is KnownCommand => {
  return KnownCommandsMap[cmdName];
}