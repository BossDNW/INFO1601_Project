// auth-service.js
import {firebaseConfig, app} from './firebaseConfig.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const auth = getAuth(app);

// Add to auth-service.js
export const signUpUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(getFriendlyAuthError(error.code));
    }
  };
  
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(getFriendlyAuthError(error.code));
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error('Logout failed. Please try again.');
  }
};

export const monitorAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Helper function for user-friendly error messages
const getFriendlyAuthError = (errorCode) => {
  const errors = {
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts. Try again later'
  };
  return errors[errorCode] || 'Login failed. Please try again.';
};