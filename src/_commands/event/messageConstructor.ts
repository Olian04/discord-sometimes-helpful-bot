import { emoji } from 'node-emoji';
import { IParticipant } from './consts';

export const constructEventMessage = (title: string, participants: IParticipant[]) => {
  const participants_yes = participants
    .filter(({ attend }) => attend === 'yes')
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((participant) => `+ ${participant.name}`);

  const participants_no = participants
    .filter(({ attend }) => attend === 'no')
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((participant) => `- ${participant.name}`);

  const participants_maybe = participants
    .filter(({ attend }) => attend === 'maybe')
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((participant) => `? ${participant.name}`);

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
