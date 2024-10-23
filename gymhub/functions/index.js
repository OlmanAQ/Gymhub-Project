const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.eliminarUsuarioAuth = functions.https.onCall(async (data, context) => {
  const { uid } = data;

  // Verificar si el usuario que solicita la eliminación es administrador
  const usuarioSolicitanteRef = admin.firestore().collection('User').doc(context.auth.uid);
  const usuarioSolicitanteDoc = await usuarioSolicitanteRef.get();
  console.log('Usuario actual: ', usuarioSolicitanteDoc.data().email);
  console.log('Rol actual: ', usuarioSolicitanteDoc.data().rol);
  if (!usuarioSolicitanteDoc.exists || usuarioSolicitanteDoc.data().rol !== 'Administrador') {
    throw new functions.https.HttpsError('permission-denied', 'Solo los administradores pueden eliminar usuarios.');
  }

  try {
    await admin.auth().deleteUser(uid);
    return { message: 'Usuario eliminado correctamente de Firebase Authentication' };
  } catch (error) {
    console.error('Error eliminando el usuario:', error);
    throw new functions.https.HttpsError('unknown', 'Error al eliminar el usuario de Firebase Authentication');
  }
});
