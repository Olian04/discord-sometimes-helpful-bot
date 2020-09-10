import { Message } from 'discord.js';
import { getSnap } from '../../database';
import { resolveChannelConfig } from './util/resolveChannelConfig';
import { ChannelConfig } from './interfaces/ChannelConfig';
import { KnownCommand } from './interfaces/KnownCommand';

export const isWhitelisted = async (cmdName: string, message: Message) => {
  const channelID = message.channel.id;
  const isAdmin = message
    .guild.member(message.author)
    .hasPermission('ADMINISTRATOR');

  if (isAdmin) {
    // Admins are allowed to use all commands
    return true;
  }

  const snap = await getSnap(`config/channel/${channelID}`);
  const conf = resolveChannelConfig(
    snap.val() as ChannelConfig
  );

  return conf.command_whitelist.indexOf(cmdName as KnownCommand) >= 0;
}