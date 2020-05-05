const express = require('express');
const router = express.Router();

const Specialty = require('../controllers/specialtyController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');


router.post('/create', checkAuth, accessRules, Specialty.create);
router.get('/find', checkAuth, accessRules, Specialty.find);
router.post('/update', checkAuth, accessRules, Specialty.update);
router.get('/delete', checkAuth, accessRules, Specialty.delete);


router.get('/', Specialty.list);


module.exports = router;