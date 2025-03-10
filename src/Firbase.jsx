import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase, set, ref, update, push, onValue, } from 'firebase/database';

// beginer
// const firebaseConfig = {
//   apiKey: "AIzaSyCAe5KyAVXQBH_gJavj_Wj29jZ9pxXnlm8",
//   authDomain: "beginer-135fc.firebaseapp.com",
//   databaseURL: "https://beginer-135fc-default-rtdb.firebaseio.com",
//   projectId: "beginer-135fc",
//   storageBucket: "beginer-135fc.appspot.com",
//   messagingSenderId: "1016541836188",
//   appId: "1:1016541836188:web:157cffe98ee80ab8394e59"

// };


// Misam pooltech-test

// const firebaseConfig = {
//   apiKey: "AIzaSyDxt6QU3tCZqgoqkusVT4Xac3uywspp--g",
//   authDomain: "pooltech-4c18f.firebaseapp.com",
//   projectId: "pooltech-4c18f",
//   storageBucket: "pooltech-4c18f.firebasestorage.app",
//   messagingSenderId: "499379735809",
//   appId: "1:499379735809:web:e0a1726166b7e681fa5f00",
//   measurementId: "G-R8PLHFY5SL"
// };



// mrpooltech-avicenna

const firebaseConfig = {
  apiKey: "AIzaSyCzGyB57d3onLEi034RSnqzB0tqoEwyZo0",
  authDomain: "mrpooltech-avicenna.firebaseapp.com",
  databaseURL: "https://mrpooltech-avicenna-default-rtdb.firebaseio.com",
  projectId: "mrpooltech-avicenna",
  storageBucket: "mrpooltech-avicenna.firebasestorage.app",
  messagingSenderId: "740249331898",
  appId: "1:740249331898:web:5861142c72f2f898dbba83",
  measurementId: "G-L0PP24WSDL"
};









const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
// export const db=getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app);
