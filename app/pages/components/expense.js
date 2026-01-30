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
  const [csvFile, setCsvFile] = useState(null);
  const [csvMessage, setCsvMessage] = useState('');
  const router = useRouter(); // Get the router object
  const handleSubmit = async (event) => {
    event.preventDefault();
    var bodyData = {};
    bodyData.expenseType = event.target.expensetype.value;
    if (selectedDate) {
      bodyData.expenseDate = selectedDate;
    }
    bodyData.Amount = event.target.amount.value;
    if (event.target.comments.value) {
      bodyData.comments = event.target.comments.value;
    }
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

  const parseCsv = (text) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length === 0) return [];

    const parseLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (char === '"') {
          const next = line[i + 1];
          if (inQuotes && next === '"') {
            current += '"';
            i += 1;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const header = parseLine(lines[0]).map((value) => value.toLowerCase());
    const getIndex = (names) => header.findIndex((col) => names.includes(col));

    const idxType = getIndex(['expensetype', 'expense type', 'type']);
    const idxDate = getIndex(['expensedate', 'expense date', 'date']);
    const idxAmount = getIndex(['amount', 'amt']);
    const idxComments = getIndex(['comments', 'comment', 'notes', 'note']);

    return lines.slice(1).map((line) => {
      const fields = parseLine(line);
      const expense = {};
      if (idxType >= 0) expense.expenseType = fields[idxType];
      if (idxDate >= 0 && fields[idxDate]) expense.expenseDate = fields[idxDate];
      if (idxAmount >= 0) expense.Amount = fields[idxAmount];
      if (idxComments >= 0 && fields[idxComments]) expense.comments = fields[idxComments];
      return expense;
    }).filter((row) => row.expenseType && row.Amount);
  };

  const handleCsvUpload = async () => {
    setCsvMessage('');
    if (!csvFile) {
      setCsvMessage('Please choose a CSV file.');
      return;
    }

    try {
      const text = await csvFile.text();
      const expenses = parseCsv(text);
      if (expenses.length === 0) {
        setCsvMessage('No valid rows found in the CSV.');
        return;
      }

      const token = Cookies.get('token');
      const response = await fetch('/api/expense', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expenses }),
      });

      const result = await response.json();
      if (!response.ok) {
        setCsvMessage(result?.error || 'CSV upload failed.');
        return;
      }

      setCsvMessage(`Uploaded ${result?.insertedCount ?? expenses.length} expenses.`);
      router.reload();
    } catch (error) {
      console.error('CSV upload error:', error);
      setCsvMessage('CSV upload failed.');
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    console.log(token)
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`, // need   to pass token in header
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
                      placeholderText="Select a date"
                      className={styles.input}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Amount: </th>
                  <td><input type="text" id="amount" name="amount" required /></td>
                </tr>
                <tr>
                  <th>Comments: </th>
                  <td><input type="text" id="comments" name="comments" /></td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <input type="submit" name="Add" value="Add" className={styles.submitButton} />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={styles.helper}>
              Upload a CSV with columns: expenseType, expenseDate, amount, comments (date and comments optional).
            </div>
            <div className={styles.field}>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(event) => setCsvFile(event.target.files?.[0] || null)}
              />
              <button type="button" onClick={handleCsvUpload} className={styles.primaryButton}>
                Upload CSV
              </button>
            </div>
            {csvMessage && <p className={styles.helper}>{csvMessage}</p>}
          </form>
        </div>
      </section>
    </div>
  );
}
