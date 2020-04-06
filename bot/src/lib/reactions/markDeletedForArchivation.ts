import { db } from '@/database';
import { Guild, Message } from 'discord.js';

export const setup = (guild: Guild) => {
  guild.client.on('messageDelete', (message: Message) => {
    if (message.guild === undefined) {
      // Message was sent in a DM or a group DM.
      return;
    }

    // Events
    db(guild.id).event.getEventID(message.id, (maybeEventID) => {
      if (! maybeEventID) {
        return;
      }
      db(guild.id).event.update(maybeEventID, {
        status: 'toBeArchived',
      });
    });

    // Polls
    db(guild.id).poll.getPollID(message.id, (maybePollID) => {
      if (! maybePollID) {
        return;
      }
      db(guild.id).poll.update(maybePollID, {
        status: 'toBeArchived',
      });
    });
  });
};
