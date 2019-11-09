import { db } from '@/database';
import { deleteIfAble } from '@/util/command';
import { logger } from '@/util/logger';
import { DiscordAPIError, Guild, TextChannel } from 'discord.js';

export const setup = (guild: Guild) =>  {
  // Resurrect events stored in db
  db(guild.id).event.onAnyEventChanged(async (event) => {
    if (event.status !== 'toBeArchived') {
      return;
    }
    const channel = guild.channels.get(event.channelID) as TextChannel;
    const msg = await channel.fetchMessage(event.messageID)
      .catch((err: DiscordAPIError) => {
        logger.debug.reaction(`Failed to fetch an archived events associated discord massage: ${event.messageID}`);
      });

    if (msg && msg.deletable) {
      const deleteResult = await deleteIfAble(msg);
      if (deleteResult === 'successful') {
        logger.debug.reaction(`Remove an archived events associated discord massage: ${event.messageID}`);
      } else {
        logger.debug.reaction(`Failed to remove an archived events associated discord massage (${deleteResult}): ${event.messageID}`);
      }
    }

    db(guild.id).event.update(event.id, {
      status: 'archived',
      messageID: null,
    });
    logger.log.reaction(`Archived event: ${event.title}`);
  });
};
