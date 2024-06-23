const { Post, Users } = require('../models');
const { Op } = require('sequelize');

const getAllPosts = async (req, res) => {
    const { search } = req.query;

    const whereClause = {
        published: true,
    };

    if (search) {
        whereClause[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { postDescription: { [Op.like]: `%${search}%` } },
            { tags: { [Op.like]: `%${search}%` } }
        ];
    }

    try {
        const allPosts = await Post.findAll({
            where: whereClause,
            include: [
                { model: Users, attributes: ['username'] }
            ],
            order: [['createdAt', 'DESC']], 
        });
        return res.json(allPosts);
    } catch (err) {
        console.error('Error fetching posts:', err.message);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
const createPost = async (req, res) => {
    try {
        console.log('UserId:', req.userId);

        const { title, postDescription, tags } = req.body; 
        const postContent = req.file ? `assets/posts/${req.file.filename}` : null; 

        if (!title || !postDescription) {
            return res.status(400).json({ message: 'Title and post description are required' });
        }

        const user = await Users.findOne({ where: { userId: req.userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPost = await Post.create({
            title,
            postDescription,
            postContent,
            tags,
            userId: user.userId,
            username: user.username
        });
        console.log('Post Created', newPost);
        return res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const specificPost = async (req, res) => {
    const postId = req.params.postId;
    try{
        const post = await Post.findByPk(postId);
        if(!post){
            return res.status(404).json({message: 'Post not found'})
        }
        return res.status(200).json(post)
      
    }catch(err){
        console.error("Error fetching post:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }

}

const ownerPost = async (req, res) => {
    const userId = req.params.userId;
   

    try {
        const posts = await Post.findAll({ where: { userId } });

        if (!posts.length) {
            return res.json({ message: 'No posts found for this user' });
        }

        return res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updatePost = async (req, res) => {
    const postId = req.params.postId;
    const { title, postDescription, tags } = req.body;
    const postContent = req.file ? `assets/posts/${req.file.filename}` : null;

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const updatedPost = await post.update({
            title,
            postDescription,
            tags,
            postContent: postContent || post.postContent,
        });

        return res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (err) {
        console.error('Error updating post:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deletePost = async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.destroy();

        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};




const publishPost = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    post.published = true;
    await post.save();
    return res.status(200).json({ message: 'Post published successfully', post });
  } catch (err) {
    console.error('Error publishing post:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const unpublishPost = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    post.published = false;
    await post.save();
    return res.status(200).json({ message: 'Post unpublished successfully', post });
  } catch (err) {
    console.error('Error unpublishing post:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllPosts, createPost, specificPost, ownerPost, updatePost, deletePost, publishPost, unpublishPost };