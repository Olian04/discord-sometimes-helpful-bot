import { db } from '@/database';
import { deleteIfAble } from '@/util/command';
import { logger } from '@/util/logger';
import { DiscordAPIError, Guild, TextChannel } from 'discord.js';

export const setup = (guild: Guild) =>  {
  // Resurrect polls stored in db
  db(guild.id).poll.onAnyPollChanged(async (poll) => {
    if (poll.status !== 'toBeArchived') {
      return;
    }
    const channel = guild.channels.get(poll.channelID) as TextChannel;
    const msg = await channel.fetchMessage(poll.messageID)
      .catch((err: DiscordAPIError) => {
        logger.debug.reaction(`Failed to fetch an archived polls associated discord massage: ${poll.messageID}`);
      });

    if (msg && msg.deletable) {
      const deleteResult = await deleteIfAble(msg);
      if (deleteResult === 'successful') {
        logger.debug.reaction(`Remove an archived polls associated discord massage: ${poll.messageID}`);
      } else {
        logger.debug.reaction(`Failed to remove an archived polls associated discord massage (${deleteResult}): ${poll.messageID}`);
      }
    }

    db(guild.id).poll.update(poll.id, {
      status: 'archived',
      messageID: null,
    });
    logger.log.reaction(`Archived poll: ${poll.title}`);
  });
};
