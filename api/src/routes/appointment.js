const express = require('express');
const router = express.Router();

const Appointment = require('../controllers/appointmentController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');


router.post('/create', checkAuth, accessRules, Appointment.create);
router.get('/find', checkAuth, accessRules, Appointment.find);
router.post('/update', checkAuth, accessRules, Appointment.update);
router.get('/delete', checkAuth, accessRules, Appointment.delete);


router.get('/', Appointment.list);


module.exports = router;