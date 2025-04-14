
const mongoose = require('mongoose');

const quizCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      default: '/placeholder.svg',
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const QuizCategory = mongoose.model('QuizCategory', quizCategorySchema);
module.exports = QuizCategory;
