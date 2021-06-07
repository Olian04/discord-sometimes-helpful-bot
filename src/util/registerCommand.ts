import { Client, ApplicationCommandData, Guild } from 'discord.js';

export const registerGlobalCommand = (app: Client, commandData: ApplicationCommandData) => {
  return app.application.commands.create(commandData)
    .then(() => {
      console.info(`Successfully registered application wide command (Name: ${commandData.name})`);
    })
    .catch((err) => {
      console.error(`Failed to register application wide command (Name: ${commandData.name}):`, err);
    });
}

export const registerGuildCommand = (guild: Guild, commandData: ApplicationCommandData) => {
    return guild.commands.create(commandData)
      .then(() => {
        console.info(`Successfully registered command (Name: ${commandData.name}) for guild (ID: ${guild.id})`);
      })
      .catch((err) => {
        console.error(`Failed to registered command (Name: ${commandData.name}) for guild (ID: ${guild.id}):`, err);
      });
}

export const registerCommandInGuilds = (app: Client, commandData: ApplicationCommandData) => {
  app.guilds.cache.forEach(guild =>
    registerGuildCommand(guild, commandData),
  );
}