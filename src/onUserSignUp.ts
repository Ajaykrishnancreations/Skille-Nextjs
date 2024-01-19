import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
export const onUserSignUp = functions.auth.user().onCreate(async (user) => {
  try {
    const { uid, email, displayName, photoURL } = user;
    await admin.firestore().collection('users').doc(uid).set({
      email,
      displayName,
      photoURL,
    });

    console.log(`User ${uid} details saved to Firestore.`);
    return null;
  } catch (error) {
    console.error('Error saving user details to Firestore:', error);
    throw error;
  }
});
