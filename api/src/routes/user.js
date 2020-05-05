const express = require('express');
const router = express.Router();

const User = require('../controllers/userController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');

router.post('/create', checkAuth, accessRules, User.create);
router.get('/find', checkAuth, accessRules, User.find);
router.post('/update', checkAuth, accessRules, User.update);
router.get('/delete', checkAuth, accessRules, User.delete);
router.post('/login',User.login);

router.get('/findOwn', checkAuth, accessRules, User.findOwn);
router.post('/findDoctorsByFilter', checkAuth, accessRules, User.findDoctorsByFilter);


router.get('/', accessRules, User.list);

module.exports = router;
