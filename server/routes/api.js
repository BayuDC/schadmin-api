const router = require('express').Router();
const authController = require('../controllers/auth');
const errorMiddleware = require('../middlewares/error');
const { auth, authGuard } = require('../middlewares/auth');

router.use(auth);

router.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

router.get('/auth', authGuard, (req, res) => res.send());
router.get('/auth/me', authGuard, authController.me);
router.post('/auth/login', authController.login);
router.get('/auth/logout', authController.logout);

router.use(errorMiddleware.handle);

module.exports = router;
