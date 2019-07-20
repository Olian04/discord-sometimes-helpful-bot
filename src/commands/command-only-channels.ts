import { Client, Message } from 'discord.js';
import { isCommand } from '../util/commandUtils';

// TODO: Make this part dynamic via a command such as !coc [channel name]
const eventSignChannelID = '597864917441183754';
const channels = [ eventSignChannelID ].reduce((res, v) => ({...res, [v]: v}), {});

export const ID = 'command-only-channels';
export const callback = (client: Client) => {
  const messageHandler = async (message: Message) => {
    if (isCommand(message.content) || message.author.bot) {
      // commands are always OK
      return;
    }

    if (message.channel.id in channels) {
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
