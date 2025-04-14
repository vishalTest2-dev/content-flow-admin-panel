
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: '/placeholder.svg',
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password is correct
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
