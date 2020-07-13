import { emoji } from 'node-emoji';
import { Participant } from '../interfaces/Participant';

export const constructBody = (
  title: string,
  participants: Participant[],
  ) => {
  console.debug(title, participants);
  const participants_yes = participants
    .filter(({ status }) => status === 'yes')
    .sort((a, b) => a.lastUpdated - b.lastUpdated)
    .map(({ name }) => `+ ${name}`);

  const participants_no = participants
    .filter(({ status }) => status === 'no')
    .sort((a, b) => a.lastUpdated - b.lastUpdated)
    .map(({ name }) => `- ${name}`);

  const participants_maybe = participants
  .filter(({ status }) => status === 'maybe')
  .sort((a, b) => a.lastUpdated - b.lastUpdated)
  .map(({ name }) => `? ${name}`);

  const display_participants = [
    ...participants_yes,
    ...(participants_yes.length === 0 ? [] : ['']), // Add empty line if necessary
    ...participants_no,
    ...(participants_no.length === 0 ? [] : ['']), // Add empty line if necessary
    ...participants_maybe,
  ];

  return `**[event]** ${title}
Participants:
\`\`\`diff
${display_participants.join('\n')}
\`\`\`` +
`React with ${emoji.thumbsup} if you can attend, ` +
`${emoji.thumbsdown} if you can't attend, ` +
`${emoji.grey_question} if you're unsure.`;
};