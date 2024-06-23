const express = require('express');
const router = express.Router();
const verifyUser = require('../middlewares/verifyUser')
const { getComment, createComment, deleteComment, updateComment } = require('../controllers/comment.controller')

router.get('/:postId', verifyUser, getComment);

router.post('/', verifyUser, createComment)

router.delete('/:commentId', verifyUser, deleteComment);

router.put('/:commentId', verifyUser, updateComment);


module.exports = router;