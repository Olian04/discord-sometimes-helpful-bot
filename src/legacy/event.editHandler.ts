// NOTE: This code has been retrofitted from the 1.x version of the application
// and is therefor to be considered unstable.

import { logger } from '@/util/logger';
logger.warn.app(`Loaded legacy module: event.editHandler.ts`);

import { IParticipant } from '@/interfaces/participant.interface';
import { Message, MessageReaction } from 'discord.js';

// from './consts'
interface IEditHandlerArguments {
  title: string;
  participants: IParticipant[];
  eventMessage: Message;
  reaction: MessageReaction;
}

// from '../../database'
import { db } from '@/database';
const updateEventTitle = async (args: {
  newTitle: string, guild_id: string, message_id: string,
}) => {
  db(args.guild_id).event.getEventID(args.message_id, (eventID) => {
    db(args.guild_id).event.update(eventID, {
      title: args.newTitle,
    });
  });
};

 // from '../../util/commandUtils'
import { config } from '@/config';
const isCommand = (message: Message): boolean => {
  return message.content.startsWith(config.commander.prefix);
};
const tokenizeCommand = (message: Message): string[] => {
  return message.content.substring(config.commander.prefix.length).split(' ');
};

export const legacyEditHandler = ({
    eventMessage, title, reaction,
  }: IEditHandlerArguments) => {
  reaction.users.forEach(async (user) => {
    // Send instructions
    const dm = await user.send(`You are attempting to change the title of an event.
The current title is:
\`\`\`text
${title}
\`\`\`
In order to change the title please respond to this message with \`!title\` followed by the new title.
Ex: \`!title This is the new title!\`
`) as Message;

    // Collect response
    const response = (await user.dmChannel.awaitMessages((msg) => !msg.author.bot, {
      max: 1,
    })).first();

    const abortChange = (reason: string) => {
      const msg = 'Title change aborted: ' + reason;
      logger.debug.dynamicMessage(msg);
      dm.edit(msg);
    };

    if (isCommand(response)) {
      const [command, ...args] = tokenizeCommand(response);
      if (command === 'title') {
        const newTitle = args.join(' ');
        updateEventTitle({
          newTitle,
          guild_id: eventMessage.guild.id,
          message_id: eventMessage.id,
        });
        dm.edit('Title change successfully submitted!');
        logger.debug.dynamicMessage('Title change successfully submitted: ' + newTitle);
      } else {
        abortChange('Unknown command.');
      }
    } else {
      abortChange('Missing command in message.');
    }
  });
};
