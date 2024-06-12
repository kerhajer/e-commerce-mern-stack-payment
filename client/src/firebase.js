import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvOIdO7jvShhbZkQT2PisRqiPg45x9Lns",
  authDomain: "e-commerce-b38e0.firebaseapp.com",
  projectId: "e-commerce-b38e0",
  storageBucket: "e-commerce-b38e0.appspot.com",
  messagingSenderId: "740051096930",
  appId: "1:740051096930:web:369a65eb351cf02157083b"
};
 export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export { auth };