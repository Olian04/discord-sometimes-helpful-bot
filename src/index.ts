import { Commander } from 'discord-commander';
import { Client, Message, PresenceStatus } from 'discord.js';
import { EventCommand, eventOnReady } from './commands/event';
import { LargeEmoteCommand } from './commands/large-emotes';
import { args, discord_token } from './preStartConfig';
import { commandToken, isCommand } from './util/command';

const client = new Client();

const onReadyCallbacks = [
  eventOnReady,
];

const commander = new Commander(commandToken, [
  EventCommand,
  LargeEmoteCommand,
]);
commander.deleteUnknownCommands = false;

client.on('error', console.error);
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

  client.on('message', async (message: Message) => {
    if (! isCommand(message.content)) { return; }

    const { Dark_Gray, Light_Green, RESET} = console.color;

    // Log incoming command
    console.log(
      (message.channel.type === 'dm' ? `${Dark_Gray}[${Light_Green}dm${Dark_Gray}]${RESET}` : '') +
      `${Dark_Gray}[${RESET}${message.author.username}${Dark_Gray}]${RESET} ${message.content}`,
    );
  });

  onReadyCallbacks.forEach((cb) => cb(client));
});

// discord-commander will start listening for messages
commander.start(client);

client.login(discord_token)
  .then(() => console.info(`Login successful`))
  .catch((err) => {
    console.error(`Login failed`);
    throw err;
  });
