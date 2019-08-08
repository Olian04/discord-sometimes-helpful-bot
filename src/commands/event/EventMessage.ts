import { DynamicMessage, OnReaction } from 'discord-dynamic-messages';
import { User } from 'discord.js';
import { addParticipant, updateAttendance } from '../../database';
import { IParticipant } from './consts';
import { editHandler } from './editHandler';
import { constructEventMessage } from './messageConstructor';

export class EventMessage extends DynamicMessage {
  constructor(private title: string, private participants: IParticipant[]) {
    super();
  }

  @OnReaction(':thumbsup:')
  public attendYes(user: User) {
    this.updateAttendance(user, 'yes');
  }

  @OnReaction(':thumbsdown:')
  public attendNo(user: User) {
    this.updateAttendance(user, 'no');
  }

  @OnReaction(':grey_question:')
  public attendMaybe(user: User) {
    this.updateAttendance(user, 'maybe');
  }

  @OnReaction(':wrench:', {
    hidden: true,
  })
  public initiateEdit(user: User, channel, reaction) {
    editHandler({
      eventMessage: this.message,
      participants: this.participants,
      title: this.title,
      reaction,
    }, (newTitle) => {
      this.title = newTitle;
      this.reRender();
    });
  }

  public render() {
    return constructEventMessage(this.title, this.participants);
  }

  private updateAttendance(user: User, attendance: 'yes' | 'no' | 'maybe') {
    const participant = this.participants.find((par) => par.name === user.username);
    if (participant) {
      participant.attend = attendance;
      participant.timestamp = Date.now();
      updateAttendance({
        newAttendance: attendance,
        event_id: this.message.id,
        username: user.username,
      });
    } else {
      this.participants.push({
        attend: attendance,
        name: user.username,
        timestamp: Date.now(),
      });
      addParticipant({
        event_id: this.message.id,
        username: user.username,
        attendance,
      });
    }
  }
}
