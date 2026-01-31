import mongoClient from'../../api-lib/db/mongodb'
import validateToken from'../../api-lib/auth/authorization'

export default async function expenseHandler(req, res) {

const token = req.headers.authorization;

     // Validate the token using the function from the auth module
    if (!validateToken(token)) {
        return res.status(401).json({ error: 'Unauthorized - Missing or Invalid token' });
    }
   
    var mongoclnt=await mongoClient
    const collectionName = 'expense';
    var insertedExpense;
    var db=mongoclnt.db('BUDGET-DB');

    if (req.method === 'GET') {
        const { month, startDate, endDate } = req.query;
        const filter = {};

        let rangeStart;
        let rangeEnd;

        if (month) {
            const [year, monthValue] = month.split('-').map((value) => parseInt(value, 10));
            if (!Number.isNaN(year) && !Number.isNaN(monthValue)) {
                rangeStart = new Date(year, monthValue - 1, 1);
                rangeEnd = new Date(year, monthValue, 0, 23, 59, 59, 999);
            }
        } else {
            if (startDate) {
                rangeStart = new Date(startDate);
            }
            if (endDate) {
                rangeEnd = new Date(endDate);
            }
        }

        if (rangeStart || rangeEnd) {
            filter.expenseDate = {};
            if (rangeStart) filter.expenseDate.$gte = rangeStart;
            if (rangeEnd) filter.expenseDate.$lte = rangeEnd;
        }

        const transactions = await db
            .collection(collectionName)
            .find(filter)
            .sort({ expenseDate: -1, createdDate: -1 })
            .toArray();

        return res.status(200).json(transactions);
    }

    if(req.method==='POST'){
        const payload = req.body;
        const expenses = Array.isArray(payload?.expenses)
            ? payload.expenses
            : Array.isArray(payload)
                ? payload
                : [payload];

        const now = new Date();
        const normalized = expenses.map((expense) => {
            const doc = { ...expense };
            if (doc.Amount !== undefined && doc.Amount !== null && doc.Amount !== '') {
                doc.Amount = parseFloat(doc.Amount);
            }
            if (doc.expenseDate) {
                doc.expenseDate = new Date(doc.expenseDate);
            }
            if (!doc.expenseDate) {
                delete doc.expenseDate;
            }
            if (!doc.comments) {
                delete doc.comments;
            }
            doc.createdDate = now;
            return doc;
        }).filter((doc) => doc.expenseType && !Number.isNaN(doc.Amount));

        if (normalized.length === 0) {
            return res.status(400).json({ error: 'No valid expenses to insert.' });
        }

        if (normalized.length === 1) {
            insertedExpense = await db.collection(collectionName).insertOne(normalized[0]);
        } else {
            insertedExpense = await db.collection(collectionName).insertMany(normalized);
        }
    }

    return res.status(200).json(insertedExpense)
  }
  
