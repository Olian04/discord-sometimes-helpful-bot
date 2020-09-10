import { Message } from 'discord.js';
import { deferDelete } from '../../../util/defer';
import { isWhitelisted } from '../isWhitelisted';
import { isKnownCommand } from '../util/isKnownCommand';
import { getSnap, db } from '../../../database';
import { resolveChannelConfig } from '../util/resolveChannelConfig';
import { ChannelConfig } from '../interfaces/ChannelConfig';
import { getDirectMessageChannel } from '../../../util/getDirectMessageChannel';

export const onMessage = async (message: Message) => {
  if (message.channel.type !== 'text') { return; }
  if (! message.content.startsWith('!enable ')) { return; }
  if (! isWhitelisted('enable', message)) { return; }

  deferDelete(message);

  const cmdName = message.content.substring('!enable '.length).trim();

  const dmChannel = await getDirectMessageChannel(message.author);

  if (! isKnownCommand(cmdName)) {
    dmChannel.send(`Unknown command: "${cmdName}"`);
    return;
   }

  const path = `config/channel/${message.channel.id}`;
  const snap = await getSnap(path)
    .catch(console.warn);
  if (!snap) {
    console.warn(`Failed to fetch snapshot of db: ${path}`);
    return;
  }
  const config = resolveChannelConfig(
    snap.val() as ChannelConfig
  );

  const channelName = message.channel.name;
  if (config.command_whitelist.indexOf(cmdName) < 0) {
    config.command_whitelist.push(cmdName);

    db.child(`config/channel/${message.channel.id}`).set(config)
      .then(() => console.log(`Committed channel config for channel "${channelName}" to db.`))
      .catch(console.warn);
  }

  dmChannel.send(
    `**[config]** Successfully enabled command \`${cmdName}\` in this channel.`
  ).then((val) => {
    console.log(`Sent enable config message to discord`);
    return val;
  }).catch(console.warn);
};