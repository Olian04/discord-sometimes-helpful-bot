import { Config } from '@/lib/config/configObject';
import { DynamicMessage } from 'discord-dynamic-messages';
import * as ini from 'ini';

export class DisplayConfig extends DynamicMessage {
  private configObj: Config;
  constructor(configObject: Config) {
    super();
    this.configObj = configObject;
  }
  public render() {
    return ['```ini', ini.encode(this.configObj.cache), '```'].join('\n');
  }
}
