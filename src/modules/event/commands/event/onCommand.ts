import { TextChannel } from 'discord.js';
import { CommandHandler } from '../../../../types/CommandHandler';
import { constructBody } from '../../util/constructBody';
import { attachReactions } from '../../util/attachReactions';
import { db } from '../../../../database';

export const onCommand: CommandHandler = async (interaction, app) => {
  interaction.defer({
    ephemeral: true,
  });

  const title = interaction.options.get('title').value as string;

  if (!title) {
    interaction.reply('No title provided', {
      ephemeral: true,
    });
    console.log(`No title provided to event command (ID: ${interaction.id}) by user (ID: ${interaction.user.id}). Exiting early`);
    return;
  }

  const channel = await app.channels.fetch(interaction.channelID) as TextChannel;

  const eventMessage = await channel.send(
    constructBody(title, []),
  ).then((val) => {
    console.log(`Sent event message to discord: ${title}`);
    interaction.deleteReply();
    return val;
  }).catch(console.warn);

  if (! eventMessage) {
    console.warn(`Failed to send event message in channel (ID: ${channel.id})`);
    return;
  }

  attachReactions(eventMessage)
    .then(() => console.log(`Attached reactions to event message (ID: ${eventMessage.id})`));

  db.child(`event/${eventMessage.id}`).set({
    authorID: interaction.user.id,
    title,
    participant: {},
  }).then(() => console.log(`Committed event to db (ID: ${eventMessage.id})`))
    .catch(console.warn);
}