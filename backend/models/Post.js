
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
    },
    thumbnail: {
      type: String,
      default: '/placeholder.svg',
    },
    category: {
      type: String,
      required: true,
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

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
