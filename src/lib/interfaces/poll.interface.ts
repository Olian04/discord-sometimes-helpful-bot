import { IPollParticipant } from './pollParticipant.interface';

export type PollStatus = 'new' | 'active' | 'archived' | 'toBeArchived';

export interface IPoll {
  status: PollStatus;
  id: string;
  title: string;
  guildID: string;
  channelID: string;
  messageID: string | null;
  participants: IPollParticipant[];
  voteAlternatives: string[];
}
