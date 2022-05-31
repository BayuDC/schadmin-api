const { body } = require('express-validator');
const vallidate = require('./_validate');

module.exports = [
    body('name').notEmpty().withMessage('Subject name is required').isString().trim(),
    vallidate,
    //
];
