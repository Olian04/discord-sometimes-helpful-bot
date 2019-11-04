import { db } from '@/database';
import { EventMessage } from '@/messages/event.message';
import { logger } from '@/util/logger';
import { Guild, TextChannel } from 'discord.js';

export const setup = (guild: Guild) =>  {
  // Resurrect events stored in db
  db(guild.id).event.oncePerEvent(async (event) => {
    if (event.status !== 'active') {
      return;
    }
    const channel = guild.channels.get(event.channelID) as TextChannel;
    const markForArchivation = () => {
      db(guild.id).event.update(event.id, {
        status: 'toBeArchived',
      });
    };
    try {
      const message = await channel.fetchMessage(event.messageID);
      if (message) {
        new EventMessage(event).attachTo(message);
        logger.log.reaction(`Resurrected event: ${event.title}`);
      } else {
        markForArchivation();
      }
    } catch {
      markForArchivation();
    }
  });
};
