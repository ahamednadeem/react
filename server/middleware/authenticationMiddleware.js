import mysql from 'mysql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); 
    }
    //console.log('Connected to the database');
});

export const register = (req, res) => {
    const sql = "INSERT INTO users_login_details (`name`, `email`, `password`) VALUES (?)"; 
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if (err) return res.json({ Error: "Error for hashing password" });
        const values = [
            req.body.name,
            req.body.email,
            hash
        ];
        db.query(sql, [values], (err, result) => {
            if (err) return res.json({ Error: "User Already Exists..." });
            console.log("Successfully inserted data");
            return res.json({ status: "success" });
        });
    });
};

export const login = (req, res) => {
    const sql = "SELECT * FROM users_login_details WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            return res.json({ Error: "Login error in server" });
        }
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) {
                    return res.json({ Error: "Password compare error" });
                }
                if (response) {
                    const name = data[0].name;
                    const token = jwt.sign({ name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                    res.cookie('token', token);
                    return res.json({ status: "success" });
                } else {
                    return res.json({ Error: "Password does not match" });
                }
            });
        } else {
            return res.json({ Error: "Email not found" });
        }
    });
};
