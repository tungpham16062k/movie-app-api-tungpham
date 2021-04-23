const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Connect db successfully!!!");
    } catch (error) {
        console.log("Connect db failure!!!");
    };
    
}

module.exports = { connect };
