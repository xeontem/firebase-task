const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.backupTodos = functions.https.onCall((data, context) => {
  return admin.firestore().collection('backup_todos').get()
    .then(querySnap => querySnap.docs)
    .then(docs => docs.map(doc => doc.ref.delete()))
    .then(docs => admin.firestore().collection('todos').get())
    .then(querySnap => querySnap.docs)
    .then(docs => docs.map(doc => ({ data: doc.data(), id: doc.id })))
    .then(todos => todos.map(todo =>
        admin.firestore().collection('backup_todos').doc(`${todo.id}`).set(todo.data)))
    .then(backup => {
      console.log(`backuped ${backup.length} todos. Backup success!!`);
      // const payload = {
      //   notification: {
      //     title: 'React App',
      //     body: `backuped ${backup.length} todos. Backup success!!`,
      //     icon: 'https://firebasestorage.googleapis.com/v0/b/circle-ci-test-31dfc.appspot.com/o/firestore.png?alt=media&token=a1227c5e-6cad-4dfb-81d6-ae07d7dbac1c'
      //   }
      // };
      // admin.messaging().sendToTopic('TODOS', payload);
      return `backuped ${backup.length} todos. Backup success!!`;
    }).catch(console.log);
});

//-------------------------------- messaging ---------------------------
exports.subscribeToTopic = functions.https.onCall((data, context) => {
  admin.messaging().subscribeToTopic(data.token, data.topic)
    .then(res => {
      console.log('Successfully subscribed to topic: ', res);
    }).error(err => {
      console.log('Error subscribing to topic: ', err);
    })
});

exports.sendUpdate = functions.firestore.document('todos/{todoID}')
  .onUpdate(todo => {
    const oldTodo = todo.before.data();
    const message = {
      notification: {
        title: 'Firebase Task App',
        body: `todo ${oldTodo.header} successfully updated`,
        icon: 'https://firebasestorage.googleapis.com/v0/b/circle-ci-test-31dfc.appspot.com/o/firestore.png?alt=media&token=a1227c5e-6cad-4dfb-81d6-ae07d7dbac1c'
      }
    };
    admin.messaging().sendToTopic('TODOS', message);
  });
