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
  

// @route POST api/posts/likes/:id
// @desc add a like to a post
// @access Private
router.post('/like/:id', PassportManager.authenticate, postsController.addLikeToPost);


// @route POST api/posts/unlike/:id
// @desc unlike a post
// @access Private
router.post('/unlike/:id', PassportManager.authenticate, postsController.removeLikeFromPost);


// @route POST api/posts/comment/:id
// @desc add comment a post
// @access Private
router.post('/comment/:id', PassportManager.authenticate, postsController.addCommentToPost);


// @route DELETE api/posts/comment/:post_id/:comment_id
// @desc remove comment a post
// @access Private
router.delete('/comment/:post_id/:comment_id', PassportManager.authenticate, postsController.deleteCommentFromPost);

export default router;