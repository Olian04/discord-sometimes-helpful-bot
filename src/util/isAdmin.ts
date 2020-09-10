import { User, Guild } from 'discord.js';

export const isAdmin = (user: User, guild: Guild) =>
  guild.member(user).hasPermission('ADMINISTRATOR');