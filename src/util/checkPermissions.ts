import { Guild, PermissionResolvable, Snowflake } from 'discord.js';

export const checkPermissions = (guild: Guild, userID: Snowflake, permissions: PermissionResolvable[]) => {
  const member =  guild.members.cache.get(userID);
  if (guild === null) return false;
  if (member === null) return false;

  return permissions
    .map(permission => member.permissions.has(permission))
    .every((val) => val === true);
};


export const isAdmin = (guild: Guild, userID: Snowflake) =>
  checkPermissions(guild, userID, [
    'ADMINISTRATOR'
  ]);