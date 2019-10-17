import { Client } from 'discord.js';

export const resuscitationHandler = (client: Client) => {
  /*
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
  */
};
