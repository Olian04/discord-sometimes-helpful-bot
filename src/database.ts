import * as firebase from 'firebase-admin';

const DBVersion = process.env.DATABASE_VERSION;
const environment = process.env.DEPLOY_ENVIRONMENT;
const firebaseConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

export const firebaseAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  databaseURL: `https://${firebaseConfig.project_id}.firebaseio.com`,
});

const getRootRef = () => firebaseAdmin.database().ref(`${DBVersion}/${environment}/`);

export const db = getRootRef();

export const getSnap = async (path: string) => db.child(path).once('value');

export const exists = async (path: string) => {
  const snap = await getSnap(path)
    .catch(console.error);
  return snap && snap.exists();
}

// Log db connection
db.once('value', (snap) => {
  console.info(`Database connected ${snap.ref.parent.key}/${snap.key}`);
});