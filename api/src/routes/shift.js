const express = require('express');
const router = express.Router();

const Shift = require('../controllers/shiftController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');

router.post('/create', Shift.create);
//router.post('/create', checkAuth, accessRules, Shift.create);
router.get('/find', checkAuth, accessRules, Shift.find);
router.post('/update', checkAuth, accessRules, Shift.update);
router.get('/delete', checkAuth, accessRules, Shift.delete);


router.post('/findByFilter', checkAuth, accessRules, Shift.findByFilter);


router.get('/', accessRules, Shift.list);

module.exports = router;
