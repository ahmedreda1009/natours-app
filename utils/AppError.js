class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? 'Fail' : 'Error';
        this.isOperational = true;
        // Ensure the name is always set to 'AppError'
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;