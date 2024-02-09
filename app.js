const express = require('express');
const morgan = require('morgan');
const tourRoute = require('./routes/toursRoute');
const userRoute = require('./routes/usersRoute');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorControllers');

const app = express();

// use middleware to be able to make post
// withour middleware we can not recieve the data from clinet side.
app.use(express.json()); // this is middleware

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// serving static files
app.use(express.static(`${__dirname}/public`));

// middlewares
// in middlewares the order of them is matter
// middlewares are such pipline between request and response
// we must call the next function.
app.use((req, res, next) => {
    console.log('my first middleware');
    // we must call the next function or request will not proceed
    next();
});
app.use((req, res, next) => {
    // add data to the request
    req.requestedAt = new Date().toISOString();
    console.log('my second middleware');
    // we must call the next function or request will not proceed
    next();
});
// in middlewares the order of them is matter
// so the getTours and makeTour won't see this middleware
// and the getTours and updateTour and deleteTour will see it
// middleware ends when it hit res.end();
app.use((req, res, next) => {
    console.log('my third middleware');
    // we must call the next function or request will not proceed
    next();
});

// routes
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

// handle unhandled routes
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 404,
    //     message: `Path: ${req.originalUrl} Not Found.`
    // });

    // const err = new Error(`Path ${req.originalUrl} not found`);
    // err.statusCode = 404;
    // err.status = 'Not Found';

    const err = new AppError(404, `Path ${req.originalUrl} not found`);

    // express understand that any argument passed to next() is an error.
    next(err);
});

// EXPRESS GLOBAL ERROR HANDLER
// define the global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
