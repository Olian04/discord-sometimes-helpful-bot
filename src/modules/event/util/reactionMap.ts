import { emoji } from 'node-emoji';

export const reactionMap = {
  [emoji.thumbsup]: 'yes',
  [emoji.thumbsdown]: 'no',
  [emoji.grey_question]: 'maybe',
  [emoji.wrench]: 'start_edit_session', // This is a workaround that allows me to reuse excising logic.
};