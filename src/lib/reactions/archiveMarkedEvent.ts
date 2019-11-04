import { db } from '@/database';
import { logger } from '@/util/logger';
import { Guild, TextChannel } from 'discord.js';

export const setup = (guild: Guild) =>  {
  // Resurrect events stored in db
  db(guild.id).event.onAnyEventChanged(async (event) => {
    if (event.status !== 'toBeArchived') {
      return;
    }
    const channel = guild.channels.get(event.channelID) as TextChannel;
    try {
      const msg = await channel.fetchMessage(event.messageID);
      if (msg && msg.deletable) {
        msg.delete();
        logger.debug.reaction(`Remove an archived events associated discord massage: ${event.messageID}`);
      }
    } catch {
      logger.debug.reaction(`Failed to remove an archived events associated discord massage: ${event.messageID}`);
    }
    db(guild.id).event.update(event.id, {
      status: 'archived',
      messageID: null,
    });
    logger.log.reaction(`Archived event: ${event.title}`);
  });
};
