import { config, getChannelConfig } from '@/config';
import { deleteIfAble } from '@/util/command';
import { logger } from '@/util/logger';
import { Command, Event, parse, subscribe } from 'discord-commander';
import * as fs from 'fs';
import * as path from 'path';

const emotesRoot = path.join(config.assetsRoot, 'emotes');
const emoteNames = fs.readdirSync(emotesRoot)
  .filter((fileName) => fileName.endsWith('.png'))
  .map((fileName) => fileName.substr(0, fileName.length - '.png'.length));

export class LargeEmoteCommand extends Command('emote') {
  @parse.remaining private requestedEmote: string;

  @subscribe('new', 'edit')
  public async onMessage(ctx: Event) {
    const conf = getChannelConfig(ctx.message.guild.id, ctx.channel.id);
    if (conf.allowCommand_emote === false) {
      logger.debug.dynamicMessage(`Event command prevented due to channel config`);
      ctx.message.author.send(`A message you wrote has been removed due to restrictions put on the channel.`);
      return;
    }

    this.requestedEmote = this.requestedEmote.trim();

    if (this.requestedEmote.length === 0) {
      logger.debug.command(`No emote name provided`);
      this.sendHelpText(ctx);
      return;
    }

    if (this.requestedEmote.match(/^:.+:$/i)) {
      // Unresolved emotes looks like this :some_name:
      this.requestedEmote = this.requestedEmote.substring(1, this.requestedEmote.length - 1);
    } else if (this.requestedEmote.match(/^<:.+:\d+>$/i)) {
      // Resolved emotes looks like this <:emote_name:some_numerical_id>
      this.requestedEmote = this.requestedEmote.substring(2, this.requestedEmote.lastIndexOf(':'));
    }

    if (! emoteNames.some((name) => name === this.requestedEmote)) {
      logger.log.command(`Failed to locate emote: ${this.requestedEmote}`);
      this.sendHelpText(ctx);
      return;
    }

    await ctx.channel.send(`${ctx.author}`, {
      files: [
        path.join(emotesRoot, `${this.requestedEmote}.png`),
      ],
    });

    await deleteIfAble(ctx.message); // delete command from chat log
    logger.log.command(`Sent emote: ${this.requestedEmote}`);
  }

  private async sendHelpText(ctx: Event) {
    await ctx.author.send(`Attempted to display unknown emote "${this.requestedEmote}"
    Available emotes are: ${emoteNames.join(', ')}`);

    await deleteIfAble(ctx.message); // delete command from chat log
    logger.debug.command(`Sent help text to: ${ctx.author.username}`);
  }
}
