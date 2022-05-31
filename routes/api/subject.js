const router = require('express').Router();
const subjectController = require('../../controllers/subject');
const subjectValidator = require('../../validations/subject');
const { authGuard, adminGate } = require('../../middlewares/auth');

router.use(authGuard);

router.param('subjectId', subjectController.load);
router.get('/', subjectController.index);
router.get('/:subjectId', subjectController.show);
router.post('/', adminGate, subjectValidator, subjectController.store);
router.put('/:subjectId', adminGate, subjectValidator, subjectController.update);
router.delete('/:subjectId', adminGate, subjectController.delete);

module.exports = router;
