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
    if(req.method==='POST'){
        var db=mongoclnt.db('BUDGET-DB');
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
    res.status(200).json(insertedExpense)
  }
  
