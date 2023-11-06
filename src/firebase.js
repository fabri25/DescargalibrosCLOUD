const admin = require('firebase-admin');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const client = new SecretManagerServiceClient();

async function getFirebaseCredentials() {
  const [version] = await client.accessSecretVersion({
    name: 'projects/descargalibros1/secrets/firebase-service-account/versions/latest',
  });
  const credentials = JSON.parse(version.payload.data.toString());
  return credentials;
}

async function initializeFirebaseApp() {
  if (admin.apps.length === 0) { // Solo inicializa si no hay instancias ya inicializadas
    try {
      const firebaseCredentials = await getFirebaseCredentials();
      admin.initializeApp({
        credential: admin.credential.cert(firebaseCredentials),
      });
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
      throw error; // Lanzar el error para manejarlo más arriba en la pila
    }
  }
}

// Llama a la función para inicializar Firebase al momento de requerir este módulo
// Esto asegura que Firebase se inicialice antes de usarlo en otros módulos.
initializeFirebaseApp().catch(console.error);

// Exporta las funciones de Firebase si las necesitas en otros archivos
const db = admin.firestore();

module.exports = { db }; // exporta db para usarlo en otro lugar
