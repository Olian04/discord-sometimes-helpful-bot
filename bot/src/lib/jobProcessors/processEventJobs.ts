import { db, jobs } from '@/database';
import { ICreateEventJob, IDeleteEventJob, JobOfSubject } from '@/interfaces/job.interface';
import { client } from '../app';
import { TextChannel } from 'discord.js';
import { deleteIfAble } from '@/util/deleteIfAble';

const processCreation = async (job: ICreateEventJob) => {
  jobs.delete(job.jobID);
  const eventID = db(job.guildID).event.createNewEvent({
    guildID: job.guildID,
    channelID: job.channelID,
    title: job.title,
  });
  const channel = client
    .guilds.cache.get(job.guildID)
    .channels.cache.get(job.channelID) as TextChannel;

  const msg = await channel.send('Dummy message');
  await db(job.guildID).event.update(eventID, {
    messageID: msg.id,
    status: 'active',
  });
};

const processDeletion = async (job: IDeleteEventJob) => {
  jobs.delete(job.jobID);
  const event = await db(job.guildID).event.getEvent(job.messageID);
  const channel = (await client.channels.cache.get(event.data.channelID).fetch()) as TextChannel;
  const message = channel.messages.cache.get(event.data.messageID);
  db(job.guildID).event.update(event.id, {
    messageID: null,
    status: 'archived',
  });
  deleteIfAble(message);
};

export const processEventJob = async (job: JobOfSubject<'event'>) => {
  switch (job.operation) {
    case 'create':
      return processCreation(job);
    case 'delete':
      return processDeletion(job);
    default:
      // Hack to get exhaustive pattern matching in the switch statement
      const _exhaustiveCheck: never = job;
      throw new Error(`Unexpected job operation for job: ${_exhaustiveCheck}`);
  }
};
