import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCW8v55QC9FqIgrVsACCoS2sdw_GSFXYw0",
  authDomain: "fir-task-c37ed.firebaseapp.com",
  databaseURL: "https://fir-task-c37ed.firebaseio.com",
  projectId: "fir-task-c37ed",
  storageBucket: "fir-task-c37ed.appspot.com",
  messagingSenderId: "1030570304835"
};
const fire = firebase.initializeApp(config);

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const auth = fire.auth();
const func = firebase.functions();

export const fb = {
  login: () => auth.signInWithPopup(provider),
  logout: () => auth.signOut(),
  getTodos: cb => firebase.firestore().collection('todos').onSnapshot(cb),
  toggleTodo: ({ id, done}) => firebase.firestore().collection('todos')
    .doc(id).update({ done: !done }),
  backupTodos: () => func.httpsCallable('backupTodos')(),
  uploadFile: (id, file) => {
    const ref = firebase.storage().ref('todos/' + id + '/' + file.name);
    const task = ref.put(file);
    return task;
  },
  deleteFile: (id, file, attachments) => {
    firebase.storage().ref('todos/' + id + '/' + file.name).delete()
      .then(succ => {
        firebase.firestore().collection('todos').doc(id).update({ attachments });
      }).catch(e => e);
  },
  updateField: (id, field, value) => firebase.firestore().collection('todos').doc(id)
    .update({ [field]: value }).catch(e => e),
  auth,
};
