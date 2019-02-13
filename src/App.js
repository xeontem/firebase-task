import React, { Component } from 'react';

import { ProgressBar } from './progressBar';
import { Message } from './message';
import { fb } from './firebase.service';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      todos: [],
      messages: [],
    };

    // show authorized user onload
    fb.auth.onAuthStateChanged(user =>
      this.setState({ user: user
        ? { displayName: user.displayName, photoURL: user.photoURL }
        : null
      }));

    fb.getTodos(snap => {
      this.setState({
        todos: [...snap.docs].map(doc => ({ ...doc.data(), id: doc.id, progress: 0 }))
      });
    });

    fb.msg.onMessage(payload => {
      this.setState({ messages: [...this.state.messages, payload.notification] })
    });
  }

  backupTodos() {
    fb.backupTodos().then(res => {
      console.log(res);
    });
  }

  getMessage() {
    if(this.state.messages.length) {
      const [head, ...tail] = this.state.messages; // eslint-disable-line
      setTimeout(() => this.setState({ messages: tail }), 4000);
    }
    return this.state.messages[0];
  }

  toggleDone = todo => () => {
    fb.toggleTodo(todo).catch(e => e);
  }

  uploadAttachment = i => e => {
    const file = e.target.files[0];
    if(file) {
      const task = fb.uploadFile(this.state.todos[i].id, file)
      task.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({
          todos: this.state.todos.map((todo, ind) =>
            i === ind ? ({ ...todo, progress }) : todo)
        });
      },
      e => e,
      () => {
        task.snapshot.ref.getDownloadURL().then(url => {
          fb.updateField(
            this.state.todos[i].id,
            'attachments',
            [...this.state.todos[i].attachments, { url, name: file.name }]
          );
        });
      });
    }
  }

  deleteAttachment = (todoInd, attachInd) => () => {
    const id = this.state.todos[todoInd].id;
    const file = this.state.todos[todoInd].attachments[attachInd];
    const newAttachments = this.state.todos[todoInd].attachments.filter((file, ind) => ind !== attachInd);
    fb.deleteFile(id, file, newAttachments);
  }

  login = () => {
    fb.login().then(({ user }) => {
      this.setState({ user });
    });
  }

  logout = () => {
    fb.logout().then(() => {
      this.setState({ user: null });
    });
  }

  render() {
    const { user } = this.state;
    const message = this.getMessage();
    return (
      <React.Fragment>
        {message && <Message message={message} />}
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <section className="login__wrapper">
              {user && <img src={user.photoURL} alt='avatar' />}
              {user && <p>{user.displayName}</p>}
              {user
                ? <button onClick={this.logout}>Logout</button>
                : <button onClick={this.login}>Login</button>
              }
            </section>
          </header>
          <button className="back-up" onClick={this.backupTodos}>Backup Todos</button>
          <main>
          {this.state.todos.map((todo, i) => (
              <article key={`todo${i}`} className={`todo__wrapper todo__wrapper--${todo.done ? 'done' : 'not-done'}`}>
                <h2>{todo.header}</h2>
                <p>{todo.descr}</p>
                <input type="file" onChange={this.uploadAttachment(i)} />
                {todo.progress ? <ProgressBar progress={todo.progress} /> : null}
                <h3>Attachments</h3>
                {todo.attachments.length
                  ? <div className="todo__attachments">
                    {todo.attachments.map((file, ind) =>
                      <div key={`key_${ind}`}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                        <button onClick={this.deleteAttachment(i, ind)}>-</button>
                      </div>
                    )}
                  </div> : null
                }
                <button className="todo__done-button" onClick={this.toggleDone(todo)}>Toggle Done</button>
              </article>
            ))}
          </main>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
