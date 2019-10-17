import { Config } from './_commands/config/Config';

const tag = (msg: string, color: string = console.color.RESET) =>
  `${console.color.Dark_Gray}[${color}`
  + msg
  + `${console.color.Dark_Gray}]${console.color.RESET}`;

export const log = (conf: Config, msg: string)  => console.log(
  `${tag(conf.guild.name, console.color.Dark_Gray)} ${msg}`,
);
