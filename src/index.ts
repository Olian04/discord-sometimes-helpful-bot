import { Client, Message, PresenceStatus } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { args, discord_token } from './preStartConfig';
import { isCommand } from './util/commandUtils';

const client = new Client();

const commands = fs.readdirSync(path.join(__dirname, 'commands'))
  .filter((fileName) => fileName.endsWith('.js')) // excludes type files such as demo.d.ts
  .map((fileName) => require(path.join(__dirname, 'commands', fileName)));

client.on('ready', async ()  => {
  console.info(`Client ready`);

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

  commands.forEach((command: { ID: string, commands: string[], callback: (client: Client) => void}) => {
    console.info(`Registering command: ` + command.ID);
    try {
      command.callback(client);
    } catch (err) {
      console.error(`Error thrown with origin in command: ${command.ID}`);
      console.error(err);
    }
  });

  client.on('message', async (message: Message) => {
    if (! isCommand(message.content)) { return; }

    const { Dark_Gray, Light_Green, RESET} = console.color;

    // Log incoming command
    console.log(
      (message.channel.type === 'dm' ? `${Dark_Gray}[${Light_Green}dm${Dark_Gray}]${RESET}` : '') +
      `${Dark_Gray}[${RESET}${message.author.username}${Dark_Gray}]${RESET} ${message.content}`,
    );
  });
});

client.login(discord_token)
  .then(() => console.info(`Login successful`))
  .catch((err) => {
    console.error(`Login failed`);
    throw err;
  });
