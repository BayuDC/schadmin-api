const router = require('express').Router();

const authController = require('../controllers/auth');
const subjectController = require('../controllers/subject');

const errorMiddleware = require('../middlewares/error');
const { auth, authGuard, adminGate } = require('../middlewares/auth');

router.use(auth);

router.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

router.get('/auth', authGuard, (req, res) => res.send());
router.get('/auth/me', authGuard, authController.me);
router.post('/auth/login', authController.login);
router.get('/auth/logout', authGuard, authController.logout);

router.use(authGuard);

router.get('/subject', subjectController.index);
router.get('/subject/:id', subjectController.show);
router.post('/subject', adminGate, subjectController.store);
router.put('/subject/:id', adminGate, subjectController.update);
router.delete('/subject/:id', adminGate, subjectController.delete);

router.use(errorMiddleware.handle);

module.exports = router;
