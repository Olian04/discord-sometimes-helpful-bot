import { Message } from 'discord.js';

export const directMessageGuildID = 'direct message';
export const getGuildID = (message: Message) => (message && message.guild && message.guild.id) || directMessageGuildID;
