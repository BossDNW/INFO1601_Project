import firebaseConfig from "./firebaseConfig.js"
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"

const auth = getAuth(firebaseConfig.app)
let index = 0;

const imageUrls = [
    "https://i.postimg.cc/G2QG86RT/143606-Kirby-Singh.jpg",
    "https://i.postimg.cc/cCk3TYrs/292428538-470079211788251-7208465667222281520-n.webp",
    "https://i.postimg.cc/yY59ZFMj/automotoxpo-2024-3.jpg",
    "https://i.postimg.cc/26zBDTWk/image20170720053223.jpg",
    "https://i.postimg.cc/fyyt3L51/maxresdefault.jpg"
  ];

document.addEventListener('DOMContentLoaded', () => {
    blogs();
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
            element.innerHTML = `<h2 style="padding-left:6em">Logged in: ${user.email.split('@')[0]}</h2>`;
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

export function imgHandler(){
    index += 1;
    if (index>=imageUrls.length){
        index = 0;
    }
    let html = "";
    html += `
        <h1 style="display:flex;margin-left:auto;margin-top:auto;margin-bottom:auto;">Featured Photos</h1>
        <div class="card" style="margin: auto;">
            <div class="card-content">
                <img src="${imageUrls[index]}">
            </div>
        </div>
    `
    let area = document.getElementById("featured")
    area.innerHTML = html;
}

const intervalId = setInterval(imgHandler, 5000);

export async function blogs(){
    try{
        let response = await fetch('./js/blog.json');
        let result = await response.json();
        let spot = document.querySelector('updates');
        let html = '';

        html += `
            <h2>News and Updates</h2><hr>
        `;
        for (let blog in result){
            html += `
                <section class="middle">
                    <h1>${result[blog].Topic}</h1><hr>
                    <div style="display: flex;">
                        <img src="${result[blog].Image} class="middle-img">
                    <div>
                            <h3>${result[blog].Heading}</h3>
                            <p>${result[blog].Content}</p>
                        </div>
                        
                    </div>

            
                </section>
            `;
        }
        
        spot.innerHTML = html;
        
    }catch(e){
        console.log(e);
    }
}