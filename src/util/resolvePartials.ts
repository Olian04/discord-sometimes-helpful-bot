import { GuildMember, Message, MessageReaction, PartialGuildMember, PartialMessage, PartialUser, User } from 'discord.js';

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

export const resolvePartialGuildMember = async (member: PartialGuildMember | GuildMember) => {
  if (member.partial) { await member.fetch().catch(console.warn); }
  return member as any as GuildMember;
}

// TODO:  Figure out how to resolve a partial Channel / TextChannel