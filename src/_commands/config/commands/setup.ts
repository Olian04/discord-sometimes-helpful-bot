import { Message } from 'discord.js';
import { updateConfig } from '../../../database';
import { log } from '../../../logger';
import { Config } from '../Config';
import { DisplayConfig } from '../DisplayConfig';

export async function setup(conf: Config, message: Message) {
  log(conf, `Setup config: Started`);

  if (conf.dynamicMessage) {
    conf.dynamicMessage.message.delete();
    conf.dynamicMessage = null;
    log(conf, `Removed old dynamic message`);
  }

  conf.cache.meta.channelID = message.channel.id;
  conf.dynamicMessage =  new DisplayConfig(conf);
  await conf.dynamicMessage.sendTo(message.channel);
  conf.cache.meta.displayMessageID =  conf.dynamicMessage.message.id;
  await updateConfig(conf.guild.id, conf.cache);

  log(conf, `Setup config: Ended`);
}
