import * as firebase from 'firebase-admin';

const DBVersion = process.env.DATABASE_VERSION;
const environment = process.env.DEPLOY_ENVIRONMENT;
const firebaseConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

export const _database = firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  databaseURL: `https://${firebaseConfig.project_id}.firebaseio.com`,
});

const getRootRef = () => _database.database().ref(`${DBVersion}/${environment}/`);

export const db = getRootRef();

export const getSnap = async (path: string) => (await db.child(path).once('value'));
