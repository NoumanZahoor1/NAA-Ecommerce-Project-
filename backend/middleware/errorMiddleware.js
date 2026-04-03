
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Handle Mongoose Cast Error (invalid ID)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Resource not found. Invalid: ${err.path}`;
    }

    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Handle Mongoose duplicate key error (MongoError code 11000)
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    console.error('Error Handler Caught:', {
        message: err.message,
        name: err.name,
        code: err.code,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    });

    res.status(statusCode);
    res.json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        errors: err.errors
    });
};

export { notFound, errorHandler };
