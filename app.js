const express = require('express');
const cookie = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/web'));
app.use('/api', require('./routes/api'));

app.listen(port, () => {
    console.log(`Server started on port`, port);
});
