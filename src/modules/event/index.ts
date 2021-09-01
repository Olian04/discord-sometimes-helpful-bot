import { Client, MessageActionRow, MessageButton } from 'discord.js';
import { emoji } from 'node-emoji';
import { Event } from './flux';

export { eventCommand } from './command';

export const initialize = (app: Client) => {
  app.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    const id = interaction.message.id;
    if (!Event.has(id)) return;

    try {

      switch (interaction.customId) {
        case 'event_yes':
          await Event.dispatch(id, {
            type: 'updateParticipation',
            userID: interaction.user.id,
            userNamer: interaction.member.user.username,
            participationStatus: 'yes',
          });
          break;
        case 'event_no':
          await Event.dispatch(id, {
            type: 'updateParticipation',
            userID: interaction.user.id,
            userNamer: interaction.member.user.username,
            participationStatus: 'no',
          });
          break;
        case 'event_maybe':
          await Event.dispatch(id, {
            type: 'updateParticipation',
            userID: interaction.user.id,
            userNamer: interaction.member.user.username,
            participationStatus: 'maybe',
          });
          break;
        default:
          throw new Error(`Unexpected customId for event message interaction: ${interaction.customId}`);
        }

        const body = await Event.get(id);
        interaction.update({
          content: body,
        });
      } catch (err) {
      console.error(err);
      interaction.reply({
        ephemeral: true,
        content: 'Something went wrong... please try again later. If the issue persists please contact and administrator.'
      })
    }
  });

  app.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName !== 'event') return;

    try {
      const commandChannel = interaction.channel;
      const eventMsg = await commandChannel.send('Loading...');

      const title = interaction.options.getString('title');

      await Event.create(eventMsg.id);
      const body = await Event.update(eventMsg.id, {
        type: 'updateTitle',
        title,
      });
      await eventMsg.edit({
        content: body,
        components: [
          new MessageActionRow()
            .addComponents(
                new MessageButton()
                  .setStyle('SUCCESS')
                  .setEmoji(emoji.thumbsup)
                  .setCustomId('event_yes'),
              new MessageButton()
                  .setStyle('DANGER')
                  .setEmoji(emoji.thumbsdown)
                  .setCustomId('event_no'),
              new MessageButton()
                  .setStyle('SECONDARY')
                  .setEmoji(emoji.grey_question)
                  .setCustomId('event_maybe'),
            )
        ]
      });

      interaction.reply({
        ephemeral: true,
        content: 'Event created!'
      });
    } catch (err) {
      console.error('Create event', err);
      interaction.reply({
        ephemeral: true,
        content: 'Something went wrong. Event creation failed!'
      });
    }
  });
}
