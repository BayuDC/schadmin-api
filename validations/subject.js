const { Joi } = require('express-validation');
const { options, joiOptions } = require('./config');

module.exports = [
    {
        body: Joi.object({
            name: Joi.string().required(),
        }),
    },
    options,
    joiOptions,
];
