const router = require('express').Router();
const authController = require('../controllers/auth');
const errorMiddleware = require('../middlewares/error');

router.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

router.get('/auth/me', authController.me);
router.post('/auth/login', authController.login);
router.get('/auth/logout', authController.logout);

router.use(errorMiddleware.handle);

module.exports = router;
