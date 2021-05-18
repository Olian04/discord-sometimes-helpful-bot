import './setup';
import { Client } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { Module } from './types/Module';
import { registerModule } from './util/registerModule';

const app = new Client({
  intents: [
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

// Setting up modules
(async () => {
  const moduleRootPath = path.join(__dirname, 'modules');

  const modules = (await Promise.all(
    fs.readdirSync(moduleRootPath).map(dirName =>
      import(path.join(moduleRootPath, dirName))
    ),
  )).map(rawImport => rawImport.default as Module);

  modules.forEach(module => {
    registerModule(app, module);
  });
})();

app.on('ready', async ()  => {
  console.info(`Client ready`);
});

app.on('rateLimit', (data)  => {
  console.warn(`Rate limiting in effect`, data);
});

// Login
app.login(process.env.DISCORD_SECRET)
  .then(() => console.info(`Login successful`))
  .catch((err) => console.error(`Login failed: ${err}`));
