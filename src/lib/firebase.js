import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// replace these with your own config values from Firebase!
const config = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

export { firebase, FieldValue };
