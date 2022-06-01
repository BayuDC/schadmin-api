const router = require('express').Router();
const subjectController = require('../../controllers/subject');
const subjectValidation = require('../../validations/subject');
const { authGuard, adminGate } = require('../../middlewares/auth');

router.use(authGuard);

router.param('subjectId', subjectController.load);
router.get('/', subjectController.index);
router.get('/:subjectId', subjectController.show);
router.post('/', adminGate, subjectValidation, subjectController.store);
router.put('/:subjectId', adminGate, subjectValidation, subjectController.update);
router.delete('/:subjectId', adminGate, subjectController.destroy);

module.exports = router;
