import { useState } from 'react';
import { Inter } from '@next/font/google';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';
import Head from 'next/head';
const inter = Inter({ subsets: ['latin'] });


export default function Aggregate({ initialData }) {
  const router = useRouter()
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(Array.isArray(initialData) ? initialData : []);
  const [errorMessage, setErrorMessage] = useState('');
  const fetchData = async () => {
    setErrorMessage('');
    try {
      const res = await fetch(`http://localhost:3000/api/aggregate?startDate`);
      const resdata = await res.json();
      if (!res.ok) {
        setErrorMessage(resdata?.error || 'Failed to load summary.');
        setData([]);
        return;
      }
      // Update the component's state with the fetched data
      setData(resdata);
    } catch (error) {
      console.error('Aggregate fetch error:', error);
      setErrorMessage('Failed to load summary.');
      setData([]);
    }
  };

  return (
    <div>
      <Head>
        <title>Monthly</title>
      </Head>
      <section className={styles.subSection}>
        <div className={styles.container}>
          <div className={styles.description}>
            <div>
              <h1 className={styles.sectionTitle}>Summary of expenses</h1>
              <div className={styles.filters}>
                <div>
                  <label htmlFor="startDate">Start Date:</label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="endDate">End Date:</label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <button onClick={fetchData} className={styles.primaryButton}>
                Fetch Data
              </button>
              {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
              <table className={styles.table}>
                <tbody>
                  <tr><th>Item</th><th>Total</th></tr>
                  {Array.isArray(data) && data.map((totals) => {
                    const item = totals.expenseType ?? totals._id;
                    return (
                      <tr key={item}><td>{item}</td><td>{totals.total}</td></tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export async function getServerSideProps() {
  try {
    const res = await fetch(`http://localhost:3000/api/aggregate`)
    const body = await res.json()
    return { props: { initialData: res.ok ? body : [] } }
  } catch (error) {
    console.error('Aggregate SSR fetch error:', error)
    return { props: { initialData: [] } }
  }
}
