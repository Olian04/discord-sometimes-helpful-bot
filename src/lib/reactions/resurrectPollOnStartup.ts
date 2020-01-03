import { db } from '@/database';
import { PollMessage } from '@/messages/poll.message';
import { logger } from '@/util/logger';
import { DiscordAPIError, Guild, TextChannel } from 'discord.js';

export const setup = (guild: Guild) =>  {
  // Resurrect polls stored in db
  db(guild.id).poll.oncePerPoll(async (poll) => {
    if (poll.status !== 'active') {
      return;
    }
    const channel = guild.channels.get(poll.channelID) as TextChannel;
    const markForArchivation = () => {
      db(guild.id).poll.update(poll.id, {
        status: 'toBeArchived',
      });
    };

    const message = await channel.fetchMessage(poll.messageID)
      .catch((err: DiscordAPIError) => {
        logger.debug.reaction(`Archiving poll due to exception when fetching message`);
        markForArchivation();
      });

    if (message) {
      new PollMessage(poll).attachTo(message);
      logger.log.reaction(`Resurrected poll: ${poll.title}`);
    } else {
      logger.debug.reaction(`Archiving poll due to null message`);
      markForArchivation();
    }
  });
};
