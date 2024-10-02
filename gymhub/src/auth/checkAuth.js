import {auth, db} from '../firebaseConfig/firebase';
import {onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';


// Function to check authentication status and return user
const checkAuth = (callback) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      callback(userData);
    } else {
      callback(null);
    }
  });
};
export default checkAuth;
