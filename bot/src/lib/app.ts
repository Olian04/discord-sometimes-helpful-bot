import { commander } from '@/commander';
import { config } from '@/config';
import { logger } from '@/util/logger';
import { Client, Message } from 'discord.js';
import './processJobs';
import { deleteIfAble } from './util/deleteIfAble';

export const client: Client = new Client();

// TODO: 1. Add reactivity to event message (archive event if message is deleted, update event if a reaction is made)
// TODO: 2. Add transactions tracking to DB: A transaction keeps track of what and who is allowed to change data in the DB through the web based UI.
// Opening a transaction will prompt the bot to send a PM to the user with 2 things:
// 1. A transaction ID that the user should copy.
// 2. A link to the config UI page, with a callback url attached: ui.page.com?url=someDomain.com/config
// Navigating to the config UI will ask the user for the transaction ID.
// The webclient will then send a request to the callback URL with the given transaction ID as the request body.
// The response will be a config object that the webclient will use to configure the UI.
// The user may then make changes to the config (via the UI) and click Save/Submit, when their done.
// The webclient will then send a request to the callback URL with the updated config and the transaction ID as the request body.
// This will invalidate the transaction ID and will result in any number of jobs being dispatched to the bot (via the DB).

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
