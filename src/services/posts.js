import Post from '../models/Post';
import errorMessages from '../error-handling/strings';


class PostsService {
  deleteComment(requestPostId, requestCommentId, errorMessages) {
    return new Promise((resolve, reject) => {
      Post.findById(requestPostId)
      .then(post => {
        if (
          post.comments.filter(
            comment => comment._id.toString() === requestCommentId
          ).length === 0
        ) {
          // return res
          //   .status(400)
          //   .json({ notFound: errorMessages.comment_not_found });
          // throw { commentNotFound: errorMessages.comment_not_found };

          reject({ commentNotFound: errorMessages.comment_not_found });
        }
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(requestCommentId);

        post.comments.splice(removeIndex, 1);

        // post.save().then(post => res.json(post));
        // post.save().then(post => { return post });
        post.save().then(post => { resolve(post) });
      })
      .catch(err =>
        // res.status(404).json({ notFound: errorMessages.post_not_found })
        // res.status(404).json({ notFound: errorMessages.post_not_found })
        // { throw { postNotFound: errorMessages.post_not_found }; }
        { 
          reject({ postNotFound: errorMessages.post_not_found });
        }
      );
    });
  };
};

export default new PostsService();
