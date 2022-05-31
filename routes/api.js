const router = require('express').Router();

const authRouter = require('./api/auth');
const subjectRouter = require('./api/subject');
const teacherRouter = require('./api/teacher');

const errorMiddleware = require('../middlewares/error');
const { auth } = require('../middlewares/auth');

router.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

router.use(auth);

router.use('/auth', authRouter);
router.use('/subjects', subjectRouter);
router.use('/teacher', teacherRouter);

router.use(errorMiddleware.notFound);
router.use(errorMiddleware.handle);

module.exports = router;
