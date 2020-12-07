import { Message, Client } from 'discord.js';
import { deferDelete } from '../../util/defer';
import { isWhitelisted } from '../config/api';
import { rollDice } from '@olian/dice-roller';

export const onMessage = (app: Client) => async (message: Message) => {
  if (message.channel.type !== 'text') { return; }
  if (! message.content.startsWith('!roll')) { return; }
  if (! await isWhitelisted('roll', message)) { return; }

  deferDelete(message);

  let diceString = message.content.substring('!roll'.length).trim();

  if (diceString.length === 0) {
    diceString = '1d20';
  }

  const results = rollDice(diceString);

  message.reply(
    '```haskell\n'+
    `input: ${diceString.replace(/\s+/g, ' ')}\n`+
    `rolls: ${results.values.join('+')}\n`+
    `sum: ${results.sum}\n`+
    '```'
  ).then((val) => {
    console.log(`Dice roll results sent to discord: ${diceString} = ${results.sum}`);
    return val;
  }).catch(console.warn);
};