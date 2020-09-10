import { Whitelist } from '../interfaces/WhiteList';

export const constructListBody = (title: string, whiteList: Whitelist): string => {
  if (whiteList.length === 0) {
    return '```text'
  }
  return title + '\n' +
  '```fix\n' +
    whiteList.map(v => `- ${v}`).join('\n')
   + '```';
}