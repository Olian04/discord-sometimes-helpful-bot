import { Client, PresenceStatus } from 'discord.js';
import { eventOnReady } from '../../lib/event';
import { args } from '../preStartConfig';

const onReadyCallbacks = [
  eventOnReady,
];

const setupCommands = async (client: Client) => {
  onReadyCallbacks.forEach((cb) => cb(client));
};

const setPresence = async (client) => {
  const statusMap: { [key: string]: PresenceStatus } = {
    production: 'online',
    development: 'dnd',
  };
  const nameMap = {
    production: 'Awaiting your command!',
    development: `Under development, please do not disturb.`,
  };
  await client.user.setPresence({
    status: statusMap[args.env],
    game: {
      name: nameMap[args.env],
    },
  });
};

const logClientReady = () => console.info(`Client ready`);

export const onReady = async (client: Client) => Promise.all([
  setupCommands,
  setPresence,
  logClientReady,
].map(async (f) => f(client)));
