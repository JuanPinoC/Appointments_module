const express = require('express');
const router = express.Router();

const HealthCenter = require('../controllers/healthCenterController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');


router.post('/create', HealthCenter.create);
//router.post('/create', checkAuth, accessRules, HealthCenter.create);
router.get('/find', checkAuth, accessRules, HealthCenter.find);
router.post('/update', checkAuth, accessRules, HealthCenter.update);
router.get('/delete', checkAuth, accessRules, HealthCenter.delete);


router.get('/', HealthCenter.list);


module.exports = router;