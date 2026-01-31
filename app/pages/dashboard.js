// dashboard.js
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Expense from './components/expense'; // Import the Expense component
import Aggregate from './components/aggregate'; // Import the Aggregate component
import Transactions from './components/transactions';
import styles from '../styles/dashboard.module.css';
import Link from 'next/link';

export default function Dashboard() {
  const [showComponent, setShowComponent] = useState(null);

  const handleClick = (component) => {
    setShowComponent(component);
  };

  return (
    <div>
      <Head>
        <title>Monthly App</title>
      </Head>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>M</div>
            <div>
              <p className={styles.brandKicker}>Monthly</p>
              <h1 className={styles.brandTitle}>Personal budget control center</h1>
            </div>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.statusChip}>
              <span className={styles.statusDot}></span>
              Sync active
            </div>
            <button className={styles.secondaryButton} type="button">
              Export report
            </button>
          </div>
        </header>

        <section className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Month to date</p>
            <p className={styles.summaryValue}>$2,840</p>
            <p className={styles.summaryMeta}>$360 under plan</p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Top category</p>
            <p className={styles.summaryValue}>Housing</p>
            <p className={styles.summaryMeta}>38% of expenses</p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Upcoming bills</p>
            <p className={styles.summaryValue}>4</p>
            <p className={styles.summaryMeta}>Next due in 6 days</p>
          </div>
        </section>

        <section className={styles.actionGrid}>
          <button
            className={styles.actionCard}
            type="button"
            onClick={() => {
              handleClick('expense');
            }}
          >
            <span className={styles.actionTitle}>Add an expense</span>
            <span className={styles.actionText}>
              Log a new purchase and tag it to a category.
            </span>
          </button>
          <button
            className={styles.actionCard}
            type="button"
            onClick={() => {
              handleClick('aggregate');
            }}
          >
            <span className={styles.actionTitle}>View monthly summary</span>
            <span className={styles.actionText}>
              Compare totals across categories and time ranges.
            </span>
          </button>
          <button
            className={styles.actionCard}
            type="button"
            onClick={() => {
              handleClick('transactions');
            }}
          >
            <span className={styles.actionTitle}>View transactions</span>
            <span className={styles.actionText}>
              Review every entry for the selected month, including notes.
            </span>
          </button>
          <Link className={styles.actionCard} href="/analyse">
            <span className={styles.actionTitle}>Analyze the budget</span>
            <span className={styles.actionText}>
              Chat with an AI assistant to interpret spending trends.
            </span>
          </Link>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Budget workspace</h2>
              <p className={styles.panelSubtitle}>
                Use the tools below to update expenses or review summaries.
              </p>
            </div>
          </div>
          {showComponent === 'expense' && <Expense />}
          {showComponent === 'aggregate' && <Aggregate />}
          {showComponent === 'transactions' && <Transactions />}
        </section>
      </main>
    </div>
  );
}
