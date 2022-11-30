// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBzXHDEhMbgGb2bIy-34IOUy__iMDVyAIY',
  authDomain: 'to-do-list-29b19.firebaseapp.com',
  projectId: 'to-do-list-29b19',
  storageBucket: 'to-do-list-29b19.appspot.com',
  messagingSenderId: '73608935171',
  appId: '1:73608935171:web:5c43236aef219318551b36',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
