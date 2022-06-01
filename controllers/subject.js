const db = require('../db');
const createError = require('http-errors');

module.exports = {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @param {string} id
     */
    load: async (req, res, next, id) => {
        const subject = await db.subject.findUnique({
            where: { id: parseInt(id) },
        });

        if (!subject) return next(createError(404, 'Subject not found'));

        req.subject = subject;
        next();
    },
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    index: async (req, res, next) => {
        const subjects = await db.subject.findMany();

        res.json({ subjects });
    },
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    show: async (req, res, next) => {
        res.json({
            subject: req.subject,
        });
    },
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    store: async (req, res, next) => {
        try {
            const { name } = req.body;

            const subject = await db.subject.create({
                data: {
                    name,
                },
            });

            res.status(201).json({ subject });
        } catch (err) {
            next(createError(400, err.message));
        }
    },
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    update: async (req, res, next) => {
        try {
            const { name } = req.body;

            const subject = await db.subject.update({
                where: { id: req.subject.id },
                data: {
                    name,
                },
            });

            res.json({ subject });
        } catch (err) {
            next(createError(400, err.message));
        }
    },
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    destroy: async (req, res, next) => {
        try {
            await db.subject.delete({
                where: { id: req.subject.id },
            });

            res.status(204).send();
        } catch (err) {
            next(createError(400, err.message));
        }
    },
};
