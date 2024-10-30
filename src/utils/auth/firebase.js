import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
// import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
    apiKey: "AIzaSyDFr67Pkq6Rj7thNbPNLpEQNrLkg747DLI",
    authDomain: "prjt-7dd79.firebaseapp.com",
    databaseURL: "https://prjt-7dd79-default-rtdb.firebaseio.com",
    projectId: "prjt-7dd79",
    storageBucket: "prjt-7dd79.appspot.com",
    messagingSenderId: "461443442865",
    appId: "1:461443442865:web:657360ea851486b5731a90",
    measurementId: "G-T5J3YKS1DH"
  };


const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const imageDb = getStorage(app)

export { auth, imageDb }
export default app