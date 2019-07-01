import { Client } from 'discord.js';

export const ID = 'ping';
export const callback = (client: Client) => {
  client.on('message', (message) => {
    // If the message is "ping"
    if (message.content === 'ping') {
      // Send "pong" to the same channel
      message.channel.send('pong');
    }
  });
};
