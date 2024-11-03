const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./gymhub-c90d3-firebase-adminsdk-863bv-8373fde093.json");

try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Error inicializando Firebase Admin SDK:", error);
  }
  
  if (!admin.auth) {
    console.error("Firebase Admin Auth no se ha inicializado correctamente.");
  }
  
  exports.eliminarUsuario = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "No tienes permiso para realizar esta acción"
      );
    }
  
    const uid = data.uid;
  
    try {
      await admin.auth().deleteUser(uid);
      console.log(`Usuario con UID ${uid} eliminado exitosamente`);
      return { success: true, message: "Usuario eliminado correctamente" };
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw new functions.https.HttpsError("internal", "Error al eliminar el usuario");
    }
  });