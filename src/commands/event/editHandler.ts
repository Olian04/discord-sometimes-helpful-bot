import { Message, MessageReaction, RichEmbed } from 'discord.js';
import { updateEventTitle } from '../../database';
import { isCommand, tokenizeCommand } from '../../util/commandUtils';
import { IUpdateHandlerArguments } from './consts';
import { constructEventMessage } from './messageConstructor';

type editHandlerArguments = IUpdateHandlerArguments & { reaction: MessageReaction };
export const editHandler = ({
    eventMessage, participants, title, reaction,
  }: editHandlerArguments,  onChangeCB: (newTitle: string) => void) => {
  reaction.users.forEach(async (user) => {
    reaction.remove(user); // Remove reaction

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

    const abortChange = () => {
      console.debug('Title change aborted');
      dm.edit('Title change aborted.');
    };

    if (isCommand(response.content)) {
      const [command, ...args] = tokenizeCommand(response.content);
      if (command === 'title') {
        const newTitle = args.join(' ');
        onChangeCB(newTitle);
        updateEventTitle({
          newTitle,
          message_id: eventMessage.id,
          channel_id: eventMessage.channel.id,
        }).then(async () => {
          await eventMessage.edit(constructEventMessage(newTitle, participants))
            .catch((err) => console.error(`Unexpected error when editing event message:`, err));

          console.debug('Successfully update the title of an event');
          dm.edit('Successfully updated title!');
        }).catch((err) => {
          console.warn(`Unexpectedly failed updating event title: ${err}`);
          dm.edit(`Failed to update title. Please try again later.
If this problem persists please raise an issue on my github page.`, new RichEmbed()
            .setURL('https://github.com/Olian04/discord-sometimes-helpful-bot')
            .setTitle('Github page'),
          );
        });
      } else {
        abortChange();
      }
    } else {
      abortChange();
    }
  });
};
