const { Joi } = require('express-validation');

module.exports = [
    {
        body: Joi.object({
            name: Joi.string().required(),
        }),
    },
    {
        context: true,
        keyByField: true,
    },
    {
        abortEarly: false,
        stripUnknown: true,
        errors: { wrap: { label: '[]' } },
    },
];
