const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createNewUser = functions.https.onCall(async (data, context) => {
  const { email, password, role } = data;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // Asigna rol personalizado
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

    return { uid: userRecord.uid }; // Devolver el UID del usuario recién creado
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw new functions.https.HttpsError('internal', 'Error al crear el usuario.');
  }
});
