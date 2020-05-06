import { Message } from 'discord.js';

export const deleteIfAble = async (message: Message) => {
  if (message.deletable) {
    try {
      await message.delete();
      return 'successful';
    } catch {
      return 'failed';
    }
  } else {
    return 'disallowed';
  }
};
