import firebaseConfig from "./firebaseConfig.js"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

const auth = getAuth(firebaseConfig.app)

function getData(){
    let data = {
        "email": document.getElementById("email").value,
        "password": document.getElementById("password").value
    };
    if (!(data.email==null||data.password==null)){
        console.log("Data Retrieved");
    }else{
        console.log("Data not Retrieved");
    }
    return data;
}
let form_data = {
    "email" : null,
    "password": null
}
const login = document.getElementById("login-submit");
login.addEventListener("click",function(event){
    event.preventDefault();
    form_data = getData();
    console.log(form_data)
    signInWithEmailAndPassword(auth, form_data.email, form_data.password)
    .then((userCredential) => {
        const user = userCredential.user;
        alert((auth.currentUser).email)
        window.location.href = "./index.html"
    })
    .catch((error) => {
        const errorCode = error.code;
        niceError(errorCode);
    });
})

const signup = document.getElementById("signup-submit");
signup.addEventListener("click",function(event){
    event.preventDefault();
    form_data = getData();
    console.log(form_data)
    createUserWithEmailAndPassword(auth, form_data.email, form_data.password)
    .then((userCredential) => {
        const user = userCredential.user;
        alert("Signed Up!")
    })
    .catch((error) => {
        const errorCode = error.code;
        niceError(errorCode);
    });
})


function niceError(error_code){
    const errorMap = {
        // Common authentication errors
        'auth/invalid-email': 'Please enter a valid email address',
        'auth/user-disabled': 'This account has been disabled. Please contact support.',
        'auth/user-not-found': 'No account found with this email address',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use': 'This email is already registered. Please use another email or login.',
        'auth/operation-not-allowed': 'Email/password login is currently disabled',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/too-many-requests': 'Too many login attempts. Please try again later or reset your password.',
        'auth/account-exists-with-different-credential': 'An account already exists with this email',
        'auth/requires-recent-login': 'Please login again to perform this action',
        'auth/credential-already-in-use': 'This credential is already associated with another account',
        
        // Password reset errors
        'auth/expired-action-code': 'The reset link has expired',
        'auth/invalid-action-code': 'The reset link is invalid',
        'auth/user-mismatch': 'The credential does not match the current user',
        
        // Network errors
        'auth/network-request-failed': 'Network error. Please check your internet connection.',
        
        // Timeout errors
        'auth/timeout': 'Request timed out. Please try again.',
        
        // Other common errors
        'auth/popup-closed-by-user': 'The login window was closed before completing',
        'auth/unauthorized-domain': 'Login is not allowed from this domain',
        'auth/cancelled-popup-request': 'Multiple login attempts detected',
        'auth/popup-blocked': 'Login popup was blocked. Please allow popups for this site.'
      };
    
      // Return the friendly message or a generic one if not found
      alert(errorMap[error_code] || 'An unexpected error occurred. Please try again.');
}
console.log("Loaded")