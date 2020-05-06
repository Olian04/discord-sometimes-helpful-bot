import { Reference } from '@/database';
import { IEvent } from '@/interfaces/event.interface';
import { IEventParticipant } from '@/interfaces/eventParticipant.interface';
import { v4 as uuid4 } from 'uuid';

const constructEvent = (ev: IEvent): IEvent => ({
  participants: [], // participants wont get stored in the DB if the array is empty. (apparently)
  ...ev,
});

export const eventModelFactory = (guildRef: Reference) => ({
  getEvent: (messageID: string) => new Promise<{ id: string; data: IEvent; }>((resolve, reject) =>  {
    guildRef.child('events').on('value', (snap) => {
      const snapVal = snap.val() || {};
      const events = Object.keys(snapVal).map((k) => ({id: k, data: snapVal[k]})) as {id: string, data: IEvent}[];
      const maybeEvent = events.find((ev) => ev.data.messageID === messageID);

      if (maybeEvent) resolve(maybeEvent);
      else reject();
    });
  }),

  createNewEvent: (event: Pick<IEvent, 'channelID' | 'guildID' | 'title'>) => {
    const eventID = uuid4();
    const newEvent: IEvent = {
      ...event,
      participants: [],
      status: 'new',
      messageID: null,
      eventID,
    };
    guildRef.child('events').child(eventID).set(newEvent);
    return eventID;
  },

  updateAttendance: (
    eventID: string,
    participant: Pick<IEventParticipant, 'attendance' | 'userID' | 'nickname'>,
  ) => guildRef
    .child('events').child(eventID).transaction((ev: IEvent) => {
      if (ev.participants === undefined) {
        ev.participants = [];
      }
      const maybeUser = ev.participants.find((par) => par.userID === participant.userID);
      if (maybeUser) {
        maybeUser.attendance = participant.attendance;
        maybeUser.nickname = participant.nickname;
        maybeUser.timestamp = Date.now();
      } else {
        ev.participants.push({
          ...participant,
          timestamp: Date.now(),
        });
      }
      return ev;
    }),

  update: (eventID: string, fieldsToUpdate: Partial<Pick<IEvent, 'status' | 'title' | 'messageID'>>) => guildRef
    .child('events').child(eventID).update(fieldsToUpdate),
});
