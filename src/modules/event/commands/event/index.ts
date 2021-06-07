import { defineModuleCommand } from '../../../../util/defineModuleCommand';
import { config } from './config';
import { onCommand } from './onCommand';

export default defineModuleCommand({
  config,
  handler: onCommand,
});