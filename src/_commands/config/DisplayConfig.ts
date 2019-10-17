import { DynamicMessage } from 'discord-dynamic-messages';
import * as ini from 'ini';
import { Config } from './Config';

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
