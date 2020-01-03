import { db } from '@/database';
import { PollMessage } from '@/messages/poll.message';
import { logger } from '@/util/logger';
import { Guild, TextChannel } from 'discord.js';

export const setup = (guild: Guild) =>  {
  // Create PollMessage for new Polls
  db(guild.id).poll.onNewPoll(async (poll) => {
    const channel = guild.channels.get(poll.channelID) as TextChannel;
    const dynMsg = await (new PollMessage(poll).sendTo(channel));
    db(guild.id).poll.update(poll.id, {
      status: 'active',
      messageID: dynMsg.message.id,
    });

    logger.log.reaction(`Created new poll: ${poll.title}`);
  });
};
