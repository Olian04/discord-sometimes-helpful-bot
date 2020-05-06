interface IJobBase<Subject, Operation> {
  jobID: string; // Used to make sure each job is unique
  subject: Subject;
  operation: Operation;
}

export interface ICreateEventJob extends IJobBase<'event', 'create'> {
  guildID: string;
  channelID: string;
  title: string;
}

export interface IDeleteEventJob extends IJobBase<'event', 'delete'> {
  guildID: string;
  channelID: string;
  messageID: string;
}

export interface IDummyJob extends IJobBase<'dummy', 'nothing'> {}

// -------------------------------------------------------------------------------------

type EventJob = ICreateEventJob | IDeleteEventJob;

export type Job = EventJob | IDummyJob;

export type JobOfSubject<Subject extends Subjects> =
  Subject extends 'event' ? EventJob :
  Subject extends 'dummy' ? IDummyJob :
  never;

export type Subjects = Job['subject'];
export type Operations<Subject extends Subjects> =
  Subject extends 'event' ? EventJob['operation'] :
  never;
