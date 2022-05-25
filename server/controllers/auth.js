const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const db = require('../db');

const secret = process.env.JWT_SECRET || 'a';

const createToken = user => {
    const payload = {
        user: {
            id: user.id,
            username: user.username,
        },
    };
    const options = { expiresIn: 24 * 60 * 60 };

    const token = jwt.sign(payload, secret, options);

    return token;
};

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

    const token = createToken(user);

    res.json({
        message: 'Login success',
        token,
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
