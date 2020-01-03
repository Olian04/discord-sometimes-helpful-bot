export interface IPollParticipant {
  userID: string;
  nickname: string;
  votes: {
    [option: number]: boolean;
  };
  timestamp: number;
}
