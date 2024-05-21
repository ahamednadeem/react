import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
}));
app.use(morgan('dev'));

import routes from './routes/user.js';

app.use('/', routes);

const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`Listening on port ${port}`));