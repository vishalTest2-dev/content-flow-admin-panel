
const express = require('express');
const QuizCategory = require('../models/QuizCategory');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/quiz-categories
// @desc    Get all quiz categories
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const categories = await QuizCategory.find({});
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/quiz-categories
// @desc    Create a new quiz category
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, icon, description, status } = req.body;

    const categoryExists = await QuizCategory.findOne({ name });

    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await QuizCategory.create({
      name,
      icon,
      description,
      status,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/quiz-categories/:id
// @desc    Get category by ID
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const category = await QuizCategory.findById(req.params.id);

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

// @route   PUT /api/quiz-categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, icon, description, status } = req.body;

    const category = await QuizCategory.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      category.icon = icon || category.icon;
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

// @route   DELETE /api/quiz-categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await QuizCategory.findById(req.params.id);

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
