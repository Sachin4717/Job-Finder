const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  personal: {
    firstName: String,
    lastName: String,
    headline: String,
    bio: String
  },

  contact: {
    phone: String,
    email: String,
    address: String,
    city: String,
    state: String,
    country: String,
    linkedin: String,
    github: String
  },

  resumeUrl: String,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProfileSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Profile', ProfileSchema);
