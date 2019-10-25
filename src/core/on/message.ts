import { getConfig } from '@/lib/config/cache';
import { Message } from 'discord.js';
import { deleteIfAble, extractCommand, isCommand, isDirectMessage } from '../../util/command';
import { commander } from '../commander';

const logCommands = async (message: Message) => {
  if (! isCommand(message.content)) { return; }

  const { Dark_Gray, Light_Green, RESET} = console.color;

  // Log incoming command
  console.log(
    (message.channel.type === 'dm' ? `${Dark_Gray}[${Light_Green}dm${Dark_Gray}]${RESET}` : '') +
    `${Dark_Gray}[${RESET}${message.author.username}${Dark_Gray}]${RESET} ${message.content}`,
  );
};

const delegateToCommander = async (message: Message) => {
  if (isDirectMessage(message)) { return; }
  const guildConf = await getConfig(message.guild);
  const channelConf = guildConf.cache.channel[guildConf.cache.meta.channelID] || guildConf.cache.channel.default;

  if (guildConf.cache.meta.channelID !== null && guildConf.cache.meta.channelID !== message.channel.id) {
    if ((! isCommand(message.content)) && channelConf.isOnlyCommand) {
      console.debug(`Removed a message from a command-only-channels:`, message.content);
      await message.author.send(
        `A message you wrote have been removed due to restrictions put on the channel.\n` +
        `Only messages containing commands for ME (the sometimes-helpful BOT) may be posted in the given channel.`,
      );
      deleteIfAble(message);
      return;
    }

    if (isCommand(message.content) && channelConf.commands.indexOf(extractCommand(message.content)) < 0) {
      if (channelConf.commands.length > 0) {
        await message.author.send(
          `A message you wrote have been removed due to restrictions put on the channel.\n` +
          `Only messages containing one of a select set of commands may be posted in the given channel.\n` +
          `Currently no command are allowed in the given channel.`,
        );
      } else {
        await message.author.send(
          `A message you wrote have been removed due to restrictions put on the channel.\n` +
          `Only messages containing one of a select set of commands may be posted in the given channel.\n` +
          `Allowed commands: ${channelConf.commands.join(', ')}`,
        );
      }
      deleteIfAble(message);
      return;
    }
  }

  commander.handleMessage('new', message);
};

export const onMessage = async (message: Message) => Promise.all([
  logCommands,
  delegateToCommander,
].map(async (f) => f(message)));
