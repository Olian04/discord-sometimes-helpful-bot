import { Client, ApplicationCommandData, Guild } from 'discord.js';

export const registerGlobalCommand = (app: Client, commandData: ApplicationCommandData) => {
  return app.application.commands.create(commandData)
    .then(() => {
      console.log(`Successfully registered application wide command (Name: ${commandData.name})`);
    })
    .catch((err) => {
      console.warn(`Failed to register application wide command (Name: ${commandData.name}) because of an unknown reason:`, err);
    });
}

export const registerGuildCommand = (guild: Guild, commandData: ApplicationCommandData) => {
    return guild.commands.create(commandData)
      .then(() => {
        console.log(`Successfully registered command (Name: ${commandData.name}) for guild (ID: ${guild.id})`);
      })
      .catch((err) => {
        console.warn(`Failed to registered command (Name: ${commandData.name}) for guild (ID: ${guild.id}) because of an unknown reason:`, err);
      });
}

export const registerCommandInGuilds = (app: Client, commandData: ApplicationCommandData) => {
  app.guilds.cache.forEach(guild =>
    registerGuildCommand(guild, commandData),
  );
}