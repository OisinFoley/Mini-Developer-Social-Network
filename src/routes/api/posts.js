const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/post');
const errorMessages = require('../../error-handling/strings');

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

deleteSinglePost = (req, res) => {
    // stub this as a return value when mocking passport later
    req.user = {};
    // happy case (SUCCESS expected)
    req.user.id = '5d497baeed8f0b4d00ece2cb'; // profiles[1]
    
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

// ********** reenable jwt requirement later once you have branch flow tested
router.delete('/:id', deleteSinglePost);


// router.delete(
//   '/:id',
//   passport.authenticate('jwt', { session: false }), deleteSinglePost);


// @route POST api/posts/
// @desc add a post
// @access Private

addNewPost = (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // temp solution until we mock passport properly
  req.user = {};
  req.user.id = '12345'
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    user: req.user.id,
    avatar: req.body.avatar
  });

  newPost.save().then(post => res.json(post));
};

// ********** reenable jwt requirement later once you have branch flow tested
router.post('/', addNewPost);

// router.post(
//   '/',
//   passport.authenticate('jwt', { session: false }), addNewPost);

// @route POST api/posts/likes/:id
// @desc add a like to a post
// @access Private

addLikeToPost = (req, res) => {
  req.user = {}; 
  // req.user.id = '5d497baeed8f0b4d00ece2cb'; // trigger 400 RESPONSE
  // req.user.id = '5d497baeed8f0b4d00e12345'; // trigger 200 RESPONSE, guid not from any mock files (note ending)
  
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
router.post('/like/:id', addLikeToPost);



// ********** reenable jwt requirement later once you have branch flow tested
// router.post('/like/:id', passport.authenticate('jwt', { session: false }), addLikeToPost);
// router.post('/like/:id', passportManager.authenticate, addLikeToPost);
// router.post('/like/:id', passportManager.authenticate, addLikeToPost);

// @route POST api/posts/unlike/:id
// @desc unlike a post
// @access Private

removeLikeFromPost = (req, res) => {
  req.user = {};
  req.user.id = '5d497baeed8f0b4d00e12345'; // 400 RESPONSE

  // req.user.id = '5d497baeed8f0b4d00ece2cb'; // 200 RESPONSE

  console.log(req.params.id);
  
  

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
router.post('/unlike/:id', removeLikeFromPost);

// ********** reenable jwt requirement later once you have branch flow tested
// router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), removeLikeFromPost);

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
router.post('/comment/:id', addCommentToPost);

// ********** reenable jwt requirement later once you have branch flow tested
// router.post(
//   '/comment/:id',
//   passport.authenticate('jwt', { session: false }), addCommentToPost);



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
router.delete('/comment/:id/:comment_id', deleteCommentFromPost);

// ********** reenable jwt requirement later once you have branch flow tested
// router.delete('/comment/:id/:comment_id',
//   passport.authenticate('jwt', { session: false }),
//   deleteCommentFromPost);

module.exports = router;
