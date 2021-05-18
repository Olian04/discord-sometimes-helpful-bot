import { defineModule } from '../../util/defineModule';
import echoCommand from './commands/echo';
import counterCommand from './commands/counter';

export default defineModule({
  name: 'test',
  commands: [
    echoCommand,
    counterCommand,
  ],
});