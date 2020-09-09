import { Message, User } from 'discord.js';
import { db, getSnap } from '../database';
import { Event } from '../interfaces/Event';
import { constructBody } from './constructBody';

export const runEditSequence = async (message: Message, user: User) => {
  const channel = user.dmChannel ?? await user.createDM();
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
  message.edit(constructBody(newTitle, Object.values(event.participant || {})))
    .catch(console.warn);
};
