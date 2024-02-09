const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// uncaught Exception handler here in this place
// to run before everything and catch the errors
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception! Shutting Down...");
    console.log(err.name, err.message);
    process.exit(1);
})

const app = require('./app');

// local db
// const LOCAL_DB = process.env.LOCAL_DATABASE;
// mongoose.connect(LOCAL_DB).then(_ => console.log('LocalDB connected successfully...'));

// atlas db
const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);
mongoose.connect(DB).then(_ => console.log('DB CONNECTED SUCCESSFULLY!!'));

// console.log(process.env);

// const tourSchema = mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'A tour must have a name.'],
//         unique: true
//     },
//     rating: {
//         type: Number,
//         default: 4.5
//     }
//     , price: {
//         type: Number,
//         required: [true, 'A tour must have a price.']
//     }
// });

// const Tour = mongoose.model('Tour', tourSchema);

// const testTour = new Tour({
//     name: 'Test Tour Two',
//     rating: 3.8,
//     price: 900
// });
// testTour.save().then(doc => console.log(doc)).catch(err => console.log(err));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`APP IS RUNNING ON PORT ${port}...`);
});

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection! Shutting Down...");
    console.log(err.name, err.message);

    server.close(() => {
        process.exit(1);
    });
});

