import chalk from 'chalk';

const tag = (msg: string, color = chalk.reset) =>
  chalk.gray(`[${color(msg)}]`);

const format = (log) => ({
    reaction: (msg: string) => log(`${tag('reaction', chalk.magentaBright)} ${msg}`),
    model: (msg: string) => log(`${tag('model', chalk.blueBright)} ${msg}`),
    command: (msg: string) => log(`${tag('command', chalk.yellowBright)} ${msg}`),
    dynamicMessage: (msg: string) => log(`${tag('dynamicMessage', chalk.greenBright)} ${msg}`),
    app: (msg: string) => log(`${tag('app', chalk.white)} ${msg}`),
});

export const logger = {
  log: format(console.log),
  info: format(console.info),
  warn: format(console.warn),
  error: format(console.error),
  debug: format(console.debug),
};

// TODO: Logs should be batch-store in the cloud.
