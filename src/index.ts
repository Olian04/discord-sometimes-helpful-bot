import { ActivityType, Client, PresenceStatus } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { args, discord_token } from './preStartConfig';

const client = new Client();

const commands = fs.readdirSync(path.join(__dirname, 'commands'))
  .filter((fileName) => fileName.endsWith('.js')) // excludes type files such as demo.d.ts
  .map((fileName) => require(path.join(__dirname, 'commands', fileName)));

client.on('ready', async ()  => {
  console.debug(`Client ready`);

  const statusMap: { [key: string]: PresenceStatus } = {
    production: 'online',
    development: 'dnd',
  };
  const nameMap = {
    production: 'Awaiting your command!',
    development: `Under development, please do not disturb.`,
  };
  await client.user.setPresence({
    status: statusMap[args.env],
    game: {
      name: nameMap[args.env],
    },
  });

  commands.forEach((command: { ID: string, callback: (client: Client) => void}) => {
    console.debug(`Registering command: ` + command.ID);
    command.callback(client);
  });

});

client.login(discord_token)
  .then(() => console.debug(`Login successful`))
  .catch((err) => {
    console.debug(`Login failed`);
    throw err;
  });
