module.exports = {
    options: {
        context: true,
        keyByField: true,
    },
    joiOptions: {
        abortEarly: false,
        stripUnknown: true,
        errors: { wrap: { label: '[]' } },
    },
};
