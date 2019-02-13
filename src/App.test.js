import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// fb sevice mock
jest.mock('./firebase.service', () => ({
  fb: {
    getTodos: () => {},
    auth: { onAuthStateChanged: () => {} },
    msg: { onMessage: () => {} }
  },
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
