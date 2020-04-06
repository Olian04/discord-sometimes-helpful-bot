export type Attendance =  'yes' | 'no' | 'maybe';

export interface IEventParticipant {
  userID: string;
  nickname: string;
  attendance: Attendance;
  timestamp: number;
}
