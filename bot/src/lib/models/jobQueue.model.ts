import { Reference } from '@/database';
import { Job } from '@/interfaces/job.interface';
import { Bucket } from '@olian/typescript-helpers';
import { v4 as uuid4 } from 'uuid';

export const jobQueueModelFactory = (guildRef: Reference) => ({
  create: <J extends Job>(job: Omit<J, 'jobID'>) => {
    const jobID = uuid4();
    const newJob = {
      ...job,
      jobID,
    } as Job;

    guildRef
      .child('jobs')
      .child(jobID)
      .set(newJob);

    return jobID;
  },

  delete: (jobID: string) => {
    return new Promise((resolve, reject) => {
      guildRef
        .child('jobs')
        .child(jobID)
        .remove((err) =>
          err ? reject(err) : resolve(),
        );
    });
  },

  async *queue() {
    const bucket = new Bucket<Job>();

    guildRef.child('jobs').on('child_added', (snap) => {
      const job: Job = snap.val();
      bucket.push(job);
    });

    yield *bucket;
  },
});
