const { ValidationError } = require('express-validation');

module.exports.handle = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            message: 'Validation failed',
            details: err.details,
        });
    }

    res.status(err.status || 500);
    res.json({
        message: err.message || 'Something went wrong',
    });
};
