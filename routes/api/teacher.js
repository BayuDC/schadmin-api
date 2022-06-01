const router = require('express').Router();
const teacherController = require('../../controllers/teacher');
const { authGuard, adminGate } = require('../../middlewares/auth');

router.use(authGuard);

router.param('teacherId', teacherController.load);
router.get('/', teacherController.index);
router.get('/:teacherId', teacherController.show);
router.post('/', adminGate, teacherController.store);
router.put('/:teacherId', adminGate, teacherController.update);
router.delete('/:teacherId', adminGate, teacherController.destroy);

module.exports = router;
