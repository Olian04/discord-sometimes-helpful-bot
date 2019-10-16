import { Client, Collection, Message, TextChannel } from 'discord.js';
import { addEvent, getAllEventInChannel, getParticipants, purgeEvent } from '../../database';
import { isCommand, tokenizeCommand } from '../../util/commandUtils';
import { EventMessage } from './EventMessage';

export const ID = 'event';
export const callback = (client: Client) => {
  const handleMessage = async (message: Message) => {
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

    const DynamicEventMessage = await (new EventMessage(title, []).sendTo(message.channel));
    addEvent(message.guild.id, {
      title,
      message_id: DynamicEventMessage.message.id,
      channel_id: DynamicEventMessage.message.channel.id,
    });

    message.delete(); // delete command from chat log
  };
  client.on('message', handleMessage);
  client.on('messageUpdate', (_, newMsg) => handleMessage(newMsg));

  // Resuscitate events from DB
  const textChannels = client.channels.filter((channel) => channel.type === 'text') as Collection<string, TextChannel>;
  console.info(`Resuscitating events across ${textChannels.size} channels`);
  textChannels.forEach(async (channel: TextChannel) => {
    const events =  await getAllEventInChannel(channel.guild.id, {
      channel_id: channel.id,
    });

    if (events.length === 0) {
      return;
    }
    Promise.all(events.map(async (event) =>
      channel.fetchMessage(event.message_id)
        .then(async (eventMessage) => {
          console.debug(`Resuscitated event: ${event.title}`);

          const participants =  (await getParticipants(channel.guild.id, {
            message_id: event.message_id,
          })).map(({ attendance, username, timestamp }) => ({
            name: username, attend: attendance, timestamp,
          }));
          const dynamicEventMessage = new EventMessage(event.title, participants);
          dynamicEventMessage.message = eventMessage;

        })
        .catch((err) => {
          // TODO: Purge event on msg deleted as well
          // Remove none existent messages from DB.
          purgeEvent(channel.guild.id, {
            channel_id: event.channel_id,
            message_id: event.message_id,
          });
          console.warn('Attempted to resuscitate a none existent message.');
        }),
    ));
  });
};
