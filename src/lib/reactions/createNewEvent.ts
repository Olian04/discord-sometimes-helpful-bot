import { db } from '@/database';
import { EventMessage } from '@/messages/event.message';
import { logger } from '@/util/logger';
import { Guild, TextChannel } from 'discord.js';

export const setup = (guild: Guild) =>  {
  // Create EventMessage for new Events
  db(guild.id).event.onNewEvent(async (event) => {
    const channel = guild.channels.get(event.channelID) as TextChannel;
    const dynMsg = await (new EventMessage(event).sendTo(channel));
    db(guild.id).event.update(event.id, {
      status: 'active',
      messageID: dynMsg.message.id,
    });

    logger.log.reaction(`Created new event: ${event.title}`);
  });
};
