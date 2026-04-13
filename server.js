import express from 'express';
import dbPool from './newDatabaseConnection.js'; 
const app = express();
app.use(express.json());

app.get('/bankAPI/transactions/:search', async (req, res) => {
  const search = req.params.search;
  try {
    const query = `SELECT * FROM payments WHERE dateTime LIKE ? OR IBAN_sender = ? OR IBAN_receiver = ?`;
    const [results] = await dbPool.query(query, [`%${search}%`, search, search]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ status_code: 600, status_msg: 'Грешка в базата данни' });
  }
});
app.listen(5000);
