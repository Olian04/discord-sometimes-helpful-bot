import { Message } from 'discord.js';
import { deferDelete } from '../../../util/defer';
import { isWhitelisted } from '../isWhitelisted';
import { getSnap } from '../../../database';
import { resolveChannelConfig } from '../util/resolveChannelConfig';
import { ChannelConfig } from '../interfaces/ChannelConfig';
import { constructListBody } from '../util/constructListBody';
import { KnownCommandsMap } from '../interfaces/KnownCommand';
import { Whitelist } from '../interfaces/WhiteList';
import { getDirectMessageChannel } from '../../../util/getDirectMessageChannel';

export const onMessage = async (message: Message) => {
  if (message.channel.type !== 'text') { return; }
  if (! message.content.startsWith('!list')) { return; }
  if (message.content.startsWith('!list:admin')) { return; }
  if (! isWhitelisted('list', message)) { return; }

  deferDelete(message);

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

  let responseBody = `**[config]** `;

  if (config.command_whitelist.length > 0) {
    responseBody += constructListBody(
      `Available commands:`,
      config.command_whitelist
    );
  } else {
    responseBody += `Only admins may use commands in this channel.`
  }


  const isAdmin = message
    .guild.member(message.author)
    .hasPermission('ADMINISTRATOR');

  if (isAdmin) {
    responseBody += constructListBody(
      `\nAvailable admin commands:`,
      Object.keys(KnownCommandsMap) as Whitelist
    );
  }

  const dmChannel = await getDirectMessageChannel(message.author);

  dmChannel.send(
    responseBody
  ).then((val) => {
    console.log(`Sent list message to discord`);
    return val;
  }).catch(console.warn);
};