import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { useState } from 'react';
import Cookies from 'js-cookie';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  const [error, setError] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const endpoint = '/api/login?q=' + event.target.username.value
    const options = {
      method: 'GET',
    }
    try{

              // Get verification that the user email id is valid and registered.
              const response = await fetch(endpoint, options)
              let data = await response.json()
              console.log(data)
              Cookies.set('token', data.Token);
        
              if(response.status==200){
                router.push("./dashboard")
              } else {
                setError('Invalid credentials'); 
              }
      
            }catch (error) {
              console.error('Error during login:', error);
              setError('An error occurred during login');
            }
   
  };
 
  return (
    <div>
      <Head>
        <title>Monthly App</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.loginLayout}>
          <section className={styles.hero}>
            <div className={styles.brand}>
              <div className={styles.brandMark}>M</div>
              <div>
                <p className={styles.brandKicker}>Monthly</p>
                <h1 className={styles.heroTitle}>Budget clarity for real life.</h1>
                <p className={styles.heroText}>
                  Track spending, categorize essentials, and keep monthly goals in view with a calm,
                  professional dashboard.
                </p>
              </div>
            </div>
            <div className={styles.statGrid}>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Monthly plan</p>
                <p className={styles.statValue}>$3,200</p>
                <p className={styles.statMeta}>Auto-updated categories</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Savings pace</p>
                <p className={styles.statValue}>18%</p>
                <p className={styles.statMeta}>On track this month</p>
              </div>
            </div>
            <ul className={styles.featureList}>
              <li>Smart grouping by category and date.</li>
              <li>One view for expenses and insights.</li>
              <li>Clean exports for reviews.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <div>
              <h2 className={styles.cardTitle}>Sign in</h2>
              <p className={styles.cardSubtitle}>Use your Monthly account to continue.</p>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="username">Username or email</label>
                <input
                  className={styles.input}
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="password">Password</label>
                <input
                  className={styles.input}
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <button type="submit" name="login" className={styles.primaryButton}>
                Log in
              </button>
              {error && <p className={styles.errorText}>{error}</p>}
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}
