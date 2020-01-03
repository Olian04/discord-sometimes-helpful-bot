import { getChannelConfig } from '@/config';
import { db } from '@/database';
import { deleteIfAble } from '@/util/command';
import { logger } from '@/util/logger';
import { Command, Event, parse, subscribe } from 'discord-commander';

export class PollCommand extends Command('poll') {
  @parse(/(.*?);/im) private title: string;
  @parse(/(.*?);/img) private voteAlternatives: string[];

  @subscribe('new', 'edit')
  public async onMessage(ctx: Event) {
    const conf = getChannelConfig(ctx.message.guild.id, ctx.channel.id);
    if (conf.allowCommand_poll === false) {
      logger.debug.dynamicMessage(`Event command prevented due to channel config`);
      ctx.message.author.send(`A message you wrote has been removed due to restrictions put on the channel.`);
      return;
    }

    if (this.voteAlternatives.length === 0) {
      logger.debug.command(`No vote alternatives provided`);
      this.sendHelpText(ctx);
      return;
    }

    if (this.voteAlternatives.length > 10) {
      logger.debug.command(`To many vote alternatives provided`);
      this.sendHelpText(ctx);
      return;
    }

    this.voteAlternatives = this.voteAlternatives.map((s) => s.trim());
    this.title = this.title.trim();

    db(ctx.message.guild.id).poll.createNewPoll({
      guildID: ctx.message.guild.id,
      channelID: ctx.channel.id,
      title: this.title,
      voteAlternatives: this.voteAlternatives,
    });

    await deleteIfAble(ctx.message); // delete command from chat log
    logger.log.command(`Created poll: "${this.title}"`);
  }

  private async sendHelpText(ctx: Event) {
    await ctx.author.send(`Error when creating poll.
The poll command requires an sequence of up to 10 semicolon separated strings as arguments.`);

    await deleteIfAble(ctx.message); // delete command from chat log
    logger.debug.command(`Sent help text to: ${ctx.author.username}`);
  }
}
