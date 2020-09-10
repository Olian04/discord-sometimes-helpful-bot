import { User } from 'discord.js';

export const getDirectMessageChannel = async (user: User) =>
  user.dmChannel || await user.createDM();