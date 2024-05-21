import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const port = process.env.PORT || 3030;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'developmentdb',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the process with a failure code
    }
    console.log('Connected to the database');
});

app.get('/', (req, res) => {
    const sql = 'SELECT * from users_data';
    db.query(sql, (err, data) => {
        if (err) return res.json({ message: 'Error', error: err });
        return res.json(data);
    });
});

app.post('/create', (req, res) => {
    console.log("In server create request");
    const sql = 'INSERT INTO users_data (name, email, phone) VALUES (?, ?, ?)';
    const values = [
        req.body.name,
        req.body.email,
        req.body.phone
    ];
    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Error inserting data:", err.message); // Log the actual error message
            return res.status(500).json({ message: 'Error inserting data', error: err.message }); // Return an appropriate error response
        }
        console.log("Successfully inserted data");
        return res.json(data);
    });
});


app.put('/update/:id', (req, res) => {
    const sql = 'UPDATE users_data SET name = ?, email = ?, phone = ? WHERE id = ?';
    const values = [
        req.body.name,
        req.body.email,
        req.body.phone,
    ];
    const id = req.params.id;

    db.query(sql, [...values, id], (err, data) => {
        if (err) return res.json({ message: 'Error', error: err });
        return res.json(data);
    });
});

app.delete('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM users_data WHERE id = ?';
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) return res.json({ message: 'Error', error: err });
        return res.json(data);
    });
});

app.get('/getrecord/:id', (req, res) => {
    console.log("in here getrecord")
    const id = req.params.id;
    const sql = "select * from users_data where id= ?"
    db.query(sql, [id], (err, data) => {
        if (err)
            return res.json({ message: 'Error', error: err });
        return res.json(data);
    });
})

app.listen(port, () => console.log(`Listening on port ${port}`));