import { addParticipant, updateAttendance } from '../../database';
import { IUpdateHandlerArguments, ResponseEmoji } from './consts';
import { editHandler } from './editHandler';
import { constructEventMessage } from './messageConstructor';
import { filter } from './util';

export const updateHandler = ({ eventMessage, participants, title }: IUpdateHandlerArguments) => {
  // Update message to reflect DB
  eventMessage.edit(constructEventMessage(title, participants));

  const collector = eventMessage.createReactionCollector(filter);
  collector.on('collect', (reaction) => {
    console.debug('got a reaction', reaction.emoji.name);

    if (reaction.emoji.name === ResponseEmoji.EDIT_TITLE) {
      // Start sequence: Edit title
      editHandler({
        eventMessage, participants, title, reaction,
      }, newTitle => {
        title = newTitle;
      });
      return;
    }

    const attendance = reaction.emoji.name === ResponseEmoji.YES ? 'yes'
      : reaction.emoji.name === ResponseEmoji.NO ? 'no' : 'maybe';

    reaction.users.forEach((user) => {
      if (user.bot) { return; }
      reaction.remove(user); // Remove reaction

      const participant = participants.find((par) => par.name === user.username);
      if (participant) {
        participant.attend = attendance;
        participant.timestamp = Date.now();
        updateAttendance({
          newAttendance: attendance,
          event_id: eventMessage.id,
          username: user.username,
        });
      } else {
        participants.push({
          attend: attendance,
          name: user.username,
          timestamp: Date.now(),
        });
        addParticipant({
          event_id: eventMessage.id,
          username: user.username,
          attendance,
        });
      }
    });

    eventMessage.edit(constructEventMessage(title, participants));
  });

  collector.on('end', (collected) => {
    console.debug(`collected ${collected.size} reactions`);
  });
};
