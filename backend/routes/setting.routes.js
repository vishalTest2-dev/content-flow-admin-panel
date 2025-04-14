const express = require('express');
const Setting = require('../models/Setting');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/settings
// @desc    Retrieve all settings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const settings = await Setting.find().sort({ key: 1 }); // Sort by key
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/settings/:key
// @desc    Retrieve a specific setting by key
// @access  Private
router.get('/:key', protect, async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });

    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    res.json(setting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/settings
// @desc    Create a new setting
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { key, value } = req.body;

    // Check if setting with the same key already exists
    const existingSetting = await Setting.findOne({ key });
    if (existingSetting) {
      return res.status(400).json({ message: 'Setting with this key already exists' });
    }

    const newSetting = new Setting({
      key,
      value,
    });

    const setting = await newSetting.save();
    res.status(201).json(setting);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/settings/:key
// @desc    Update an existing setting by key
// @access  Private
router.put('/:key', protect, async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: req.params.key });

    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    setting.value = req.body.value || setting.value;

    setting = await setting.save();
    res.json(setting);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/settings/:key
// @desc    Delete a setting by key
// @access  Private
router.delete('/:key', protect, async (req, res) => {
  try {
    const setting = await Setting.findOneAndDelete({ key: req.params.key });

    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
