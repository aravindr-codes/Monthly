import mongoClient from "../../api-lib/db/mongodb";
import validateToken from'../../api-lib/auth/authorization'
export default async function categoryHandler(req, res) {

 /* const token = req.headers.authorization;
  if (!validateToken(token)) {
    return res.status(401).json({ error: 'Unauthorized - Missing or Invalid token' });
}*/
  var mongoclnt = await mongoClient;
  const collectionName = "Category";
  var expenseCategories=[]
  if (req.method === "GET") {
    var db = mongoclnt.db('BUDGET-DB');
    const projection={"Name":1}
    expenseCategories = await db
      .collection(collectionName).find({},projection)
      .toArray();
  }
  res.status(200).json(expenseCategories);
}
