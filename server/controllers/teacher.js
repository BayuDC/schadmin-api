const db = require('../db');
const createError = require('http-errors');

module.exports = {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @param {string} id
     */
    async load(req, res, next, id) {
        const teacher = await db.teacher.findUnique({
            where: { id: parseInt(id) },
        });

        if (!teacher) return next(createError(404, 'Teacher not found'));

        req.teacher = teacher;
        next();
    },
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    async index(req, res, next) {
        const teachers = await db.teacher.findMany({
            select: { id: true, name: true, code: true },
        });

        res.json({ teachers });
    },
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    async show(req, res, next) {
        const teacher =
            req.query.full === undefined
                ? req.teacher
                : await db.teacher.findUnique({
                      where: { id: req.teacher.id },
                      select: {
                          id: true,
                          name: true,
                          code: true,
                          gender: true,
                          address: true,
                          user: true,
                          subject: true,
                      },
                  });

        res.json({ teacher });
    },
};
