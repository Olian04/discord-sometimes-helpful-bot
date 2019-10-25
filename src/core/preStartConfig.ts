import betterLogging from 'better-logging';
betterLogging(console, {
  format: (ctx) => `${ctx.date} ${ctx.time24} ${ctx.type} ${ctx.msg}`,
});

import path from 'path';

const args: {
  env?: 'production' | 'development';
  verbose?: boolean;
} = process.argv
  .filter((_, i) => i > 1) // the first 2 arguments are "node" and __filename
  .reduce((res, arg) => {
    const [key, val, ...shouldBeEmpty] = arg.split('=');
    if (shouldBeEmpty.length !== 0 && key !== undefined && val !== undefined) {
      throw new Error('Command line arguments must be in the form of "key=value" or "key"');
    }
    res[key] = val || true; // allows boolean arguments to be written without "=true".
    return res;
  }, {});

if (args.env === 'development' || args.verbose) {
  // enable debug output
  console.loglevel = 4;
}

// tslint:disable-next-line no-var-requires
const secrets = require(path.resolve(__dirname, '..', '..', 'secrets.json'));

const discord_token: string = secrets.discord_token;
const firebase_config: {
  project_id: string;
  [key: string]: string;
} = secrets.firebaseConfig;

export {
  args,
  discord_token,
  firebase_config,
};
