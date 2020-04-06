// import { IConfig } from '@/config/interfaces/config';
import { eventModelFactory } from '@/models/event.model';
import { args, firebase_config } from '@/preStartConfig';
import * as firebase from 'firebase-admin';
import { configModelFactory } from './models/config.model';
import { pollModelFactory } from './models/poll.model';

export type Reference = firebase.database.Reference;

export const app = firebase.initializeApp({
  credential: firebase.credential.cert(firebase_config as firebase.ServiceAccount),
  databaseURL: `https://${firebase_config.project_id}.firebaseio.com`,
});

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
