const express = require('express');
const router= express.Router();

const authcontroller = require('../controllers/auth.controller');

router.post('/register',authcontroller.register)

router.post('/login',authcontroller.login)

router.post('/refresh-token',authcontroller.refreshToken)

router.delete('/logout',authcontroller.logout)

module.exports = router;