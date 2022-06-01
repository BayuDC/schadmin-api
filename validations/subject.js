const { body } = require('express-validator');
const validate = require('./_validate');

module.exports = [
    body('name').notEmpty().withMessage('Name is required').isString().trim(),
    validate,
    //
];
