import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/analyse.module.css';

const starterMessages = [
  {
    role: 'assistant',
    text: 'Hi! Ask me about your spending patterns, categories, or monthly goals.',
  },
];

export default function Analyse() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const nextMessages = [
      ...messages,
      { role: 'user', text: trimmed },
      {
        role: 'assistant',
        text: 'This is a demo interface. Connect your AI endpoint to enable real responses.',
      },
    ];

    setMessages(nextMessages);
    setInput('');
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>Monthly | Analyse</title>
      </Head>
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Monthly AI</p>
            <h1 className={styles.title}>Analyse the budget</h1>
            <p className={styles.subtitle}>
              Chat with an assistant to surface trends, risks, and savings ideas.
            </p>
          </div>
          <div className={styles.headerCard}>
            <p className={styles.headerLabel}>Prompt ideas</p>
            <ul>
              <li>Where did I overspend this month?</li>
              <li>Summarize my top three categories.</li>
              <li>Suggest a realistic savings target.</li>
            </ul>
          </div>
        </header>

        <section className={styles.chatShell}>
          <div className={styles.chatStream}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`${styles.message} ${
                  message.role === 'user' ? styles.fromUser : styles.fromAssistant
                }`}
              >
                <span className={styles.messageRole}>
                  {message.role === 'user' ? 'You' : 'Monthly AI'}
                </span>
                <p>{message.text}</p>
              </div>
            ))}
          </div>

          <aside className={styles.sidePanel}>
            <h2>Focus areas</h2>
            <div className={styles.pillGrid}>
              <span>Cash flow</span>
              <span>Recurring bills</span>
              <span>Spending spikes</span>
              <span>Category balance</span>
            </div>
            <div className={styles.insight}>
              “Ask about one category at a time for sharper answers.”
            </div>
          </aside>
        </section>

        <form className={styles.composer} onSubmit={handleSubmit}>
          <label className={styles.srOnly} htmlFor="chat-input">
            Message
          </label>
          <textarea
            id="chat-input"
            rows="2"
            placeholder="Ask about your budget..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <div className={styles.composerActions}>
            <button type="button" className={styles.ghost}>
              Attach data
            </button>
            <button type="submit" className={styles.primary}>
              Send
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
