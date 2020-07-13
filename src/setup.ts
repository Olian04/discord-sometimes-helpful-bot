import dotenv from 'dotenv';
dotenv.config();
import betterLogging from 'better-logging';
betterLogging(console, {
  format: (ctx) => `${ctx.date} ${ctx.time24} ${ctx.type} ${ctx.msg}`,
});

// Enable debug logging if in development mode
console.logLevel = process.env.DEPLOY_ENVIRONMENT === 'development' ? 4 : 3;