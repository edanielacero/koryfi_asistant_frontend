import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [greetingShown, setGreetingShown] = useState(false); // Estado para controlar el saludo inicial

  // Mostrar saludo al iniciar la conversación
  useEffect(() => {
    if (!greetingShown) {
      const greetingMessage = { sender: 'bot', text: 'Hola, ¿en qué podemos ayudarte hoy?' };
      setChatHistory([greetingMessage]); 
      setGreetingShown(true); 
    }
  }, [greetingShown]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputValue.trim() === '') return;

    const userMessage = { sender: 'user', text: inputValue };
    setChatHistory([...chatHistory, userMessage]);

    try {
      const response = await fetch('https://koryfiasistant-production.up.railway.app/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pregunta: inputValue }),
      });

      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.respuesta };
      setChatHistory([...chatHistory, userMessage, botMessage]);
    } catch (error) {
      console.error('Error fetching answer:', error);
    }

    setInputValue('');
  };

  return (
    <div className="app">
      <header className="header">
        <img src="./logo_koryfi.png" alt="Company Logo" className="logo" />
        <h1>Soporte Koryfi</h1>
      </header>

      <div className="chat-container">
        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
            {/* Renderizar HTML en las respuestas del bot */}
            {message.sender === 'bot' ? (
              <p dangerouslySetInnerHTML={{ __html: message.text }} />
            ) : (
              <p>{message.text}</p>
            )}
          </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            className="chat-input"
          />
          <button type="submit" className="submit-button">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default App;
