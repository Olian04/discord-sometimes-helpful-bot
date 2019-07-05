import { Client, Emoji, Message, MessageReaction, ReactionEmoji, User } from 'discord.js';
import { isCommand, tokenizeCommand } from '../util/commandUtils';

interface IParticipant {
  attend: 'yes' | 'no' | 'maybe';
  name: string;
}

enum ResponseEmoji {
  YES = '👍',
  NO = '👎',
  MAYBE = '❔',
}

const constructEventMessage = (title: string, participants: IParticipant[]) => `**[event]** ${title}
Participants:
\`\`\`diff
${participants.map((participant) => {
  if (participant.attend === 'yes') {
    return `+ ${participant.name}`;
  }
  if (participant.attend === 'no') {
    return `- ${participant.name}`;
  }

  if (participant.attend !== 'maybe') {
    console.warn(`Unexpected attend type of event participant:`, participant);
  }
  return `  ${participant.name}`;
}).join('\n')}
\`\`\`` +
`React with ${ResponseEmoji.YES} if you can attend, ` +
`${ResponseEmoji.NO} if you can't attend, ` +
`${ResponseEmoji.MAYBE} if you're unsure.`;

export const ID = 'event';
export const callback = (client: Client) => {
  client.on('message', (message) => {
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

    const participants: IParticipant[] = [];

    message.channel
      .send(constructEventMessage(title, []))
      .then(async (eventMessage: Message) => {
        await eventMessage.react(ResponseEmoji.YES);
        await eventMessage.react(ResponseEmoji.NO);
        await eventMessage.react(ResponseEmoji.MAYBE);

        const isAcceptableEmoji = (emoji: Emoji | ReactionEmoji) =>
          emoji.name === ResponseEmoji.YES ||
          emoji.name === ResponseEmoji.NO ||
          emoji.name === ResponseEmoji.MAYBE;
        const filter = (reaction: MessageReaction, user: User) =>
          user.bot === false && isAcceptableEmoji(reaction.emoji);

        const collector = eventMessage.createReactionCollector(filter);
        collector.on('collect', (reaction) => {
          console.debug('got a reaction', reaction.emoji.name);

          const attendance = reaction.emoji.name === ResponseEmoji.YES ? 'yes'
            : reaction.emoji.name === ResponseEmoji.NO ? 'no' : 'maybe';

          reaction.users.forEach((user) => {
            if (user.bot) { return; }
            reaction.remove(user); // Remove reaction

            const participant = participants.find((par) => par.name === user.username);
            if (participant) {
              participant.attend = attendance;
            } else {
              participants.push({
                attend: attendance,
                name: user.username,
              });
            }
          });

          eventMessage.edit(constructEventMessage(title, participants));
        });
        collector.on('end', (collected) => {
          console.debug(`collected ${collected.size} reactions`);
        });
      });

    message.delete(); // delete command from chat log
  });
};
