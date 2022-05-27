const router = require('express').Router();
const { validate } = require('express-validation');

const authController = require('../controllers/auth');
const subjectController = require('../controllers/subject');

const subjectValidation = require('../validations/subject');

const errorMiddleware = require('../middlewares/error');
const { auth, authGuard, adminGate } = require('../middlewares/auth');

router.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

router.use(auth);

router.get('/auth', authGuard, (req, res) => res.send());
router.get('/auth/me', authGuard, authController.me);
router.post('/auth/login', authController.login);
router.get('/auth/logout', authGuard, authController.logout);

router.use(authGuard);

router.param('subjectId', subjectController.load);
router.get('/subject', subjectController.index);
router.get('/subject/:subjectId', subjectController.show);
router.post('/subject', adminGate, validate(...subjectValidation), subjectController.store);
router.put('/subject/:subjectId', adminGate, validate(...subjectValidation), subjectController.update);
router.delete('/subject/:subjectId', adminGate, subjectController.delete);

router.use(errorMiddleware.handle);

module.exports = router;
