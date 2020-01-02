import { Reference } from '@/database';
import { IEvent } from '@/interfaces/event.interface';
import { IParticipant } from '@/interfaces/participant.interface';
import uuid4 from 'uuid/v4';

const constructEvent = (ev: IEvent): IEvent => ({
  participants: [], // participants wont get stored in the DB if the array is empty. (apparently)
  ...ev,
});

export const eventModelFactory = (guildRef: Reference) => ({
  getEventID: (messageID: string, cb: (maybeEventID: string | null) => void) => guildRef
    .child('events').on('value', (snap) => {
      const snapVal = snap.val() || {};
      const events = Object.keys(snapVal).map((k) => ({id: k, data: snapVal[k]})) as Array<{id: string, data: IEvent}>;
      const maybeEvent = events.find((ev) => ev.data.messageID === messageID);
      cb(maybeEvent ? maybeEvent.id : null);
    }),

  createNewEvent: (event: Pick<IEvent, 'channelID' | 'guildID' | 'title'>) => {
    const id = uuid4();
    const newEvent: IEvent = {
      ...event,
      participants: [],
      status: 'new',
      messageID: null,
      id,
    };
    guildRef.child('events').child(id).set(newEvent);
    return id;
  },

  updateAttendance: (eventID: string, participant: Pick<IParticipant, 'attendance' | 'userID' | 'nickname'>) => guildRef
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
    .child('events').child(eventID).transaction((ev: IEvent) => {
      Object.assign(ev, fieldsToUpdate);
      return ev;
    }),

  onNewEvent: (cb: (event: IEvent) => void) => guildRef
    .child('events').on('child_added', (snap) => {
      const event: IEvent = constructEvent(snap.val());
      if (event.status === 'new') {
        cb(event);
      }
    }),

  onEventChange: (eventID: string, cb: (event: IEvent) => void) => guildRef
    .child('events').child(eventID).on('value', (snap) => {
      const event: IEvent = constructEvent(snap.val());
      cb(event);
    }),

  oncePerEvent: (cb: (event: IEvent) => void) => guildRef
    .child('events').once('value', (snap) => {
      const snapVal =  snap.val() || {};
      const events = Object.keys(snapVal).map((k) => snapVal[k]) as IEvent[];
      events.forEach((event) => {
        cb(event);
      });
    }),

  onAnyEventChanged: (cb: (event: IEvent) => void) => guildRef
  .child('events').on('child_changed', (snap) => {
    const event: IEvent = constructEvent(snap.val());
    cb(event);
  }),
});
