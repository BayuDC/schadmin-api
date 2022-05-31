const router = require('express').Router();
const { validate } = require('express-validation');
const subjectController = require('../../controllers/subject');
const subjectValidation = require('../../validations/subject');
const { authGuard, adminGate } = require('../../middlewares/auth');

router.use(authGuard);

router.param('subjectId', subjectController.load);
router.get('/', subjectController.index);
router.get('/:subjectId', subjectController.show);
router.post('/', adminGate, validate(...subjectValidation), subjectController.store);
router.put('/:subjectId', adminGate, validate(...subjectValidation), subjectController.update);
router.delete('/:subjectId', adminGate, subjectController.delete);

module.exports = router;
