module.exports.handle = (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message || 'Something went wrong',
    });
};