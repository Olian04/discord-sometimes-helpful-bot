import './setup';

import { Client } from 'discord.js';
import * as eventModule from './modules/event';
import * as configModule from './modules/config';
import * as pollModule from './modules/poll';

const app = new Client({
  /*
  Partials makes the client auto cache the ID of messages, channels, reactions, users, and guild_members.
  This will fire events for partials that haven't yet been processed by the bot.
  This will also ensure that messages sent before the bot started are taken into account when reacting to message_reactions.
  */
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
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
pollModule.setup(app);

// Login
app.login(process.env.DISCORD_SECRET)
  .then(() => console.info(`Login successful`))
  .catch((err) => console.error(`Login failed: ${err}`));
