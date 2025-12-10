const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer storage for resume upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error('Only PDF, DOC, DOCX files are allowed'));
    }
    cb(null, true);
  }
});

// @route   GET /api/profile/me
// @desc    Get logged-in user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      'name email role'
    );
    res.json(profile || null);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/profile/me
// @desc    Create/update profile with personal info, contact, and resume
router.post('/me', auth, upload.single('resume'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      headline,
      bio,
      phone,
      email,
      address,
      city,
      state,
      country,
      linkedin,
      github
    } = req.body;

    const profileFields = {
      user: req.user.id,
      personal: {
        firstName,
        lastName,
        headline,
        bio
      },
      contact: {
        phone,
        email,
        address,
        city,
        state,
        country,
        linkedin,
        github
      }
    };

    if (req.file) {
      profileFields.resumeUrl = `/uploads/${req.file.filename}`;
    }

    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
    } else {
      profile = new Profile(profileFields);
      await profile.save();
    }

    profile = await profile.populate('user', 'name email role');

    res.json(profile);
  } catch (err) {
    console.error(err);
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
