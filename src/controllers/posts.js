import Post from '../models/Post';
import Profile from '../models/Profile';
import validatePostInput from '../validation/post';
import errorMessages from '../error-handling/strings';

class PostsController {
  async getAllPosts (req, res) {
    Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.status(404).json({ noPosts: errorMessages.posts_not_found }));
  };

  async getSinglePost (req, res) {
    Post.findById(req.params.id)
    .then(post => {
      res.json(post);
    })
    .catch(err =>
      res.status(404).json({ noPost: errorMessages.post_not_found })
    );
  };

  async deleteSinglePost (req, res) {
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

  async addNewPost (req, res) {
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

  async addLikeToPost (req, res) {
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

  async removeLikeFromPost (req, res) {
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

  async addCommentToPost (req, res) {
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

  async deleteCommentFromPost (req, res) {
    Post.findById(req.params.post_id)
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
};
export default new PostsController();