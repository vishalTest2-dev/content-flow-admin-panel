
const express = require('express');
const Post = require('../models/Post');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, slug, content, shortDescription, thumbnail, category, status } = req.body;

    // Check if post with slug already exists
    const postExists = await Post.findOne({ slug });

    if (postExists) {
      return res.status(400).json({ message: 'Post with this slug already exists' });
    }

    const post = await Post.create({
      title,
      slug,
      content,
      shortDescription,
      thumbnail,
      category,
      status,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { title, slug, content, shortDescription, thumbnail, category, status } = req.body;

    const post = await Post.findById(req.params.id);

    if (post) {
      post.title = title || post.title;
      post.slug = slug || post.slug;
      post.content = content || post.content;
      post.shortDescription = shortDescription || post.shortDescription;
      post.thumbnail = thumbnail || post.thumbnail;
      post.category = category || post.category;
      post.status = status || post.status;

      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      await post.deleteOne();
      res.json({ message: 'Post removed' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
