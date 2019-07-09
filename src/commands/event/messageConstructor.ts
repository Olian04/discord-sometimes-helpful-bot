import { IParticipant, ResponseEmoji } from './consts';

export const constructEventMessage = (title: string, participants: IParticipant[]) => `**[event]** ${title}
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
