import dotenv from 'dotenv';
import betterLogging from 'better-logging';

// Populating environment variables
const err = dotenv.config().error;

// Setting up logging library
betterLogging(console, {
  format: (ctx) => `${ctx.date} ${ctx.time24} ${ctx.type} ${ctx.msg}`,
});

if (err) console.error(`An error occurred when configuring environment variables: ${err}`);
else console.info(`Environment variables configured`);

// Enable debug logging if in development mode
console.logLevel = process.env.DEPLOY_ENVIRONMENT === 'development' ? 4 : 3;