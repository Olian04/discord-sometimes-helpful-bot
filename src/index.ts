import './setup';

import { Client } from 'discord.js';
import * as eventModule from './modules/event';
import * as configModule from './modules/config';

const app = new Client({
  /*
  Partials makes the client auto cache the ID of messages, channels, and reactions
  made before the bot started.
  This will also fire events for partials that haven't yet been processed by the bot.
  */
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

app.on('ready', ()  => {
  console.info(`Client ready`);

  // Set presence message
  app.user.setPresence({
    afk: false,
    activity: {
      type: 'LISTENING',
      name: `!event`,
      url: 'https://github.com/Olian04/discord-sometimes-helpful-bot',
    },
    status: 'online',
  }).catch(console.warn);
});

app.on('rateLimit', (data)  => {
  console.warn(`Rate limiting in effect`, data);
});

// Setting up modules
configModule.setup(app);
eventModule.setup(app);

// Login
app.login(process.env.DISCORD_SECRET)
  .then(() => console.info(`Login successful`))
  .catch((err) => console.error(`Login failed: ${err}`));
