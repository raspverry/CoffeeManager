
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import {initializeAuth} from 'firebase/auth'
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDolWVoRaF_9Jy7qwHyFHvZqLAh1y8gHGE",
    authDomain: "inventory-management-ed49e.firebaseapp.com",
    projectId: "inventory-management-ed49e",
    storageBucket: "inventory-management-ed49e.appspot.com",
    messagingSenderId: "317212117690",
    appId: "1:317212117690:web:7a7fcce87311e215401083"
  };


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
//const auth = getAuth(app);
const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
const storage = getStorage(app);
export {db, auth, storage};
