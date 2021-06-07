import { Message, User } from 'discord.js';
import { db, getSnap } from '../../../database';
import { Event } from '../interfaces/Event';
import { constructBody } from './constructBody';
import { getDirectMessageChannel } from '../../../util/getDirectMessageChannel';
import { isAdmin } from '../../../util/checkPermissions';

export const runEditSequence = async (message: Message, user: User) => {
  const channel = await getDirectMessageChannel(user);
  if (! channel) {
    console.warn(`Failed to open DM channel with user: ${user.username}`);
    return;
  }

  console.log(`Event edit session started for user: ${user.username}`);

  const event = (await getSnap(`event/${message.id}`)).toJSON() as Event;

  const endEditSequence = (reason: string)  => {
    channel.send(`Edit session ended: ${reason}`);
    console.log(`Event edit session ended with reason "${reason}" for user: ${user.username}`);
  };

  if (
    (!isAdmin(message.guild, user.id))
    &&
    (user.id !== event.authorID)
  ) {
    endEditSequence(`Unauthorized to edit message. Please ask an admin for assistance.`);
    return;
  }

  channel.send(`Edit session open for event: (id) ${message.id}
The current title is:
\`\`\`text
${event.title.trim()}
\`\`\`
In order to change the title please respond to this message with \`!title\` followed by the new title.
Ex: \`!title This is the new title!\`
`);

  const timeout = 60 * 1000; // 1 minute
  const response = (await channel.awaitMessages((msg) => !msg.author.bot && msg.content.startsWith('!title '), {
    max: 1,
    time:  timeout,
  })).first() as Message;

  if (! response) {
    endEditSequence(`Time limit exceeded.`);
    return;
  }

  const newTitle = response.content.substring('!title '.length);
  db.child(`event/${message.id}`).update({
    title: newTitle,
  });
  endEditSequence(`Title successfully changed.`);

  // Synchronize with changes made by other users while the edit sequence was running
  // For example: A using changing their signup status
  const eventData = (await getSnap(`event/${message.id}`)).val() as Event;
  message.edit(constructBody(eventData.title, Object.values(eventData.participant || {})))
    .catch(console.warn);
};
