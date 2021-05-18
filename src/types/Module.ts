import { ModuleCommand } from './ModuleCommand';

export interface Module {
  name: string;
  commands: ModuleCommand[];
}