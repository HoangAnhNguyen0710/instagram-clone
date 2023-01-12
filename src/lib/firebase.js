import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// import { seedDatabase } from '../seed';

const firebaseConfig = {
  apiKey: 'AIzaSyBH3og0gIFD7XbOhqGUbXVLf7goz-0xZzA',
  authDomain: 'instagram-clone-5c3a9.firebaseapp.com',
  projectId: 'instagram-clone-5c3a9',
  storageBucket: 'instagram-clone-5c3a9.appspot.com',
  messagingSenderId: '763014804707',
  appId: '1:763014804707:web:2a44854a46a865641441d6',
  measurementId: 'G-R7391RR2G2'
};

const firebase = Firebase.initializeApp(firebaseConfig);
const { FieldValue } = Firebase.firestore;

// seedDatabase(firebase);

export { firebase, FieldValue };
