const express = require('express');
const { register, login, logout, getUserInfo, sendPasswordResetEmail, resetPassword } = require('../controllers/auth.controller');
const router = express.Router();
const { upload1 } = require('../middlewares/upload');
const verifyUser = require('../middlewares/verifyUser');

router.post('/register', upload1.single('picturePath'), register);

router.post('/login', login);

router.post('/logout', logout);

router.get('/me', verifyUser, getUserInfo);

router.post('/forgot-password', sendPasswordResetEmail);

router.post('/reset-password', resetPassword);

module.exports = router;
