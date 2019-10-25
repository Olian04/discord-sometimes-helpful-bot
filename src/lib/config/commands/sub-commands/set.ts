import { updateConfig } from '@/core/database';
import { Config } from '@/lib/config/configObject';
import * as ini from 'ini';

export const setConfig = (conf: Config, configBody: string) => {
  const config = ini.parse(configBody);
  updateConfig(conf.guild.id, config);
  Object.keys(config).forEach((section)  => {
    conf.cache[section] = config[section];
  });
  conf.dynamicMessage.reRender();
};
