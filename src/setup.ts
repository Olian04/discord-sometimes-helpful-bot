import dotenv from 'dotenv';
import betterLogging from 'better-logging';

// Populating environment variables
const err = dotenv.config().error;

// Setting up logging library
betterLogging(console, {
  format: (ctx) => [
    ctx.STAMP(process.env.DATABASE_VERSION),
    ctx.STAMP(process.env.DEPLOY_ENVIRONMENT),
    ctx.date,
    ctx.time24,
    ctx.type,
    ' ',
    ctx.msg
  ].join(''),
});

if (err) console.warn(`An error occurred when configuring environment variables: ${err}`);
else console.info(`Environment variables configured`);

// Enable debug logging if in development mode
console.logLevel = 4; /* process.env.DEPLOY_ENVIRONMENT === 'development' ? 4 : 3;
Commented out debug toggle as a test, to see how much of an issue having them print in production turns out to be.
*/

process.on('uncaughtExceptionMonitor', console.error);
process.on('beforeExit', (exitCode) => console.info(`Process exiting with exit code: ${exitCode}`));
