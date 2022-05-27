const db = require('../db');
const createError = require('http-errors');

module.exports = {
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
        const id = parseInt(req.params.id);
        const subject = await db.subject.findUnique({
            where: { id },
        });

        res.json({ subject });
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
            const id = parseInt(req.params.id);
            const { name } = req.body;

            let subject = await db.subject.findUnique({
                where: { id },
            });

            if (!subject) return next(createError(404, 'Subject not found'));

            subject = await db.subject.update({
                where: { id: subject.id },
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
    delete: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            let subject = await db.subject.findUnique({
                where: { id },
            });

            if (!subject) return next(createError(404, 'Subject not found'));

            subject = await db.subject.delete({
                where: { id: subject.id },
            });

            res.status(204).send();
        } catch (err) {
            next(createError(400, err.message));
        }
    },
};
