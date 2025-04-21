import firebaseConfig from "./firebaseConfig.js"
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"

const auth = getAuth(firebaseConfig.app)

document.addEventListener('DOMContentLoaded', () => {

    const element = document.getElementById('username');
    const logoutBtn = document.getElementById('logoutButton');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in:", user);
            element.innerHTML = `<h2 style="padding-left:6em">Logged in: ${user.email}</h2>`;
        } else {
            console.log("No user is logged in");
            window.location.href = "./login.html";
        }
    });
});

export function logoutUser() {
    signOut(auth).then(() => {
        console.log("User signed out");
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Logout error:", error);
        alert("Error signing out: " + error.message);
    });
}