const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/post');
const errorMessages = require('../../error-handling/strings');
const PassportManager = require('../../config/passport-manager');


// @route GET api/posts/
// @desc retrieve posts
// @access Public

getAllPosts = (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.status(404).json({ noPosts: errorMessages.posts_not_found }));
};
router.get('/', getAllPosts);


// @route GET api/posts/
// @desc retrieve posts
// @access Public

getSinglePost = (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      res.json(post);
    })
    .catch(err =>
      res.status(404).json({ noPost: errorMessages.post_not_found })
    );
};
router.get('/:id', getSinglePost);


// @route DELETE api/posts/:id
// @desc delete a post
// @access Private

deleteSinglePost = (req, res) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({
            unauthorised: errorMessages.user_not_authorised
          });
        }
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res
          .status(404)
          .json({ noPost: errorMessages.post_not_found })
      );
  });
};
router.delete('/:id',PassportManager.authenticate, deleteSinglePost);


// @route POST api/posts/
// @desc add a post
// @access Private

addNewPost = (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    user: req.user.id,
    avatar: req.body.avatar
  });

  newPost.save().then(post => res.json(post));
};
router.post('/', PassportManager.authenticate, addNewPost);
  

// @route POST api/posts/likes/:id
// @desc add a like to a post
// @access Private

addLikeToPost = (req, res) => {
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
            .json({ likedAlready: errorMessages.post_already_liked });
        }

        // add to likes array then save
        post.likes.unshift({ user: req.user.id });

        post.save().then(post => res.json(post));
      })
      .catch(err => 
        res
          .status(404)
          .json({ postNotFound: errorMessages.post_not_found })
      );
  });
};
router.post('/like/:id', PassportManager.authenticate, addLikeToPost);


// @route POST api/posts/unlike/:id
// @desc unlike a post
// @access Private

removeLikeFromPost = (req, res) => {
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
            .json({ cannotUnlike: errorMessages.post_not_yet_liked });
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
          .json({ postNotFound: errorMessages.post_not_found })
      );
  });
};
router.post('/unlike/:id', PassportManager.authenticate, removeLikeFromPost);


// @route POST api/posts/comment/:id
// @desc add comment a post
// @access Private

addCommentToPost = (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };
      
      post.comments.unshift(newComment);
      post.save().then(updatedPost => res.json(updatedPost));
    })
    .catch(err =>
      res.status(404).json({ notFound: errorMessages.post_not_found })
    );
};
router.post('/comment/:id', PassportManager.authenticate, addCommentToPost);


// @route DELETE api/posts/comment/:id/:comment_id
// @desc remove comment a post
// @access Private

deleteCommentFromPost = (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (
        post.comments.filter(
          comment => comment._id.toString() === req.params.comment_id
        ).length === 0
      ) {
        return res
          .status(400)
          .json({ notFound: errorMessages.comment_not_found });
      }
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

      post.comments.splice(removeIndex, 1);

      post.save().then(post => res.json(post));
    })
    .catch(err =>
      res.status(404).json({ notFound: errorMessages.post_not_found })
    );
};
router.delete('/comment/:id/:comment_id', PassportManager.authenticate, deleteCommentFromPost);

module.exports = router;