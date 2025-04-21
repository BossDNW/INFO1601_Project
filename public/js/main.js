import firebaseConfig from "./firebaseConfig.js"
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"

const auth = getAuth(firebaseConfig.app)

document.addEventListener('DOMContentLoaded', () => {
    // Your HTML modification code here
    const element = document.getElementById('username');
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in:", user);
            element.innerHTML = `<h2 style="padding-left:6em">Logged in: ${user.email}</h2>`;
        } else {
            console.log("No user is logged in");
            // Optionally redirect to login page
            window.location.href = "./login.html";
        }
    });
});