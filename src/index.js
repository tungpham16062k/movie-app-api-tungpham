const dotenv = require('dotenv');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const db = require('./config/db');
const route = require('./route');
const errorHandler = require('./app/middlewares/errorHandler');
const fs = require('fs');
const https = require('https');

app.use(cors());
dotenv.config();
const PORT = process.env.PORT || 5000;

// const privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
// const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
// const credentials = { key: privateKey, cert: certificate };

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
    console.log(`App listening at http://localhost:${PORT}/`);
});

// const server = https.createServer(credentials, app);

// server.listen(PORT, () => {
//     console.log(`App listening: https://localhost:${PORT}/api`);
// });

