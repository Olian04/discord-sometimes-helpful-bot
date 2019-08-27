import { DynamicMessage } from 'discord-dynamic-messages';
import { Client, Message, TextChannel } from 'discord.js';
import * as ini from 'ini';
import { getAllConfig, updateConfig } from '../database';
import { isCommand, tokenizeCommand } from '../util/commandUtils';

class DisplayConfig extends DynamicMessage {
  public render() {
    return ['```ini', ini.encode(configCache), '```'].join('\n');
  }
}

interface IConfig {
  meta: {
    channelID: string;
    displayMessageID: string;
  };
  [section: string]: {
    [key: string]: any;
  };
}

let dynamicMessage: DisplayConfig = null;
export let configCache: IConfig = {
  meta: {
    channelID: null,
    displayMessageID: null,
  },
};

const availableSubCommands = {
  setup: async (message: Message) => {
    if (dynamicMessage) {
      dynamicMessage.message.delete();
      dynamicMessage = null;
    }
    console.log(`Config channel set to: ${message.channel.id}`);
    configCache.meta.channelID = message.channel.id;
    dynamicMessage =  new DisplayConfig();
    await dynamicMessage.sendTo(message.channel);
    configCache.meta.displayMessageID =  dynamicMessage.message.id;
    console.log(configCache);
    await updateConfig(configCache);
  },
};

export const ID = 'config';
export const callback = async (client: Client) => {
  configCache = await getAllConfig() as IConfig;
  if (configCache.meta === undefined) {
    configCache.meta = {
      channelID: null,
      displayMessageID: null,
    };
  }

  const messageHandler = async (message: Message) => {
    if (message.author.bot) { return; }

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

      if ( subCommand !== 'setup' && configCache.meta.channelID === null) {
        console.warn('No config channel yet assigned');
        message.delete();
        return;
      }

      if (message.channel.id !== configCache.meta.channelID && configCache.meta.channelID !== null) {
        console.warn(`User "${message.author.username}" attempted to configure bot in none config channel`);
        message.delete();
        return;
      }

      await availableSubCommands[subCommand](message);

      message.delete();
      return;
    }

    if (message.channel.id !== configCache.meta.channelID) {
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
    updateConfig(config);
    Object.keys(config).forEach((section)  => {
      configCache[section] = config[section];
    });
    message.delete();
    dynamicMessage.reRender();
  };
  client.on('message', messageHandler);
  client.on('messageUpdate', (oldMessage, newMessage) => messageHandler(newMessage));

  if (configCache.meta.channelID && configCache.meta.displayMessageID) {
    // Resuscitate display message
    const configChannel = client.channels
      .filter((channel) => channel.id === configCache.meta.channelID).array()[0] as TextChannel;
    configChannel.fetchMessage(configCache.meta.displayMessageID)
      .then((message) => {
        console.info(`Connected to config channel: ${message.channel.id}`);
        console.info(`Connected to config message: ${message.id}`);
        dynamicMessage = new DisplayConfig();
        dynamicMessage.message =  message;
        dynamicMessage.reRender();
      });
  }
};
