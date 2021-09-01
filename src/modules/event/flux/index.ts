import { ChatFlux } from 'chatflux';
import { EventState } from '../types/EventState';
import { EventAction } from '../types/EventAction';

import { inMemoryDatabase } from './database';
import { reducer } from './reducer';
import { renderer } from './render';

export const Event = new ChatFlux<EventState, EventAction>({
  database: inMemoryDatabase,
  reduce: reducer,
  render: renderer,
});