import { config, getChannelConfig } from '@/config';
import { db } from '@/database';
import { deleteIfAble } from '@/util/command';
import { logger } from '@/util/logger';
import { Command, Event, parse, subscribe } from 'discord-commander';

export class EventCommand extends Command('event') {
  @parse.remaining private title: string;

  @subscribe('new', 'edit')
  public async onMessage(ctx: Event) {
    const conf = getChannelConfig(ctx.message.guild.id, ctx.channel.id);
    if (conf.allowCommand_event === false) {
      logger.debug.dynamicMessage(`Event command prevented due to channel config`);
      ctx.message.author.send(`A message you wrote has been removed due to restrictions put on the channel.`);
      return;
    }
    this.title = this.title.trim();
    if (! this.validateTitle(ctx)) { return; }
    this.createDynamicMessage(ctx);
  }

  public createDynamicMessage(ctx: Event) {
    const eventID = db(ctx.message.guild.id).event.createNewEvent({
      guildID: ctx.message.guild.id,
      channelID: ctx.channel.id,
      title: this.title,
    });
    db(ctx.message.guild.id).event.updateAttendance(eventID, {
      userID: ctx.author.id,
      nickname: ctx.message.member.displayName,
      attendance: 'yes',
    });
    deleteIfAble(ctx.message);
    logger.debug.command(`Submitted event creation for event: ${eventID}`);
  }

  private validateTitle(ctx: Event) {
    if (this.title.length === 0) {
      ctx.author.send(
`Failed to create an event. Event title was missing.
\`\`\`
You wrote: ${ctx.message.content}
It should be: ${config.commander.prefix}event [Title]
\`\`\``);
      deleteIfAble(ctx.message); // delete command from chat log
      return false;
    }
    return true;
  }
}
