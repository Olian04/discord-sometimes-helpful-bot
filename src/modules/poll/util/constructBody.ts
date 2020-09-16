import { VoteData } from '../interfaces/VoteData';
import { emojiNumberMap } from './emojiNumberMap';

const graphSegments = 20;
const graphSymbol = {
  full: '█',
  empty: '░',
};
const mongolianVowelSeparator = '᠎'; // NOT AN EMPTY STRING

export const constructBody = (data: VoteData) => {
  console.debug('constructBody', data);
  const optionArray = Object.values(data.options);
  const largest = optionArray.reduce((a, {voteCount: b}) => Math.max(a, b), 0);
  const options = optionArray
    .map((op) => {
    const barCount = largest === 0 ? 0 : Math.ceil((op.voteCount / largest) * graphSegments);

    return {
      title: op.title,
      bars: Array(barCount).fill(graphSymbol.full).join('')
      + Array(graphSegments - barCount).fill(graphSymbol.empty).join(''),
    }
  });

  const body = `**[poll]** ${data.title}\n`
    + options
      .map((op, i) => `${op.bars} ${emojiNumberMap[i]} - **${op.title}**`)
      .join('\n')
    + `\n${mongolianVowelSeparator}`; // Forces the "(edited)" tag onto its own row

  return body;
}
