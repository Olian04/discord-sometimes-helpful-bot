import { Identifier, SimpleDatabase } from 'chatflux';
import { EventState } from '../types/EventState';

// TODO: Hook up firebase db

export const inMemoryDatabase = ((
  storage = new Map<Identifier, EventState>()
): SimpleDatabase<EventState> => ({
  get: async (id) => {
    const maybeData = storage.get(id);
    if (!maybeData) {
      throw new Error(`Unexpected ID: ${id}`);
    }
    return maybeData;
  },
  set: async (id, newData) => {
    storage.set(id, newData);
  },
  has: async (id) => storage.has(id),
  delete: async (id) => {
    storage.delete(id);
  },
}))();