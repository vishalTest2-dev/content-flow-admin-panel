
const express = require('express');
const Quiz = require('../models/Quiz');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/quizzes
// @desc    Get all quizzes
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/quizzes
// @desc    Create a new quiz
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { question, answer, category, status } = req.body;

    const quiz = await Quiz.create({
      question,
      answer,
      category,
      status,
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get quiz by ID
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/quizzes/:id
// @desc    Update a quiz
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { question, answer, category, status } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (quiz) {
      quiz.question = question || quiz.question;
      quiz.answer = answer || quiz.answer;
      quiz.category = category || quiz.category;
      quiz.status = status || quiz.status;

      const updatedQuiz = await quiz.save();
      res.json(updatedQuiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/quizzes/:id
// @desc    Delete a quiz
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (quiz) {
      await quiz.deleteOne();
      res.json({ message: 'Quiz removed' });
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
