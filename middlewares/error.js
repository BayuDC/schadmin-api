const { ValidationError } = require('express-validation');
const createError = require('http-errors');

module.exports.notFound = (req, res, next) => {
    next(createError(404));
};
module.exports.handle = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            message: 'Validation failed',
            details: err.details,
        });
    }

    res.status(err.status || 500);
    res.json({
        message: err.message || err.statusText || 'Something went wrong',
    });
};
