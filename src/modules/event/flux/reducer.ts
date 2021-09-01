import { Reducer } from 'chatflux';
import { EventAction } from '../types/EventAction';
import { EventState } from '../types/EventState';

const defaultState: EventState = {
  authorID: null,
  title: 'Loading...',
  participants: {},
}

export const reducer: Reducer<EventState, EventAction> = (state = defaultState, action) => {
  switch (action?.type) {
    case 'updateTitle':
      return {
        ...state,
        title: action.title,
      }
    case 'updateParticipation':
      state.participants[action.userID] = {
        name: action.userNamer,
        status: action.participationStatus,
        lastUpdated: Date.now(),
      }
      return state;
    default:
      return state;
  }
}