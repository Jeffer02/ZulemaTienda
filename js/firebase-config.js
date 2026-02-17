import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getDatabase,
    ref,
    onValue,
    push,
    set,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5xRRQ7bpBE2NopZfhmicwXvCO8ip6Sx8",
  authDomain: "zulema-juego.firebaseapp.com",
  projectId: "zulema-juego",
  storageBucket: "zulema-juego.firebasestorage.app",
  messagingSenderId: "981305452424",
  appId: "1:981305452424:web:c0a5381e2f073ca6597c3d",
  databaseURL: "https://zulema-juego-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, push, set, remove, update };
