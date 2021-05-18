import { Message } from 'discord.js';

import { checkPermissions } from './checkPermissions';
import { defer } from './defer';
import { emptyPromise } from './emptyPromise';

export const deleteMessageIfAble = (msg: Message) => {
  if (msg.deleted) {
    console.warn(`Failed to delete message (ID: ${msg.id}) because it's already deleted`);
    return emptyPromise();
  }
  if (!msg.deletable) {
    console.warn(`Failed to delete message (ID: ${msg.id}) because its deletable`);
    return emptyPromise();
  }
  if (msg.guild === null) {
    console.warn(`Failed to delete message (ID: ${msg.id}) because it doesn't belong to a guild`);
    return emptyPromise();
  }
  const canManageMessages = checkPermissions(msg.guild, msg.id, ['MANAGE_MESSAGES']);
  if (!canManageMessages) {
    console.warn(`Failed to delete message (ID: ${msg.id}) because bot is missing "MANAGE_MESSAGES" permission`);
    return emptyPromise();
  }

  return msg.delete()
    .then(() => {
      console.log(`Successfully deleted message (ID: ${msg.id})`);
    })
    .catch((err) => {
      console.warn(`Failed to delete message (ID: ${msg.id}) because of unknown reason:`, err);
    });
};

export const deleteMessageDeferred = (message: Message) => defer(() =>
  deleteMessageIfAble(message),
);