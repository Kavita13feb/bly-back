// firebase.js
const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage');

const { initializeApp } = require('firebase/app');
const { getAuth ,createUserWithEmailAndPassword,signInWithPopup,GoogleAuthProvider,signInWithEmailAndPassword  } = require('firebase/auth');
require('dotenv').config();


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId:  process.env.FIREBASE_measurementId
};
// Initialize Firebase

// Initialize Firebase Storage


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

const provider = new GoogleAuthProvider();
// Export the auth object for use in other files


const uploadPhoto = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject('No file selected');
    }
    // Create a reference in Firebase Storage
    const storageRef = ref(storage, `photos/${file.name}`);
    
    // Start the upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload
    uploadTask.on('state_changed',
      (snapshot) => {
        // Handle the progress of the upload
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Handle any errors
        reject(error);
      },
      () => {
        // Upload completed successfully, get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

module.exports = { auth, storage, uploadPhoto, createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword };

// module.exports = { auth, storage, createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword };
