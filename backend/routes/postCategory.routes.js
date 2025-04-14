
const express = require('express');
const PostCategory = require('../models/PostCategory');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/post-categories
// @desc    Get all post categories
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const categories = await PostCategory.find({});
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/post-categories
// @desc    Create a new post category
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, slug, description, status } = req.body;

    // Check if category already exists
    const categoryExists = await PostCategory.findOne({ slug });

    if (categoryExists) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }

    const category = await PostCategory.create({
      name,
      slug,
      description,
      status,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/post-categories/:id
// @desc    Get category by ID
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const category = await PostCategory.findById(req.params.id);

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/post-categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, slug, description, status } = req.body;

    const category = await PostCategory.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      category.slug = slug || category.slug;
      category.description = description || category.description;
      category.status = status || category.status;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/post-categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await PostCategory.findById(req.params.id);

    if (category) {
      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
