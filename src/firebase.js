const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const { initializeApp, credential } = require('firebase-admin');

// Crea un cliente de Secret Manager
const client = new SecretManagerServiceClient();

// Función para obtener las credenciales de Firebase desde Secret Manager
async function getFirebaseCredentials() {
  const [version] = await client.accessSecretVersion({
    name: 'projects/firebase-service-account/secrets/firebase-service-account/versions/latest',
  });

  const credentials = JSON.parse(version.payload.data.toString());
  return credentials;
}

// Función para inicializar la aplicación Firebase
async function initializeFirebaseApp() {
  try {
    const firebaseCredentials = await getFirebaseCredentials();
    initializeApp({
      credential: credential.cert(firebaseCredentials),
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    // Manejar el error adecuadamente
  }
}

// Llama a la función para inicializar Firebase
initializeFirebaseApp();

// Exporta las funciones de Firebase si las necesitas en otros archivos
const db = getFirestore(); // Por ejemplo, para Firestore
module.exports = { db };
