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
  const chartColors = [
    '#2f6657',
    '#d4a45c',
    '#4f7aa2',
    '#c26b4f',
    '#6d4b7c',
    '#3f7f78',
    '#b84e63',
    '#6b7f3f',
    '#a06b3f',
  ];
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
              <div className={styles.donutSection}>
                <div className={styles.donutWrapper}>
                  {(() => {
                    const cleaned = Array.isArray(data)
                      ? data
                          .filter((item) => Number(item.total) > 0)
                          .map((item) => ({
                            label: item.expenseType ?? item._id ?? 'Unknown',
                            value: Number(item.total),
                          }))
                      : [];
                    const total = cleaned.reduce((sum, item) => sum + item.value, 0);
                    const radius = 68;
                    const circumference = 2 * Math.PI * radius;
                    let offset = 0;

                    if (!total) {
                      return (
                        <div className={styles.donutEmpty}>
                          <span>No data yet</span>
                        </div>
                      );
                    }

                    return (
                      <svg
                        className={styles.donut}
                        viewBox="0 0 180 180"
                        role="img"
                        aria-label="Expense contribution by type"
                      >
                        <g transform="translate(90 90) rotate(-90)">
                          {cleaned.map((item, index) => {
                            const dash = (item.value / total) * circumference;
                            const gap = circumference * 0.01;
                            const segment = Math.max(dash - gap, 0);
                            const segmentOffset = -offset;
                            offset += dash;
                            return (
                              <circle
                                key={item.label}
                                r={radius}
                                cx="0"
                                cy="0"
                                fill="transparent"
                                stroke={chartColors[index % chartColors.length]}
                                strokeWidth="18"
                                strokeDasharray={`${segment} ${circumference - segment}`}
                                strokeDashoffset={segmentOffset}
                              />
                            );
                          })}
                        </g>
                        <text x="90" y="88" textAnchor="middle" className={styles.donutTotalLabel}>
                          Total
                        </text>
                        <text x="90" y="112" textAnchor="middle" className={styles.donutTotalValue}>
                          {total.toFixed(2)}
                        </text>
                      </svg>
                    );
                  })()}
                </div>
                <div className={styles.donutLegend}>
                  {Array.isArray(data) && data.filter((item) => Number(item.total) > 0).map((item, index) => {
                    const label = item.expenseType ?? item._id ?? 'Unknown';
                    return (
                      <div key={label} className={styles.donutLegendItem}>
                        <span
                          className={styles.donutLegendSwatch}
                          style={{ backgroundColor: chartColors[index % chartColors.length] }}
                        />
                        <span className={styles.donutLegendLabel}>{label}</span>
                        <span className={styles.donutLegendValue}>{Number(item.total).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
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
