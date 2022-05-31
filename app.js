const express = require('express');
const cookie = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/web'));
app.use('/api', require('./routes/api'));

module.exports = app;
