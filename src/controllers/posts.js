import PostsService from '../services/posts';
import validatePostInput from '../validation/post';
import errorMessages from '../error-handling/strings';

class PostsController {
  getAllPosts (req, res) {
    PostsService.getAll()
      .then(posts => res.json(posts));
  };

  getSinglePost (req, res) {
    const { id } = req.params;
    PostsService.getPost(id, errorMessages)
      .then(post => res.json(post))
      .catch(err => {
        if (err.postNotFound) res.status(404).json(err);
      });
  };

  deleteSinglePost (req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    PostsService.deletePost(id, userId, errorMessages)
      .then(() => res.json({ success: true }))
      .catch(err => {
        if (err.unauthorised) res.status(401).json(err);
        if (err.postNotFound) res.status(404).json(err);
      });
  };

  addNewPost (req, res) {
    const { errors, isValid } = validatePostInput(req.body);
    const postData = {...req.body, user: req.user.id };

    if (!isValid) {
      return res.status(400).json(errors);
    }

    PostsService.addPost(postData)
      .then(post => res.json(post));
  };

  addLikeToPost (req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    PostsService.addLike(id, userId, errorMessages)
      .then(post => res.json(post))
      .catch(err => {
        if (err.likedAlready) res.status(400).json(err);
        if (err.postNotFound) res.status(404).json(err);
      });
  };

  removeLikeFromPost (req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    PostsService.removeLike(id, userId, errorMessages)
      .then(post => res.json(post))
      .catch(err => {
        if (err.cannotUnlike) res.status(400).json(err);
        if (err.postNotFound) res.status(404).json(err);
      });
  };

  addCommentToPost (req, res) {
    const { errors, isValid } = validatePostInput(req.body);
    const commentData = {...req.body, user: req.user.id };
    const { id } = req.params;

    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    PostsService.addComment(id, commentData, errorMessages)
    .then(post => res.json(post))
    .catch(err => {
      if (err.postNotFound) res.status(404).json(err);
    });
  };

  deleteCommentFromPost (req, res) {
    const { post_id, comment_id } = req.params;
    PostsService.deleteComment(post_id, comment_id, errorMessages)
      .then(post => res.json(post))
      .catch(err => {
        if (err.postNotFound || err.commentNotFound) {
          res.status(404).json(err);
        }
      });
  };
};

export default new PostsController();