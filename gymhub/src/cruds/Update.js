// firebaseActions.js
import { collection, doc, getDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';

export const fetchMuscleGroups = async (db) => {
  try {
    const docRef = collection(db, 'gmusculares');
    const querySnapshot = await getDocs(docRef);
    if (!querySnapshot.empty) {
      return Object.entries(querySnapshot.docs[0].data()).map(([group, exercises]) => ({ group, exercises }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching muscle groups: ', error);
    throw error;
  }
};

export const fetchRoutine = async (db, planId) => {
  try {
    const docRef = doc(db, 'plans', planId);
    const routineSnapshot = await getDoc(docRef);
    if (routineSnapshot.exists()) {
      return routineSnapshot.data();
    }
    throw new Error('No such routine!');
  } catch (error) {
    console.error('Error fetching routine: ', error);
    throw error;
  }
};

export const fetchUsers = async (db, searchQuery) => {
  try {
    if (searchQuery.length > 2) {
      const q = query(collection(db, 'User'), where('nombre', '>=', searchQuery), where('nombre', '<=', searchQuery + '\uf8ff'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching users: ', error);
    throw error;
  }
};

export const saveRoutine = async (db, plan, selectedUser, routineName, weeklyRoutine, activityState) => {
  try {
    const routineRef = doc(db, 'plans', plan.id);
    const validState = typeof activityState === 'boolean' ? activityState : false;
    await updateDoc(routineRef, {
      usuario: selectedUser.usuario,
      nombre: routineName,
      rutina: weeklyRoutine,
      estado: validState,
    });
  } catch (error) {
    console.error('Error saving routine: ', error);
    throw error;
  }
};
