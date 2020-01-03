import * as archiveMarkedEvents from '@/reactions/archiveMarkedEvent';
import * as archiveMarkedPolls from '@/reactions/archiveMarkedPoll';
import * as createEventMessage from '@/reactions/createNewEvent';
import * as createPollMessage from '@/reactions/createNewPoll';
import * as keepConfigUpdated from '@/reactions/keepConfigUpdated';
import * as markDeletedForArchivation from '@/reactions/markDeletedForArchivation';
import * as resurrectEventsOnStartup from '@/reactions/resurrectEventsOnStartup';
import * as resurrectPollOnStartup from '@/reactions/resurrectPollOnStartup';
import { Client } from 'discord.js';

const reactions = [
  keepConfigUpdated,
  markDeletedForArchivation,
  archiveMarkedEvents,
  archiveMarkedPolls,
  resurrectEventsOnStartup,
  resurrectPollOnStartup,
  createEventMessage,
  createPollMessage,
];

export default (client: Client) => {
  client.on('ready', () => {
    client.guilds.forEach((guild) => {
      reactions.forEach(({ setup }) => setup(guild));
    });
  });
};
