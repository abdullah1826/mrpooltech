import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase, set, ref, update, push, onValue, } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCAe5KyAVXQBH_gJavj_Wj29jZ9pxXnlm8",
  authDomain: "beginer-135fc.firebaseapp.com",
  databaseURL: "https://beginer-135fc-default-rtdb.firebaseio.com",
  projectId: "beginer-135fc",
  storageBucket: "beginer-135fc.appspot.com",
  messagingSenderId: "1016541836188",
  appId: "1:1016541836188:web:157cffe98ee80ab8394e59"
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
// export const db=getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app);
