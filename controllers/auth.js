const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const db = require('../db');

const secret = process.env.JWT_SECRET || 'a';
const oneDay = 24 * 60 * 60;

const createToken = user => {
    const payload = { user };
    const options = { expiresIn: oneDay };

    return jwt.sign(payload, secret, options);
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.me = (req, res, next) => {
    res.json({
        user: req.user,
    });
};
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    const user = await db.user.findUnique({
        where: { username: username || '' },
    });
    if (!user) return next(createError(404, 'User not found'));

    const auth = await bcrypt.compare(password || '', user.password);
    if (!auth) return next(createError(401, 'Incorrect password'));

    delete user.password;

    const token = createToken(user);

    res.cookie('token', token, { httpOnly: true, maxAge: oneDay * 1000 });
    res.json({
        message: 'Login success',
        user,
        token,
    });
};
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.logout = (req, res, next) => {
    res.cookie('token', '', { maxAge: 0 });
    res.send({
        message: 'Logout success',
    });
};
