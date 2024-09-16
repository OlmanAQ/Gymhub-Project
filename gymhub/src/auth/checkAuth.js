import appFirebase from '../firebaseConfig/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth(appFirebase);


// Function to check authentication status and return user
const checkAuth = (setUser) => {
  onAuthStateChanged(auth, (userF) => {
    if (userF) {
      setUser(userF);
    } else {
      setUser(null);
    }
  });
};

export default checkAuth;
