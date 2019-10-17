import { Command, Event, parse, subscribe } from 'discord-commander';
import { addEvent } from '../../database';
import { EventMessage } from './EventMessage';

export class EventCommand extends Command('event') {
  @parse.remaining private title: string;

  @subscribe('new', 'edit')
  public async onMessage(ctx: Event) {
    this.title = this.title.trim();
    if (! this.validateTitle(ctx)) { return; }
    this.createDynamicMessage(ctx);
  }

  private async createDynamicMessage(ctx: Event) {
    const DynamicEventMessage = await (new EventMessage(this.title, []).sendTo(ctx.channel));
    addEvent(ctx.message.guild.id, {
      title: this.title,
      message_id: DynamicEventMessage.message.id,
      channel_id: DynamicEventMessage.message.channel.id,
    });
    ctx.message.delete(); // delete command from chat log
  }

  private validateTitle(ctx: Event) {
    if (this.title.length === 0) {
      ctx.author.send(
        'Failed to create an event. Event title was missing.\n' +
        '```\nYou wrote: ' + ctx.message.content + '\nIt should be: !event [Title]\n```',
      );
      ctx.message.delete(); // delete command from chat log
      return false;
    }
    return true;
  }
}
