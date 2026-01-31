import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import styles from '../../styles/Home.module.css';

export default function Transactions() {
  const now = useMemo(() => new Date(), []);
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [month, setMonth] = useState(defaultMonth);
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = async (targetMonth) => {
    setErrorMessage('');
    try {
      const token = Cookies.get('token');
      const res = await fetch(`/api/expense?month=${encodeURIComponent(targetMonth)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resdata = await res.json();
      if (!res.ok) {
        setErrorMessage(resdata?.error || 'Failed to load transactions.');
        setData([]);
        return;
      }
      setData(Array.isArray(resdata) ? resdata : []);
    } catch (error) {
      console.error('Transactions fetch error:', error);
      setErrorMessage('Failed to load transactions.');
      setData([]);
    }
  };

  useEffect(() => {
    fetchData(month);
  }, [month]);

  return (
    <div>
      <Head>
        <title>Monthly</title>
      </Head>
      <section className={styles.subSection}>
        <div className={styles.container}>
          <div className={styles.description}>
            <h1 className={styles.sectionTitle}>Monthly transactions</h1>
            <div className={styles.filters}>
              <div>
                <label htmlFor="month">Month</label>
                <input
                  type="month"
                  id="month"
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                />
              </div>
            </div>
            {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
            <table className={styles.table}>
              <tbody>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Comments</th>
                </tr>
                {Array.isArray(data) && data.map((txn) => {
                  const dateLabel = txn.expenseDate
                    ? new Date(txn.expenseDate).toLocaleDateString()
                    : '-';
                  return (
                    <tr key={txn._id}>
                      <td>{dateLabel}</td>
                      <td>{txn.expenseType}</td>
                      <td>{txn.Amount}</td>
                      <td>{txn.comments || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
