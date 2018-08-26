const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

const validatePostInput = require('../../validation/post');

// @route GET api/posts/test
// @desc tests posts route
// @access Public

router.get('/test', (req, res) =>
  res.json({
    message: 'Posts works!'
  })
);

// @route GET api/posts/
// @desc retrieve posts
// @access Public

router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.status(404).json({ noPosts: 'No posts found!' }));
});

// @route GET api/posts/
// @desc retrieve posts
// @access Public

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      res.json(post);
    })
    .catch(err =>
      res.status(404).json({ noPost: 'No post with that id found!' })
    );
});

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
              unauthorised: 'User not authorised!'
            });
          }
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res
            .status(404)
            .json({ noPost: 'Post not found, no delete occurred!' })
        );
    });
  }
);

// @route POST api/posts/
// @desc add a post
// @access Private

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

// @route POST api/posts/likes/:id
// @desc add a like to a post
// @access Private

router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check if previously liked
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ likedAlready: 'User has already liked post!' });
          }

          // add to likes array then save
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res
            .status(404)
            .json({ postNotFound: 'Could not find post with the id provided' })
        );
    });
  }
);

// @route POST api/posts/unlike/:id
// @desc unlike a post
// @access Private

router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check if previously unliked
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ cannotUnlike: 'You have not yet liked this post!' });
          }

          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);

          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res
            .status(404)
            .json({ postNotFound: 'Could not find post with the id provided' })
        );
    });
  }
);

module.exports = router;
