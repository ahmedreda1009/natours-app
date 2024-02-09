const AppError = require('./../utils/AppError');

const handleCastErrorDB = (err) => {
    const message = `Invalid  ${err.path}: ${err.value}`;
    const error = new AppError(400, message);
    return error;
}

const handleDuplicateFieldDB = (err) => {
    const objKey = Object.keys(err.keyValue)[0];
    const objValue = err.keyValue[objKey];

    const message = `Value of '${objKey}' can not be '${objValue}', because it is duplication.`;
    const error = new AppError(400, message);
    return error;
}

const handleValidationErrorDB = (err) => {
    let message = Object.values(err.errors).map(err => err.message);
    message = message.join(" ");
    message += ".";

    const error = new AppError(400, message);
    return error;
}

const sendErrorProd = (res, err) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error('Error', err);

        res.status(500).json({
            status: 'Error',
            message: "something went wrong."
        });
    }
}

const sendErrorDev = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
}

// EXPRESS GLOBAL ERROR HANDLER
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';
    err.message = err.message || 'Something Went Wrong!';

    if (process.env.NODE_ENV.trim() === 'development') {
        sendErrorDev(res, err);
    } else if (process.env.NODE_ENV.trim() === 'production') {
        let error = { ...err, name: err.name };

        // param is valid but not found 
        if (err.name === 'CastError') {
            error = handleCastErrorDB(err);
        }

        if (err.code === 11000) {
            error = handleDuplicateFieldDB(err);
        }

        if (err.name === 'ValidationError') {
            error = handleValidationErrorDB(err);
        }

        sendErrorProd(res, error);
    }

    next();
}