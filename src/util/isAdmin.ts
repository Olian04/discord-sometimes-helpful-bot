import { User, Guild } from 'discord.js';

// TODO: Make sure there wont by any issues with partial guilds, partial users and partial guild_members.
export const isAdmin = (user: User, guild: Guild) =>
  guild.member(user).hasPermission('ADMINISTRATOR');