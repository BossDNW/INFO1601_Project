import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5wWvr1qsGE8kmURgYrfSLxRert3f3g8s",
  authDomain: "wheelbethere-a5fa2.firebaseapp.com",
  projectId: "wheelbethere-a5fa2",
  storageBucket: "wheelbethere-a5fa2.firebasestorage.app",
  messagingSenderId: "281840293560",
  appId: "1:281840293560:web:252156135dc9298054464d"
};

const app = initializeApp(firebaseConfig);

export default {firebaseConfig,app};