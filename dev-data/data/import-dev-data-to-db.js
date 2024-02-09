const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

// connect to local DB
const LOCAL_DB = process.env.LOCAL_DATABASE;
mongoose.connect(LOCAL_DB).then(_ => console.log('LocalDB connected successfully...'));

// Connect to DB
// const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);

// mongoose.connect(DB).then(_ => console.log('DB CONNECTED TO START IMPORTING DATA!'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importToDB = async () => {
    try {
        await Tour.create(tours);
        console.log('DATA LOADED SUCCESSFULLY!');
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

const clearDB = async () => {
    try {
        await Tour.deleteMany();
        console.log('DB CLEARED SUCCESSFULLY!');
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

const order = process.argv[2];
if (order === '--import-to-db') {
    importToDB();
} else if (order === '--clear-db') {
    clearDB();
}