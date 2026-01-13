import Head from 'next/head';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router'; // Import the useRouter hook

export default function Expense() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedExpenseType, setSelectedExpenseType] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Get the router object
  const handleSubmit = async (event) => {
    event.preventDefault();
    var bodyData = {};
    bodyData.expenseType = event.target.expensetype.value;
    bodyData.expenseDate = selectedDate;
    bodyData.Amount = event.target.amount.value;
    bodyData.comments = event.target.comments.value;
    const token = Cookies.get('token');

    const endpoint = '/api/expense';
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    };

    // Get verification that the user email id is valid and registered.
    const response = await fetch(endpoint, options);
    let data = await response.json();
    console.log(data);
    if (response.status == 200) {
      // Reload the page after successful submission
      router.reload();
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    console.log(token)
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          // Add any other headers if needed
        };
        const response = await axios.get('http://localhost:3000/api/category', { headers });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Head>
        <title>Monthly</title>
      </Head>
      <section className={styles.subSection}>
        <div className={styles.container}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.sectionTitle}>Enter your expense</h2>
            <table className={styles.formTable}>
              <tbody>
                <tr>
                  <th>Expense Type :</th>
                  <td>
                    <select
                      id="expensetype"
                      name="expensetype"
                      onChange={(e) => setSelectedExpenseType(e.target.value)}
                      value={selectedExpenseType}
                      required
                    >
                      <option value="" disabled>Select an Expense Type</option>
                      {data.map((expenseType) => (
                        <option key={expenseType.Name} value={expenseType.Name}>
                          {expenseType.Name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Expense Date: </th>
                  <td>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      dateFormat="yyyy-MM-dd"
                      placeholderText=""
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th>Amount: </th>
                  <td><input type="text" id="amount" name="amount" required /></td>
                </tr>
                <tr>
                  <th>Comments: </th>
                  <td><input type="text" id="comments" name="comments" required /></td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <input type="submit" name="Add" value="Add" className={styles.submitButton} />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </section>
    </div>
  );
}
