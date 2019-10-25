import { Client } from 'discord.js';
import { onError } from './on/error';
import { onMessage } from './on/message';
import { onReady } from './on/ready';
import { discord_token } from './preStartConfig';

export const start = () => new Promise((resole, reject) => {
  const client = new Client();

  client.on('error', onError);
  client.on('message', onMessage);
  client.on('ready', () => onReady(client));

  client.login(discord_token)
    .then(() => console.info(`Login successful`))
    .catch((err) => {
      console.error(`Login failed`);
      throw err;
    });

  client.on('disconnect', reject);
  client.on('disconnect', client.destroy);
});
