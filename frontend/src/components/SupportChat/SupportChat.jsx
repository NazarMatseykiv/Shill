import React, { useState, useRef, useEffect } from 'react';
import './SupportChat.css';

const SupportChat = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Вітаю! Я ваш чат-бот. Як можу допомогти?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest', preventScroll: true });
    }
  }, [messages]);

  const sendMessage = async (e) => {
  e.preventDefault();
  if (!input.trim()) return;
  const userMsg = { sender: 'user', text: input };
  setMessages((msgs) => [...msgs, userMsg]);
  setLoading(true);
  try {
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input })
    });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    const botMsg = typeof data.answer === 'string' ? data.answer : 'Вибачте, сталася помилка.';
    setMessages((msgs) => [...msgs, { sender: 'bot', text: botMsg }]);
  } catch (err) {
    console.error('Error in sendMessage:', err);
    setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Вибачте, сталася помилка.' }]);
  }
  setLoading(false);
  setInput('');
};

  return (
    <div className="support-chat">
      <div className="chat-header">Чат підтримки</div>
      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-msg ${msg.sender}`}>{msg.text}</div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Введіть питання..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>Відправити</button>
      </form>
      {loading && <div className="chat-loading">Відповідь...</div>}
    </div>
  );
};

export default SupportChat;
