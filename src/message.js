import React from 'react';
import './message.css';

export const Message = ({ message }) =>
  <aside className="message__wrapper" >
    <img src={message.icon} width="100" height="100" alt="icon" />
    <div>
      <h3>{message.title}</h3>
      <p>{message.body}</p>
    </div>
  </aside>;
