import { Client, Message } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { isCommand, tokenizeCommand } from '../util/commandUtils';

const emoteNames = fs.readdirSync(path.join(__dirname, '..', '..', 'assets', 'emotes'))
  .filter((fileName) => fileName.endsWith('.png')) // excludes type files such as demo.d.ts
  .map((fileName) => fileName.substr(0, fileName.length - '.png'.length));

export const ID = 'large-emotes';
export const callback = (client: Client) => {
  const messageHandler = async (message: Message) => {
    if (!isCommand(message.content)) { return; }

    const [command, ...args] = tokenizeCommand(message.content);

    if (command !== 'emote') { return; }
    if (args.length < 1) { return; }

    let [requestedEmote] = args;
    if (requestedEmote.match(/^:.*:$/i)) {
      requestedEmote = requestedEmote.substring(1, requestedEmote.length - 1);
    }

    if (! emoteNames.some((name) => name === requestedEmote)) {
      await message.author.send(`Attempted to display unknown emote "${requestedEmote}"
Available emotes are: ${emoteNames.join(', ')}`);

      await message.delete(); // Clean up command
      return;
    }

    await message.channel.send('', {
      files: [
        path.join(__dirname, '..', '..', 'assets', 'emotes', `${requestedEmote}.png`),
      ],
    });

    await message.delete(); // Clean up command
  };

  client.on('message', messageHandler);
  client.on('messageUpdate', (_, newMessage) => messageHandler(newMessage));
};
