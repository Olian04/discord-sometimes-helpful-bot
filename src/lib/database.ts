// import { IConfig } from '@/config/interfaces/config';
import { eventModelFactory } from '@/models/event.model';
import { firebase_config } from '@/preStartConfig';
import * as firebase from 'firebase-admin';
import { configModelFactory } from './models/config.model';

export type Reference = firebase.database.Reference;

const app = firebase.initializeApp({
  credential: firebase.credential.cert(firebase_config as firebase.ServiceAccount),
  databaseURL: `https://${firebase_config.project_id}.firebaseio.com`,
});

export const db = (guildID: string) => {
  const guildDB = app.database().ref(`guilds/${guildID}`);
  return ({
    event: eventModelFactory(guildDB),
    config: configModelFactory(guildDB),
  });
};
