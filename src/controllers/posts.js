import PostsService from '../services/posts';
import validatePostInput from '../validation/post';
import errorMessages from '../utils/error-handling-strings';

class PostsController {
  getAllPosts (req, res) {
    PostsService.getAll()
      .then(posts => res.json(posts));
  };

  getSinglePost (req, res, next)  {
    const { id } = req.params;
    PostsService.getPost(id, errorMessages)
      .then(post => res.json(post))
      .catch(err => next(err));
  };

  deleteSinglePost (req, res, next) {
    const { id } = req.params;
    const userId = req.user.id;

    PostsService.deletePost(id, userId, errorMessages)
      .then(() => res.status(204).json())
      .catch(err => next(err));
  };

  addNewPost (req, res, next) {
    const { errors, isValid } = validatePostInput(req.body, errorMessages);
    const postData = {...req.body, user: req.user.id };

    if (!isValid)
      next(errors);

    PostsService.addPost(postData)
      .then(post => res.status(201).json(post));
  };

  addLikeToPost (req, res, next) {
    const { id } = req.params;
    const userId = req.user.id;

    PostsService.addLike(id, userId, errorMessages)
      .then(post => res.status(201).json(post))
      .catch(err => next(err));
  };

  removeLikeFromPost (req, res, next) {
    const { id } = req.params;
    const userId = req.user.id;

    PostsService.removeLike(id, userId, errorMessages)
      .then(post => res.json(post))
      .catch(err => next(err));
  };

  addCommentToPost (req, res, next) {
    const { errors, isValid } = validatePostInput(req.body, errorMessages);
    const commentData = {...req.body, user: req.user.id };
    const { id } = req.params;

    if (!isValid)
      next(errors);
  
    PostsService.addComment(id, commentData, errorMessages)
      .then(post => res.status(201).json(post))
      .catch(err => next(err));
  };

  deleteCommentFromPost (req, res, next) {
    const { post_id, comment_id } = req.params;
    PostsService.deleteComment(post_id, comment_id, errorMessages)
      .then(post => res.json(post))
      .catch(err => next(err));
  };
};

export default new PostsController();