import { Client, Message } from 'discord.js';
import { isCommand, tokenizeCommand } from '../../util/commandUtils';
import { IParticipant, ResponseEmoji } from './consts';
import { constructEventMessage } from './messageConstructor';
import { updateHandler } from './updateHandler';

export const ID = 'event';
export const callback = (client: Client) => {
  const handleMessage = (message) => {
    if (! isCommand(message.content)) { return; }

    const [command, ...args] = tokenizeCommand(message.content);

    if (command !== 'event') { return; }

    if (args.length === 0) {
      message.author.send(
        'Failed to create an event. Event title was missing.\n' +
        '```\nYou wrote: ' + message.content + '\nIt should be: !event [Title]\n```',
      );
      message.delete(); // delete command from chat log
      return;
    }

    const title = args.join(' ');

    message.channel
      .send(constructEventMessage(title, []))
      .then(async (eventMessage: Message) => {
        await eventMessage.react(ResponseEmoji.YES);
        await eventMessage.react(ResponseEmoji.NO);
        await eventMessage.react(ResponseEmoji.MAYBE);

        updateHandler({
          eventMessage,
          title,
          participants: [],
        });
      });

    message.delete(); // delete command from chat log
  };
  client.on('message', handleMessage);
  client.on('messageUpdate', (_, newMsg) => handleMessage(newMsg));
};
