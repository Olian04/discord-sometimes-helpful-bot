import { Client, Message } from 'discord.js';
import { db } from '../../database';
import { deferDelete } from '../../util/defer';
import { isWhitelisted } from '../config/api';
import { VoteData } from './interfaces/VoteData';
import { attachReactions } from './util/attachReactions';
import { constructBody } from './util/constructBody';

export const onMessage = (app: Client) => async (message: Message) => {
  if (message.channel.type !== 'text') { return; }
  if (! message.content.startsWith('!poll ')) { return; }
  if (! isWhitelisted('poll', message)) { return; }

  deferDelete(message);

  const [title, ...optionTitles] = message.content
    .substring('!poll '.length)
    .split(';')
    .map(s => s.trim());

  const voteData: VoteData = {
    title,
    options: optionTitles.map(option => ({
      title: option,
      voteCount: 0,
    })),
  };

  const msg = await message.channel.send(
    constructBody(voteData),
  );

  attachReactions(msg, voteData.options.length);

  db.child(`poll/${msg.id}`).set(voteData)
    .then(() => console.log(`Committed event to db: ${title}`))
    .catch(console.warn);
}