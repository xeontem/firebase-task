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
      todos: [
        {
          header: 'todo number 1',
          descr: 'description...',
          done: false,
          attachments: [
            { name: 'attached file 1', url: 'url/to/the/file.txt' }
          ]
        }
      ]
    };
  }

  backupTodos() {}

  getMessage() {}

  toggleDone() {}

  uploadAttachment() {}

  deleteAttachment() {}

  login = () => {
    fb.login().then(({ user }) => {
      this.setState({ user });
    });
  }

  logout() {}

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
                <button className="todo__done-button" onClick={this.toggleDone(i)}>Toggle Done</button>
              </article>
            ))}
          </main>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
