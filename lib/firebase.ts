import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getMessaging } from "firebase/messaging"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyC2mTHGK7zMMC8nk5oe8IWvv94a_bgj_lE",
  authDomain: "budjet-buddy.firebaseapp.com",
  projectId: "budjet-buddy",
  storageBucket: "budjet-buddy.firebasestorage.app",
  messagingSenderId: "950886711978",
  appId: "1:950886711978:web:d5b776cb621fb8e7ddc6d3",
  measurementId: "G-LDVHZ2C9LR",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
let analytics
let messaging

// Only initialize analytics and messaging on client side
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app)
    messaging = getMessaging(app)
  } catch (error) {
    console.error("Firebase services failed to initialize:", error)
  }
}

export { app, auth, db, messaging, analytics }
