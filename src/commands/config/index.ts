import { Client, Guild, Message, TextChannel } from 'discord.js';
import * as ini from 'ini';
import { createGuildEntryIfNotExist, updateConfig } from '../../database';
import { getGuildID, isCommand, isDirectMessage, tokenizeCommand } from '../../util/commandUtils';
import { Config } from './Config';
import { DisplayConfig } from './DisplayConfig';

const availableSubCommands: { [commandID: string]: (conf: Config, message: Message) => void } = {
  setup: require('./commands/setup'),
};

const configs = new Map<string, Config>();
export const getConf = async (guild: Guild) => {
  if (configs.has(guild.id)) {
    configs.set(guild.id, new Config(guild));
    await configs.get(guild.id).fetchLatestConfig();
  }
  return configs.get(guild.id);
};

export const ID = 'config';
export const callback = async (client: Client) => {
  const messageHandler = async (message: Message) => {
    if (message.author.bot) { return; }
    if (isDirectMessage(message)) { return; }

    await createGuildEntryIfNotExist(message.guild.id); 

    const guildConf = await getConf(message.guild);

    const isAdmin = message.member.hasPermission('ADMINISTRATOR');

    if (isCommand(message.content)) {
      // Parse command
      const [command, ...args] = tokenizeCommand(message.content);
      if (command !== 'config') { return; }

      if (! isAdmin) {
        console.warn(`None-admin user "${message.author.username}" attempted illegally to configure bot.`);
        message.delete();
        return;
      }

      const [subCommand, ...subArgs] =  args;
      if ( ! (subCommand in availableSubCommands) ) {
        console.debug(`Unknown config command: ${subCommand}`);
        message.delete();
        return;
      }

      if ( subCommand !== 'setup' && guildConf.cache.meta.channelID === null) {
        console.warn('No config channel yet assigned');
        message.delete();
        return;
      }

      if (
        message.channel.id !== guildConf.cache.meta.channelID
          &&
        guildConf.cache.meta.channelID !== null
      ) {
        console.warn(`User "${message.author.username}" attempted to configure bot in none config channel`);
        message.delete();
        return;
      }

      await availableSubCommands[subCommand](guildConf, message);

      message.delete();
      return;
    }

    if (message.channel.id !== guildConf.cache.meta.channelID) {
      console.debug('Config ignored message');
      return;
    }

    if (! isAdmin) {
      console.info(`None-admin user "${message.author.username}" wrote in config channel.`);
      message.delete();
      return;
    }

    if (! /^```ini(.|\n)*```$/.test(message.content)) {
      console.warn(`Config message had wrong format.`);
      message.delete();
      return;
    }

    const rawIni = message.content.substring('```ini'.length, message.content.length - '```'.length);
    const config = ini.parse(rawIni);
    updateConfig(getGuildID(message), config);
    Object.keys(config).forEach((section)  => {
      guildConf.cache[section] = config[section];
    });
    guildConf.dynamicMessage.reRender();
    message.delete();
  };
  client.on('message', messageHandler);
  client.on('messageUpdate', (oldMessage, newMessage) => messageHandler(newMessage));

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
};
