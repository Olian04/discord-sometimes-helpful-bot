import { emoji } from 'node-emoji';
import { Participant } from '../interfaces/Participant';

const emptySpacePlaceholder = '\t';

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

  const display_participants_summary = [
    participants_yes.length > 0 ? `${emoji.thumbsup} x ${participants_yes.length}` : '',
    participants_no.length > 0 ? `${emoji.thumbsdown} x ${participants_no.length}` : '',
    participants_maybe.length > 0 ? `${emoji.grey_question} x ${participants_maybe.length}` : ''
  ].filter(s => s.length > 0);

  return `**[event]** ${title}
Participants: ${display_participants_summary.length > 0 ? `(${display_participants_summary.join(', ')})` : ''}
\`\`\`diff
${display_participants.join('\n') || emptySpacePlaceholder}
\`\`\`` +
`React with ${emoji.thumbsup} if you can attend, ` +
`${emoji.thumbsdown} if you can't attend, ` +
`${emoji.grey_question} if you're unsure.`;
};
