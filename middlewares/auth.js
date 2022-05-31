const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'a';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getToken = (req, res, next) => {
    req.token = req.cookies.token || req.body.token || req.query.token;
    next();
};
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getUser = (req, res, next) => {
    try {
        const token = req.token;
        const payload = jwt.verify(token, secret);

        req.user = payload.user;
    } catch {
        req.user = undefined;
    } finally {
        next();
    }
};

module.exports.auth = [getToken, getUser];
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.authGuard = (req, res, next) => {
    if (!req.user) return res.status(401).send();
    next();
};
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.adminGate = (req, res, next) => {
    if (req.user.role != 'admin') return res.status(403).send();
    next();
};
