import mysql from 'mysql';


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
        process.exit(1); 
    }
    console.log('Connected to the database');
});

export const viewRecords = (req, res) => {
    const sql = 'SELECT * from users_data';
    db.query(sql, (err, data) => {
        if (err) return res.json({ message: 'Error', error: err });
        return res.json(data);
    });
};

export const createRecord = (req, res) => {
    const { name, email, phone } = req.body;

    // Check if email or phone already exists
    const checkSql = 'SELECT * FROM users_data WHERE email = ? OR phone = ?';
    db.query(checkSql, [email, phone], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error checking existing data', error: err.message });

        if (results.length > 0) {
            // If email or phone exists, return appropriate error message
            const errors = {};
            if (results.some(user => user.email === email)) {
                errors.email = 'Email already exists';
            }
            if (results.some(user => user.phone === phone)) {
                errors.phone = 'Phone already exists';
            }
            return res.status(400).json({ errors });
        }

        // Proceed with database operation if email and phone are unique
        const sql = 'INSERT INTO users_data (name, email, phone) VALUES (?, ?, ?)';
        const values = [name, email, phone];
        db.query(sql, values, (err, data) => {
            if (err) {
                console.error('Error inserting data:', err.message);
                return res.status(500).json({ message: 'Error inserting data', error: err.message });
            }
            console.log('Successfully inserted data');
            return res.json(data);
        });
    });
};

export const updateRecord = (req, res) => {
    const { name, email, phone } = req.body;
    const userId = req.params.id;

    // First, check if the email or phone already exists in another record
    const checkSql = 'SELECT * FROM users_data WHERE (email = ? OR phone = ?) AND id != ?';
    db.query(checkSql, [email, phone, userId], (err, results) => {
        if (err) {
            console.error('Error checking existing data:', err.message);
            return res.status(500).json({ message: 'Error checking existing data', error: err.message });
        }

        if (results.length > 0) {
            // If email or phone exists in another record, return appropriate error message
            const errors = {};
            if (results.some(user => user.email === email)) {
                errors.email = 'Email already exists';
            }
            if (results.some(user => user.phone === phone)) {
                errors.phone = 'Phone already exists';
            }
            return res.status(400).json({ errors });
        }

        // Proceed with the update operation if email and phone are unique
        const updateSql = 'UPDATE users_data SET name = ?, email = ?, phone = ? WHERE id = ?';
        const values = [name, email, phone, userId];
        db.query(updateSql, values, (err, data) => {
            if (err) {
                console.error('Error updating data:', err.message);
                return res.status(500).json({ message: 'Error updating data', error: err.message });
            }
            return res.json({ message: 'Record updated successfully', data });
        });
    });
};


export const deleteRecord = (req, res) => {
    const sql = 'DELETE FROM users_data WHERE id = ?';
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) return res.json({ message: 'Error', error: err });
        return res.json(data);
    });
};

export const getrecord = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM users_data WHERE id = ?";
    db.query(sql, [id], (err, data) => {
        if (err)
            return res.json({ message: 'Error', error: err });
        return res.json(data);
    });
};

export const searchRecords = (req, res) => {
    const searchTerm = req.query.q;
    const query = `SELECT * FROM users_data WHERE name LIKE ?`;
    db.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  };
