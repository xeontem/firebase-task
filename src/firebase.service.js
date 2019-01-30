import firebase from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyCNWCIvwa3ko3YozWO-9Z-U8yhKH60HFt4",
  authDomain: "fir-task-8afe6.firebaseapp.com",
  databaseURL: "https://fir-task-8afe6.firebaseio.com",
  projectId: "fir-task-8afe6",
  storageBucket: "fir-task-8afe6.appspot.com",
  messagingSenderId: "328069279167"
};
firebase.initializeApp(config);

// authentication
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

export const fb = {
  signIn: (onSucc, onFail) => firebase.auth().signInWithPopup(provider).then(result => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const token = result.credential.accessToken;
    // The signed-in user info.
    // const user = result.user;
    onSucc(result);
    // ...
  }).catch(error => {
    console.log(error);
    // Handle Errors here.
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // The email of the user's account used.
    // const email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    // const credential = error.credential;

    onFail(error);
  }),
  signOut: (onSucc, onFail) => firebase.auth().signOut().then(function() {
    // Sign-out successful.
    onSucc();
  }).catch(function(error) {
    // An error happened.
    onFail();
  }),
};
