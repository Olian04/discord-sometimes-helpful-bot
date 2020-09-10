import { Whitelist } from '../interfaces/WhiteList';

export const constructListBody = (title: string, whiteList: Whitelist): string => {
  return title + '\n' +
  '```fix\n' +
    whiteList.map(v => `- ${v}`).join('\n')
   + '```';
}