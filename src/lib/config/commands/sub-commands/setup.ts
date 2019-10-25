import { updateConfig } from '@/core/database';
import { Config } from '@/lib/config/configObject';
import { DisplayConfig } from '@/lib/config/messages/DisplayConfig';
import { deleteIfAble } from '@/util/command';
import { log } from '@/util/logger';
import { Message } from 'discord.js';

export async function setupConfig(conf: Config, message: Message) {
  log(conf, `Setup config: Started`);

  if (conf.dynamicMessage) {
    conf.dynamicMessage.message.delete();
    conf.dynamicMessage = null;
    log(conf, `Removed old dynamic message`);
  }

  conf.cache.meta.channelID = message.channel.id;
  conf.dynamicMessage =  await new DisplayConfig(conf).sendTo(message.channel);
  conf.cache.meta.displayMessageID =  conf.dynamicMessage.message.id;
  conf.dynamicMessage.reRender(); // Render updated displayMessageID

  await updateConfig(conf.guild.id, conf.cache);

  deleteIfAble(message);

  log(conf, `Setup config: Ended`);
}
