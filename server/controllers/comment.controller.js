const { Post, Users, Comments } = require('../models');

const getComment = async (req, res) => {
    const postId = req.params.postId;
    try{
        const comments = await Comments.findAll({ where: { postId: postId }});
        return res.status(200).json({comments})
    }catch(err){
        console.log(err)
    }
}

const createComment = async (req, res) => {
    const {commentBody, postId} = req.body

    try{

        const user = await Users.findOne({ where: { userId: req.userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const newComment = await Comments.create({
            commentBody,
            postId,
            userId: req.userId,
            username: user.username
        });

        return res.status(201).json({message: 'comment created', newComment});
    }catch(err){
        return res.status(500).json({error: err})
    }   
}
const deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.userId;

    try {

        const comment = await Comments.findByPk(commentId);
        console.log(`${comment.userId}`)
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const post = await Post.findByPk(comment.postId);
        if (comment.userId !== userId && post.userId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }

        await comment.destroy();
        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error('Error deleting comment:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateComment = async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.userId;
    const { commentBody } = req.body;
  try {
    console.log(`comment ID ==== ${commentId}`)
    console.log(`qqqqqqqqqqqq ${userId}`)


    const comment = await Comments.findByPk(commentId);
        console.log(`${comment.userId}`)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this comment' });
    }
   


    comment.commentBody = commentBody;
    await comment.save();

    return res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (err) {
    console.error('Error updating comment:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getComment , createComment, deleteComment, updateComment}