import { legacyEditHandler } from '@/../legacy/event.editHandler';
import { db } from '@/database';
import { IEvent } from '@/interfaces/event.interface';
import { Attendance } from '@/interfaces/participant.interface';
import { constructEventMessage } from '@/messages/event.helpers/messageConstructor';
import { logger } from '@/util/logger';
import { DynamicMessage, OnReaction } from 'discord-dynamic-messages';
import { Guild, Message, MessageReaction, TextChannel, User } from 'discord.js';

export class EventMessage extends DynamicMessage {
  constructor(private eventData: IEvent) {
    super({
      volatile: false,
      onError: (err) => {
        logger.debug.dynamicMessage(String(err));
      },
    });
    db(this.eventData.guildID).event.onEventChange(this.eventData.id, (newEventData) => {
      if (newEventData === undefined) {
        logger.warn.dynamicMessage(`Unexpected "undefined" eventData in EventMessage`);
        return;
      }
      this.eventData = newEventData;
      if (this.message) {
        this.reRender();
      }
    });
    logger.debug.dynamicMessage(`Constructed EventMessage for event: ${eventData.id}`);
  }

  @OnReaction(':thumbsup:', { triggerRender: false })
  public attendYes(user: User, channel: TextChannel) {
    this.updateAttendance(user, channel.guild, 'yes');
  }

  @OnReaction(':thumbsdown:', { triggerRender: false })
  public attendNo(user: User, channel: TextChannel) {
    this.updateAttendance(user, channel.guild, 'no');
  }

  @OnReaction(':grey_question:', { triggerRender: false })
  public attendMaybe(user: User, channel: TextChannel) {
    this.updateAttendance(user, channel.guild, 'maybe');
  }

  @OnReaction(':wrench:', { triggerRender: false, hidden: true })
  public initiateEditSequence(user: User, channel: TextChannel, reaction: MessageReaction) {
    legacyEditHandler({
      eventMessage: this.message,
      participants: this.eventData.participants,
      reaction,
      title: this.eventData.title,
    });
  }

  public render() {
    logger.debug.dynamicMessage(`Rendered EventMessage for event: ${this.eventData.id}`);
    return constructEventMessage(this.eventData.title, this.eventData.participants);
  }

  private updateAttendance(user: User, guild: Guild, newAttendance: Attendance) {
    logger.debug.dynamicMessage(
      `Updated attendance for event: ${this.eventData.id} (${user.username}:${newAttendance})`,
    );
    db(this.eventData.guildID).event.updateAttendance(this.eventData.id, {
      userID: user.id,
      nickname: guild.member(user).displayName,
      attendance: newAttendance,
    });
  }
}
