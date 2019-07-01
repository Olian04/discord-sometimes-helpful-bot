import { Client } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { args, secrets } from './preStartConfig';

const client = new Client();

const commands = fs.readdirSync(path.join(__dirname, 'commands'))
  .filter((fileName) => fileName.endsWith('.js')) // excludes type files such as demo.d.ts
  .map((fileName) => require(path.join(__dirname, 'commands', fileName)).default);

client.on('ready', ()  => {
  console.debug(`Client ready!`);
  commands.forEach((command: { ID: string, callback: (client: Client) => void}) => {
    console.debug(`Registering command: ` + command.ID);
    command.callback(client);
  });
});

client.login(secrets.discord_token)
  .then((resp) => console.debug(`Login: ` + resp));
