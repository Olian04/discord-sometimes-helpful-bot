import { firebase } from './setup';
import { firebaseConfig } from './config';

// Initialize Firebase
export const app =  firebase.initializeApp(firebaseConfig);
