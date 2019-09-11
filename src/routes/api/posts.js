import express from 'express';
import postsController from '../../controllers/posts';
import PassportManager from '../../config/passport-manager';
const router = express.Router();


// @route GET api/posts/
// @desc retrieve posts
// @access Private
router.get('/', PassportManager.authenticate, postsController.getAllPosts);


// @route GET api/posts/:id
// @desc retrieve posts
// @access Private
router.get('/:id', PassportManager.authenticate, postsController.getSinglePost);


// @route DELETE api/posts/:id
// @desc delete a post
// @access Private
router.delete('/:id', PassportManager.authenticate, postsController.deleteSinglePost);


// @route POST api/posts/
// @desc add a post
// @access Private
router.post('/', PassportManager.authenticate, postsController.addNewPost);
  

// @route POST api/posts/:id/likes
// @desc add a like to a post
// @access Private
router.post('/:id/likes', PassportManager.authenticate, postsController.addLikeToPost);


// @route DELETE api/posts/:id/likes
// @desc unlike a post
// @access Private
router.delete('/:id/likes', PassportManager.authenticate, postsController.removeLikeFromPost);


// @route POST api/posts/:id/comments
// @desc add comment a post
// @access Private
router.post('/:id/comments', PassportManager.authenticate, postsController.addCommentToPost);


// @route DELETE api/posts/:post_id/comments/:comment_id
// @desc remove comment a post
// @access Private
router.delete('/:post_id/comments/:comment_id', PassportManager.authenticate, postsController.deleteCommentFromPost);

export default router;