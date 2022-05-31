const { body } = require('express-validator');
const validate = require('./_validate');
const db = require('../db');

module.exports = [
    body('name').notEmpty().withMessage('Name is required'),
    body('code')
        .notEmpty()
        .withMessage('Code is required')
        .custom(async value => {
            const teacher = await db.teacher.findUnique({ where: { code: value } });
            if (teacher) throw new Error('Code already taken');
        }),
    body('gender')
        .notEmpty()
        .withMessage('Gender is required')
        .isIn(['male', 'female'])
        .withMessage('Gender must be male or female'),
    body('address').notEmpty().withMessage('Address is required'),
    body('subjectId')
        .notEmpty()
        .withMessage('Subject is required')
        .toInt()
        .custom(async value => {
            const subject = await db.subject.findUnique({ where: { id: value } });
            if (!subject) throw new Error('Subject not found');
        }),
    body('userId')
        .notEmpty()
        .withMessage('User is required')
        .toInt()
        .custom(async value => {
            const user = await db.user.findUnique({ where: { id: value } });
            if (!user) throw new Error('User not found');
        }),
    validate,
];
