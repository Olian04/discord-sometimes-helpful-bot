# Bot

## Data flow

1. Receive user input
2. Process user input
3. Create appropriate jobs
4. Push jobs to job queue
5. Shift job from job queue
6. Process job
7. Repeat from step 5 if queue is not empty

### Ex: Create Event

1. User sends command in discord channel: `!event Some event`
2. Remove user message from channel
3. Create a "EventCreateJob"
4. Push job to queue (in database)
5. React to changes in database
6. Pop "EventCreateJob" from queue
7. Create event entry in DB
8. Send event message to channel
