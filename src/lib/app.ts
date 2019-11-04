import { commander } from '@/commander';
import { config } from '@/config';
import * as archiveRemovedMessages from '@/reactions/archiveMarkedEvent';
import * as createEventMessage from '@/reactions/createNewEvent';
import * as keepConfigUpdated from '@/reactions/keepConfigUpdated';
import * as resurrectEventsOnStartup from '@/reactions/resurrectEventsOnStartup';
import { logger } from '@/util/logger';
import { Client, Message } from 'discord.js';

const reactions = [
  keepConfigUpdated,
  archiveRemovedMessages,
  resurrectEventsOnStartup,
  createEventMessage,
];

const client = new Client();

client.on('ready', () => {
  client.guilds.forEach((guild) => {
    reactions.forEach(({ setup }) => setup(guild));
  });
});

client.on('message', (message: Message) => {
  if (message.author.bot) { return; }
  if (! commander.isKnownCommand(message)) {
    return;
  }

  commander.handleMessage('new', message);
});

client.login(config.secret.discord)
  .then(() => logger.info.app(`Login successful`))
  .catch((err) => {
    logger.error.app(`Login failed`);
    throw err;
  });
