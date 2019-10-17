import { Client, Message } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { isCommand, tokenizeCommand } from '../util/command';

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
    if (requestedEmote.match(/^:.+:$/i)) {
      // Unresolved emotes looks like this :some_name:
      requestedEmote = requestedEmote.substring(1, requestedEmote.length - 1);
    } else if (requestedEmote.match(/^<:.+:\d+>$/i)) {
      // Resolved emotes looks like this <:emote_name:some_numerical_id>
      requestedEmote = requestedEmote.substring(2, requestedEmote.lastIndexOf(':'));
    }

    if (! emoteNames.some((name) => name === requestedEmote)) {
      await message.author.send(`Attempted to display unknown emote "${requestedEmote}"
Available emotes are: ${emoteNames.join(', ')}`);

      await message.delete(); // Clean up command
      return;
    }

    await message.channel.send(`${message.author}`, {
      files: [
        path.join(__dirname, '..', '..', 'assets', 'emotes', `${requestedEmote}.png`),
      ],
    });

    await message.delete(); // Clean up command
  };

  client.on('message', messageHandler);
  client.on('messageUpdate', (_, newMessage) => messageHandler(newMessage));
};
