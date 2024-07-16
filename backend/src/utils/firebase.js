const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const fs = require("fs");

initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
});

const firebaseStorage = getStorage();

const uploadOnFirebase = async (file) => {
  try {
    if (!file) return null;

    const fileBuffer = await fs.promises.readFile(file.path);
    const storageRef = ref(firebaseStorage, `images/${file.filename}`);

    const metadata = {
      contentType: file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      fileBuffer,
      metadata
    );
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Remove the temporary file after upload
    await fs.promises.unlink(file.path);

    return downloadURL;
  } catch (error) {
    console.log("Error uploading file:", error.message);
    // Remove the temporary file after upload
    await fs.promises.unlink(file.path);
  }
};

module.exports = { uploadOnFirebase };
