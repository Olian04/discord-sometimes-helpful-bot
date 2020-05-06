import { commander } from '@/commander';
import { config } from '@/config';
import { logger } from '@/util/logger';
import { Client, Message } from 'discord.js';
import './processJobs';
import { deleteIfAble } from './util/deleteIfAble';

export const client: Client = new Client();

client.on('message', (message: Message) => {
  if (message.guild === null) {
    // Message was sent in a DM or a group DM.
    logger.debug.app(`Ignored message because guild was null`);
    return;
  }
  if (message.author.bot) { return; }
  if (! commander.isKnownCommand(message)) {
    /*
    if (config.guildConfigs[message.guild.id].channels[message.channel.id].isCommandOnly) {
      logger.debug.app(`Removed a message from a command-only-channels: ${message.content}`);
      message.author.send(
        `A message you wrote has been removed due to restrictions put on the channel.\n` +
        `Only messages containing commands for ME (the sometimes-helpful BOT) may be posted in the given channel.`,
      );
      deleteIfAble(message);
    }
    */
    return;
  }

  commander.handleMessage('new', message);
});

(async () => {
  const secret = await config.secret.discord;
  client.login(secret)
    .then(() => logger.info.app(`Login successful`))
    .catch((err) => {
      logger.error.app(`Login failed`);
      throw err;
    });
})();
