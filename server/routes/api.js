const router = require('express').Router();
const authController = require('../controllers/auth');

router.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

router.get('/auth/me', authController.me);
router.get('/auth/login', authController.login);
router.get('/auth/logout', authController.logout);

module.exports = router;
