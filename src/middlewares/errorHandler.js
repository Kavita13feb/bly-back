// errorHandler.js
function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const error= err.stack;
    // Log the error (consider using a logging library like Winston)
    // console.error(err.stack);
    
    res.status(statusCode).json({
        status: "failed",
        message: message,
        // error: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
}

module.exports = errorHandler;
