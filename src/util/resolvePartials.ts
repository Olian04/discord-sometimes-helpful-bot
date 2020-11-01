import { Message, MessageReaction, PartialMessage, PartialUser, User } from 'discord.js';

export const resolvePartialReaction = async (reaction: MessageReaction) => {
  if (reaction.partial) { await reaction.fetch().catch(console.warn); }
  return reaction as any as MessageReaction;
}

export const resolvePartialUser = async (user: PartialUser | User) => {
  if (user.partial) { await user.fetch().catch(console.warn); }
  return user as any as User;
}

export const resolvePartialMessage = async (message: PartialMessage | Message) => {
  if (message.partial) { await message.fetch().catch(console.warn); }
  return message as any as Message;
}