const express = require('express');
const Link = require('../models/Link');
const { protect } = require('../middleware/auth'); // Assuming you have an auth middleware

const router = express.Router();
 
// GET all links
router.get('/', protect, async (req, res) => {
  try {
    const links = await Link.find().sort('order');
    res.json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
 
// GET a specific link by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    res.json(link);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
 
// POST a new link
router.post('/', protect, async (req, res) => {
  try {
    const { title, url, order, category } = req.body;
    const newLink = new Link({ title, url, order, category });
    const savedLink = await newLink.save();
    res.status(201).json(savedLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
 
// PUT update a link by ID
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, url, order, category } = req.body;
    const updatedLink = await Link.findByIdAndUpdate(
      req.params.id,
      { title, url, order, category },
      { new: true, runValidators: true }
    );
    if (!updatedLink) {
      return res.status(404).json({ message: 'Link not found' });
    }
    res.json(updatedLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
 
// DELETE a link by ID
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedLink = await Link.findByIdAndDelete(req.params.id);
    if (!deletedLink) {
      return res.status(404).json({ message: 'Link not found' });
    }
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
 
module.exports = router;