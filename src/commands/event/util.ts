import { Emoji, MessageReaction, ReactionEmoji, User } from 'discord.js';
import { ResponseEmoji } from './consts';

export const isAcceptableEmoji = (emoji: Emoji | ReactionEmoji) =>
  emoji.name === ResponseEmoji.YES ||
  emoji.name === ResponseEmoji.NO ||
  emoji.name === ResponseEmoji.MAYBE;

export const filter = (reaction: MessageReaction, user: User) =>
  user.bot === false && isAcceptableEmoji(reaction.emoji);
