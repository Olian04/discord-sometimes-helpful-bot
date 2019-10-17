import { Client, Message } from 'discord.js';
import { isCommand } from '../util/command';
import { getConf } from './config';

export const ID = 'command-only-channels';
export const callback = (client: Client) => {
  const messageHandler = async (message: Message) => {
    const guildConf = await getConf(message.guild);
    if (isCommand(message.content) || message.author.bot) {
      // commands are always OK
      return;
    }
    if (guildConf.cache[ID] === undefined || guildConf.cache[ID].channels === undefined) { return; }
    if (guildConf.cache[ID].channels.includes(message.channel.id)) {
      // None command messages are not allowed in blacklisted channels

      console.debug(`Removed a message from a command-only-channels:`, message.content);
      await message.author.send(
        `A message you wrote have been removed due to restrictions put on the channel.\n` +
        `Only messages containing commands for ME (the sometimes-helpful BOT) may be posted in the given channel.`,
      );

      await message.delete(); // Clean up command
    }
  };
  client.on('message', messageHandler);
};
