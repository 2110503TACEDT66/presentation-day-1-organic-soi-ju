const express = require('express');

const {register, login, logout, getMe, getUsers} = require('../controllers/auth');

const {protect, authorize} = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect ,getMe);
router.get('/logout', logout);
router.get('/users', protect, authorize('admin'), getUsers);



module.exports = router;