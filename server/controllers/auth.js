const bcrypt = require('bcrypt');
const createError = require('http-errors');
const db = require('../db');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.me = (req, res, next) => {};
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    const user = await db.user.findUnique({
        where: { username },
    });
    if (!user) return next(createError(404, 'User not found'));

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return next(createError(401, 'Incorrect password'));

    res.json({
        message: 'Login success',
    });
};
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.logout = (req, res, next) => {
    // ! coming soon with redis
};
