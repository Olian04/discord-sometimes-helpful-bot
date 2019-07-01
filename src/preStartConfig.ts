import betterLogging from 'better-logging';
betterLogging(console);

import path from 'path';

const args: {
  env?: 'production' | 'development';
} = process.argv
  .filter((_, i) => i > 1) // the first 2 arguments are "node" and __filename
  .reduce((res, arg) => {
    const [key, val, ...shouldBeEmpty] = arg.split('=');
    if (shouldBeEmpty.length !== 0) {
      throw new Error('Command line arguments must be in the form of "key=value" or "key"');
    }
    res[key] = val || true; // allows boolean arguments to be written without "=true".
    return res;
  }, {});

if (args.env === 'development') {
  // enable debug output
  console.loglevel = 4;
}

console.log(process.env.BOT_TOKEN);

// tslint:disable-next-line no-var-requires
const secrets = process.env.BOT_TOKEN || require(path.resolve(__dirname, '..', 'secrets.json'));

export {
  args,
  secrets,
};
