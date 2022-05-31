const router = require('express').Router();
const { validate } = require('express-validation');

const authController = require('../../controllers/auth');
const { authGuard } = require('../../middlewares/auth');

router.get('/', authGuard, (req, res) => res.send());
router.get('/me', authGuard, authController.me);
router.post('/login', authController.login);
router.post('/logout', authGuard, authController.logout);

module.exports = router;
