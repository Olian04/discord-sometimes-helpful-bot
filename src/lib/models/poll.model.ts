import { Reference } from '@/database';
import { IEventParticipant } from '@/interfaces/eventParticipant.interface';
import { IPoll } from '@/interfaces/poll.interface';
import { IPollParticipant } from '@/interfaces/pollParticipant.interface';
import uuid4 from 'uuid/v4';

const constructPoll = (poll: IPoll): IPoll => ({
  participants: [], // participants wont get stored in the DB if the array is empty. (apparently)
  ...poll,
});

export const pollModelFactory = (guildRef: Reference) => ({
  getPollID: (messageID: string, cb: (maybePollID: string | null) => void) => guildRef
    .child('polls').on('value', (snap) => {
      const snapVal = snap.val() || {};
      const polls = Object.keys(snapVal).map((k) => ({id: k, data: snapVal[k]})) as Array<{id: string, data: IPoll}>;
      const maybePoll = polls.find((poll) => poll.data.messageID === messageID);
      cb(maybePoll ? maybePoll.id : null);
    }),

  createNewPoll: (poll: Pick<IPoll, 'channelID' | 'guildID' | 'title' | 'voteAlternatives'>) => {
    const id = uuid4();
    const newPoll: IPoll = {
      ...poll,
      participants: [],
      status: 'new',
      messageID: null,
      id,
    };
    guildRef.child('polls').child(id).set(newPoll);
    return id;
  },

  updateVote: (
    pollID: string,
    participant: Pick<IPollParticipant, 'userID' | 'nickname'> & Partial<Pick<IPollParticipant, 'votes'>>,
  ) => guildRef.child('polls').child(pollID).transaction((poll: IPoll) => {
      if (poll.participants === undefined) {
        poll.participants = [];
      }
      const maybeUser = poll.participants.find((par) => par.userID === participant.userID);
      if (maybeUser) {
        maybeUser.votes = { ...maybeUser.votes, ...participant.votes };
        maybeUser.nickname = participant.nickname;
        maybeUser.timestamp = Date.now();
      } else {
        poll.participants.push({
          votes: {},
          ...participant,
          timestamp: Date.now(),
        });
      }
      return poll;
    }),

  update: (pollID: string, fieldsToUpdate: Partial<Pick<IPoll, 'status' | 'title' | 'messageID'>>) => guildRef
    .child('polls').child(pollID).transaction((poll: IPoll) => {
      Object.assign(poll, fieldsToUpdate);
      return poll;
    }),

  onNewPoll: (cb: (poll: IPoll) => void) => guildRef
    .child('polls').on('child_added', (snap) => {
      const poll = constructPoll(snap.val());
      if (poll.status === 'new') {
        cb(poll);
      }
    }),

  onPollChange: (pollID: string, cb: (poll: IPoll) => void) => guildRef
    .child('polls').child(pollID).on('value', (snap) => {
      const poll = constructPoll(snap.val());
      cb(poll);
    }),

  oncePerPoll: (cb: (poll: IPoll) => void) => guildRef
    .child('polls').once('value', (snap) => {
      const snapVal =  snap.val() || {};
      const polls = Object.keys(snapVal).map((k) => snapVal[k]) as IPoll[];
      polls.forEach((poll) => {
        cb(poll);
      });
    }),

  onAnyPollChanged: (cb: (poll: IPoll) => void) => guildRef
  .child('polls').on('child_changed', (snap) => {
    const poll = constructPoll(snap.val());
    cb(poll);
  }),
});
