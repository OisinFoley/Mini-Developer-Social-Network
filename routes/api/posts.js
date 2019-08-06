const express = require('express');
const router = express.Router();
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

getAllPosts = (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.status(404).json({ noPosts: 'No posts found!' }));
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
      res.status(404).json({ noPost: 'No post with that id found!' })
    );
};
router.get('/:id', getSinglePost);

deletePost = (req, res) => {
    // console.log('in the delete endpoint');

    // stub this as a return value when mocking passport later
    req.user = {};
    // happy case (SUCCESS expected)
    req.user.id = '5d497baeed8f0b4d00ece2cb'; // profiles[1]
    
    Profile.findOne({ user: req.user.id }).then(profile => {
      // console.log('in the delete endpoint');
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
  };

// ********** reenable jwt requirement later once you have branch flow tested
router.delete('/:id', deletePost);


// router.delete(
//   '/:id',
//   passport.authenticate('jwt', { session: false }), deletePost);


// @route POST api/posts/
// @desc add a post
// @access Private

postNewPost = (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(404).json(errors);
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
router.post('/', postNewPost);

// router.post(
//   '/',
//   passport.authenticate('jwt', { session: false }), postNewPost);

// @route POST api/posts/likes/:id
// @desc add a like to a post
// @access Private

addLikeToPost = (req, res) => {
  req.user = {};

  // req.user.id = '5d497baeed8f0b4d00ece2cb'; // trigger 400 RESPONSE
  req.user.id = '5d497baeed8f0b4d00e12345'; // trigger 200 RESPONSE, guid not from any mock files (note ending)
  console.log('req after this line');
  
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
  };
router.post('/like/:id', addLikeToPost);

// ********** reenable jwt requirement later once you have branch flow tested
// router.post('/like/:id', passport.authenticate('jwt', { session: false }), addLikeToPost);

// router.post(
//   '/like/:id',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     Profile.findOne({ user: req.user.id }).then(profile => {
//       Post.findById(req.params.id)
//         .then(post => {
//           // check if previously liked
//           if (
//             post.likes.filter(like => like.user.toString() === req.user.id)
//               .length > 0
//           ) {
//             return res
//               .status(400)
//               .json({ likedAlready: 'User has already liked post!' });
//           }

//           // add to likes array then save
//           post.likes.unshift({ user: req.user.id });

//           post.save().then(post => res.json(post));
//         })
//         .catch(err =>
//           res
//             .status(404)
//             .json({ postNotFound: 'Could not find post with the id provided' })
//         );
//     });
//   }
// );

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

// @route POST api/comment/:id
// @desc add comment a post
// @access Private

router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(404).json(errors);
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

        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ notFound: 'Post not found, cannot comment.' })
      );
  }
);

// @route DELETE api/comment/:id/:comment_id
// @desc remove comment a post
// @access Private

router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ notFound: 'Comment not found, cannot delete. ' });
        }
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ notFound: 'Post not found, cannot remove.' })
      );
  }
);

module.exports = router;
