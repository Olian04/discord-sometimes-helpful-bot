import { Client } from 'discord.js';

export const resuscitationHandler = (client: Client) => {
  // TODO: This needs to be looked over regarding the database restructuring
  /*
  client.guilds.forEach(async (guild) => {
    const guildConf = await getConf(guild);
    if (guildConf === undefined) {
      console.warn(`Attempted to resurrect config in unknown guild: Name(${guild.name}) ID(${guild.id})`);
      return;
    }
    if (guildConf.cache.meta.channelID && guildConf.cache.meta.displayMessageID) {
      // Resuscitate display message
      const configChannel = client.channels
        .filter((channel) => channel.id === guildConf.cache.meta.channelID).array()[0] as TextChannel;

      if (! configChannel) {
        console.error(`Unexpected missing config channel: ${guildConf.cache.meta.channelID}`);
        return;
      }
      configChannel.fetchMessage(guildConf.cache.meta.displayMessageID)
        .then((message) => {
          console.info(`Connected to config: Guild(${guild}) Channel(${message.channel.id}) Message(${message.id})`);
          guildConf.dynamicMessage = new DisplayConfig(guildConf);
          guildConf.dynamicMessage.message =  message;
          guildConf.dynamicMessage.reRender();
        });
      }
    });
  */
};
