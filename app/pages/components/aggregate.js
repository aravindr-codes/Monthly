import { useState } from 'react';
import { Inter } from '@next/font/google';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';
import Head from 'next/head';
const inter = Inter({ subsets: ['latin'] });


export default   function  Aggregate({initialData}) {
  const router = useRouter()
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(initialData);
  const fetchData = async () => {
    const res = await fetch(`http://localhost:3000/api/aggregate?startDate=${startDate}&endDate=${endDate}`);
    const resdata = await res.json();
    // Update the component's state with the fetched data
    setData(resdata);
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
              <table className={styles.table}>
                <tbody>
                  <tr><th>Item</th><th>Total</th></tr>
                  {data.map((totals) => {
                    return (
                      <tr key={totals._id}><td>{totals._id}</td><td>{totals.total}</td></tr>
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
export async function getServerSideProps() {  //Why are you doing this like this?????
  const res = await fetch(`http://localhost:3000/api/aggregate`)
  var body=await res.json()
  console.log(body)
  return { props: { initialData:body} }
    
  }
