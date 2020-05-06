import { jobs } from './database';
import { processEventJob } from './jobProcessors/processEventJobs';

(async () => {
  for await (const job of jobs.queue()) {
    switch (job.subject) {
      case 'event':
        await processEventJob(job);
        break;
      case 'dummy':
        console.debug(`Dummy job processed: ${job}`);
        break;
      default:
        // Hack to get exhaustive pattern matching in the switch statement
        const _exhaustiveCheck: never = job;
        throw new Error(`Unexpected job operation for job: ${_exhaustiveCheck}`);
    }
  }
})();
