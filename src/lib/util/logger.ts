const tag = (msg: string, color: string = console.color.RESET) =>
  `${console.color.STAMP_COLOR}[${color}`
  + msg
  + `${console.color.STAMP_COLOR}]${console.color.RESET}`;

const format = (log) => ({
    reaction: (msg: string) => log(`${tag('reaction', console.color.Light_Purple)} ${msg}`),
    model: (msg: string) => log(`${tag('model', console.color.Light_Blue)} ${msg}`),
    command: (msg: string) => log(`${tag('command', console.color.Yellow)} ${msg}`),
    dynamicMessage: (msg: string) => log(`${tag('dynamicMessage', console.color.Light_Green)} ${msg}`),
    app: (msg: string) => log(`${tag('app', console.color.White)} ${msg}`),
});

export const logger = {
  log: format(console.log),
  info: format(console.info),
  warn: format(console.warn),
  error: format(console.error),
  debug: format(console.debug),
};

// TODO: Logs should be batch-store in the cloud.
