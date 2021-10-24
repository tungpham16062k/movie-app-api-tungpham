const dotenv = require('dotenv');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const db = require('./config/db');
const route = require('./route');
const errorHandler = require('./app/middlewares/errorHandler');

dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to database
db.connect();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

//HTTP logger
app.use(morgan('combined'));

route(app);

app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`App listening at https://localhost:${PORT}/api`);
});