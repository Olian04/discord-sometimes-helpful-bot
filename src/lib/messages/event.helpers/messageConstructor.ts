import { IParticipant } from '@/interfaces/participant.interface';
import { emoji } from 'node-emoji';

export const constructEventMessage = (
  title: string,
  participants: Array<Pick<IParticipant, 'attendance' | 'timestamp' | 'nickname'>>,
  ) => {
  const participants_yes = participants
    .filter(({ attendance }) => attendance === 'yes')
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((participant) => `+ ${participant.nickname}`);

  const participants_no = participants
    .filter(({ attendance }) => attendance === 'no')
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((participant) => `- ${participant.nickname}`);

  const participants_maybe = participants
    .filter(({ attendance }) => attendance === 'maybe')
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((participant) => `? ${participant.nickname}`);

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
