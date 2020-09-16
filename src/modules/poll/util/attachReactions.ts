import { Message } from 'discord.js';
import { emojiNumberMap } from './emojiNumberMap';

export const attachReactions = (
  message: Message,
  optionCount: number,
  i = 0
): Promise<void> => Promise.resolve()
    .then(async () => {
      if (i >= optionCount) {
        return;
      }
      await message.react(emojiNumberMap[i]);
      await attachReactions(message, optionCount, i + 1);
    })
    .catch(console.warn);
