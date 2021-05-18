import { TextChannel } from 'discord.js';
import { formatDistance } from 'date-fns';
import { CommandHandler } from '../../../../types/CommandHandler';

const messageBody = (startTime: Date) => formatDistance(startTime, new Date());

export const onCommand: CommandHandler = async (interaction, app) => {
  console.log('interaction keys', Object.keys(interaction));
  console.log('guildID', interaction.guildID);
  console.log('channelID', interaction.channelID);
  const guild = app.guilds.cache.get(interaction.guildID);
  console.log('guild', guild);
  /*
  const channel = guild.channels.cache.get(interaction.channelID) as TextChannel;
  console.log('channel', channel);

  const startTime = new Date();
  const msg = await channel.send(messageBody(startTime));
  setInterval(() => {
    msg.edit(messageBody(startTime));
  }, 5000);
  */
}