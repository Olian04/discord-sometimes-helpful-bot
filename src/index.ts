import './setup';
import { Client, version } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';


import * as eventModule from './modules/event';


console.debug(`Architecture ${process.arch}`);
console.debug(`Node.js ${process.version}`);
console.debug(`V8 ${process.versions.v8}`);
console.debug(`Discord.js ${version}`);

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_SECRET);

const app = new Client({
  intents: [
    'GUILDS',
    'GUILD_INTEGRATIONS',
    'GUILD_MESSAGES',
    'GUILD_MEMBERS',
    'GUILD_MESSAGE_REACTIONS',
  ],
  /*
  Partials makes the client auto cache the ID of messages, channels, reactions, users, and guild_members.
  This will fire events for partials that haven't yet been processed by the bot.
  This will also ensure that messages sent before the bot started are taken into account when reacting to message_reactions.
  */
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
});


app.on('ready', async ()  => {
  console.info(`Client ready`);
  eventModule.initialize(app);

  await rest.put(Routes.applicationCommands(app.application.id), {
    body: [
      eventModule.eventCommand.toJSON(),
    ],
  });

  console.debug(`Startup time ${process.uptime().toFixed(2)} seconds`);
});

app.on('rateLimit', (data)  => {
  console.warn(`Rate limiting in effect`, data);
});

// Login
app.login(process.env.DISCORD_SECRET)
  .then(() => console.info(`Login successful`))
  .catch((err) => console.error(`Login failed: ${err}`));
