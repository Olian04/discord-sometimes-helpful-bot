import { eventModelFactory } from '@/models/event.model';
import { jobQueueModelFactory } from '@/models/jobQueue.model';
import { args, firebase_config } from '@/preStartConfig';
import * as firebase from 'firebase-admin';
/*
import { configModelFactory } from './models/config.model';
import { pollModelFactory } from './models/poll.model';
*/

const DBVersion = 'v3';
export type Reference = firebase.database.Reference;

export const _database = firebase.initializeApp({
  credential: firebase.credential.cert(firebase_config as firebase.ServiceAccount),
  databaseURL: `https://${firebase_config.project_id}.firebaseio.com`,
});

const getRootRef = (append: string = '') =>
  args.env === 'development' ?
    _database.database().ref(`${DBVersion}/development/${append}`)
    : _database.database().ref(`${DBVersion}/guilds/${append}`);

export const db = (guildID: string) => {
  const guildDB =  getRootRef(`guilds/${guildID}`);
  return ({
    event: eventModelFactory(guildDB),
  });
};

export const jobs =  jobQueueModelFactory(getRootRef());

/*
export const db = (guildID: string) => {
  const guildDB = args.env === 'development' ?
    app.database().ref(`development/guilds/${guildID}`)
    : app.database().ref(`guilds/${guildID}`);
  return ({
    poll: pollModelFactory(guildDB),
    event: eventModelFactory(guildDB),
    config: configModelFactory(guildDB),
  });
};
*/
