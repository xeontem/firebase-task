const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.saveUser = functions.auth.user().onCreate(event => {
  console.log(event)
  // const user = event.data; // The Firebase user.
  // const email = user.email; // The email of the user.
  // const displayName = user.displayName; // The display name of the user.
  // const token = user.token;
  // const photoURL = user.photoURL;

  // admin.firestore().collection('users').doc(user.id).set({
  //   email, displayName, token, photoURL
  // })
});

exports.myFunctionName = functions.firestore.document('todos').onWrite((change, context) => {
  console.log(context);
  // ... Your code here
});
