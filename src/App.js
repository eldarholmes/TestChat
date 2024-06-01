import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://192.168.1.5:4000');

function App() {
  const [inputName, setInputName] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleInputChangeName = (event) => {
    setInputName(event.target.value);
  };

  const sendMessage = () => {
    if (inputName.trim() !== '' && inputText.trim() !== '') {
      const newMessage = {
        name: inputName,
        text: inputText,
      };
      socket.emit('sendMessage', newMessage);
      setInputText('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="logo">TestChat</h1>
      </header>
      <div className="choose-name">
        <h3 className="input-text">Введите ваше имя:</h3>
        <input
          className="input-field"
          value={inputName}
          onChange={handleInputChangeName}
          placeholder="Type your name..."
          type="text"
        />
      </div>
      <div className="chat">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <h3 className="message-name">{message.name}</h3>
            <p className="message-text">{message.text}</p>
          </div>
        ))}
      </div>
      <div className="input-message">
        <input
          className="input-message-field"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type something..."
          type="text"
        />
        <button onClick={sendMessage} className="input-message-send">
          <h3 style={{ margin: 0 }}>Отправить</h3>
        </button>
      </div>
    </div>
  );
}

export default App;
