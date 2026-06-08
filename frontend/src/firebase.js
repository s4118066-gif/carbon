import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Firebase configuration keys (can be set in .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ecowise-ai-mock.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ecowise-ai-mock",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ecowise-ai-mock.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000"
};

// Check if we are running in full firebase mode or local mockup mode
const isMockMode = firebaseConfig.apiKey === "mock-api-key" || !import.meta.env.VITE_FIREBASE_API_KEY;

let app;
let auth;
let db;

if (!isMockMode) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("EcoWise AI initialized in Production Mode using Firebase!");
  } catch (error) {
    console.error("Failed to initialize Firebase, falling back to Mock/Local storage mode:", error);
    app = null;
    auth = null;
    db = null;
  }
} else {
  console.log("EcoWise AI initialized in standalone Demo Mode (local storage fallback)!");
}

// Wrapper for Auth logic to handle both modes transparently
export const appAuth = {
  isMock: isMockMode || !auth,
  
  register: async (email, password, displayName) => {
    if (appAuth.isMock) {
      const user = { uid: "demo-user-123", email, displayName, photoURL: null };
      localStorage.setItem("ecowise_user", JSON.stringify(user));
      // Save initial profile
      const defaultProfile = {
        displayName,
        email,
        points: 250,
        badges: ["Seedling"],
        footprint: 4.8,
        createdAt: new Date().toISOString(),
        completedChallenges: []
      };
      localStorage.setItem("ecowise_profile", JSON.stringify(defaultProfile));
      return { user };
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Create user doc in Firestore
      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        displayName,
        email,
        points: 250,
        badges: ["Seedling"],
        footprint: 4.8,
        createdAt: new Date().toISOString(),
        completedChallenges: []
      });
      return userCredential;
    }
  },

  login: async (email, password) => {
    if (appAuth.isMock) {
      if (email === "demo@ecowise.ai" && password === "password") {
        const user = { uid: "demo-user-123", email, displayName: "Eco Hero", photoURL: null };
        localStorage.setItem("ecowise_user", JSON.stringify(user));
        return { user };
      }
      // Simple custom auth for custom emails
      const user = { uid: "custom-user-" + email.substring(0, 4), email, displayName: email.split('@')[0], photoURL: null };
      localStorage.setItem("ecowise_user", JSON.stringify(user));
      return { user };
    } else {
      return await signInWithEmailAndPassword(auth, email, password);
    }
  },

  logout: async () => {
    if (appAuth.isMock) {
      localStorage.removeItem("ecowise_user");
      return true;
    } else {
      await signOut(auth);
    }
  },

  onStateChanged: (callback) => {
    if (appAuth.isMock) {
      // Monitor changes inside local storage
      const checkUser = () => {
        const userJson = localStorage.getItem("ecowise_user");
        const user = userJson ? JSON.parse(userJson) : null;
        callback(user);
      };
      checkUser();
      window.addEventListener("storage", checkUser);
      return () => window.removeEventListener("storage", checkUser);
    } else {
      return onAuthStateChanged(auth, callback);
    }
  }
};

// Wrapper for Firestore DB logic
export const appDb = {
  getUserProfile: async (uid) => {
    if (appAuth.isMock) {
      const profile = localStorage.getItem("ecowise_profile");
      if (profile) return JSON.parse(profile);
      
      const defaultProfile = {
        displayName: "Eco Warrior",
        email: "demo@ecowise.ai",
        points: 320,
        badges: ["Seedling", "Green Commuter"],
        footprint: 3.5,
        createdAt: new Date().toISOString(),
        completedChallenges: ["day_1_bike", "day_3_meatless"]
      };
      localStorage.setItem("ecowise_profile", JSON.stringify(defaultProfile));
      return defaultProfile;
    } else {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    }
  },

  updateUserProfile: async (uid, data) => {
    if (appAuth.isMock) {
      const current = await appDb.getUserProfile(uid);
      const updated = { ...current, ...data };
      localStorage.setItem("ecowise_profile", JSON.stringify(updated));
      return updated;
    } else {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, data);
      return data;
    }
  }
};

export { app as firebaseApp, auth as firebaseAuth, db as firestoreDb };
