const express = require('express');
const router = express.Router();
const verifyUser = require('../middlewares/verifyUser')
const { upload2 } = require('../middlewares/upload');

const { getAllPosts, createPost, specificPost, ownerPost, updatePost, deletePost, publishPost, unpublishPost} = require('../controllers/post.controller')

router.get('/', verifyUser, getAllPosts);

router.post('/createPost', verifyUser, upload2.single('postContent') ,createPost);

router.get('/byId/:postId', verifyUser, specificPost);

router.get('/user/:userId', verifyUser, ownerPost);

router.put('/:postId', verifyUser, upload2.single('postContent'), updatePost); 

router.delete('/:postId', verifyUser, deletePost);

router.put('/:postId/publish', verifyUser, publishPost);

router.put('/:postId/unpublish', verifyUser, unpublishPost);



module.exports = router;
