const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');

const validatePostInput = require('../../validation/post');

// @route GET api/posts/test
// @desc tests posts route
// @access Public

router.get('/test', (req, res) =>
  res.json({
    message: 'Posts works!'
  })
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(404).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      user: req.user.id,
      avatar: req.body.avatar
    });

    newPost.save().then(post => res.json({ message: 'Success', post: post }));
  }
);

module.exports = router;
