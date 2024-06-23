const express = require('express');
const router = express.Router();
const { getUserDetails , updateUserDetails, updateProfilePicture, updatePassword } = require('../controllers/user.controller');
const verifyUser = require('../middlewares/verifyUser');
const { upload1 } = require('../middlewares/upload');

router.get('/:userId', verifyUser, getUserDetails);
router.put('/:userId', verifyUser, updateUserDetails);
router.put('/:userId/picture', verifyUser, upload1.single('picturePath'), updateProfilePicture);
router.put('/:userId/password', verifyUser, updatePassword);
module.exports = router;
