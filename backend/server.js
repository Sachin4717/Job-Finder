const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const jobs = require('./routes/jobs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.use('/api/jobs', jobs);

app.get('/', (req, res) => res.send('Job Finder API Running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));