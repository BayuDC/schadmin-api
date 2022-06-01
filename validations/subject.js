const { body } = require('express-validator');
const validate = require('./_validate');

module.exports = validate([
    body('name').notEmpty().withMessage('Name is required').isString().trim(),
    //
]);
