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
const todosStore = firebase.firestore().collection('todos');
const func = firebase.functions();

//messaging
const msg = firebase.messaging();
msg.usePublicVapidKey("BGsoQQo2r3rVMERHG2xS7P7-0Mermus_AMQrTdiZyxbl2gJR2-YehuU0e_9VMw9EL9tPIjuPx1ZCSd_SvPy2MuE");
msg.requestPermission()
  .then(() => msg.getToken())
  .then(token => func.httpsCallable('subscribeToTopic')({ token, topic: 'TODOS' }))
  .catch(console.log);

export const fb = {
  login: () => auth.signInWithPopup(provider),
  logout: () => auth.signOut(),
  getTodos: cb => todosStore.onSnapshot(cb),
  toggleTodo: ({ id, done}) => todosStore.doc(id).update({ done: !done }),
  backupTodos: () => func.httpsCallable('backupTodos')(),
  uploadFile: (id, file) => {
    const ref = firebase.storage().ref(`/todos/${id}/${file.name}`);
    const task = ref.put(file);
    return task;
  },
  deleteFile: (id, file, attachments) => firebase.storage().ref(`/todos/${id}/${file.name}`).delete()
    .then(() => todosStore.doc(id).update({ attachments })),
  updateField: (id, field, value) => todosStore.doc(id).update({ [field]: value }),
  auth,
  msg
};
