import Post from '../models/Post';
import Profile from '../models/Profile';

class PostsService {
  getAll() {
    return new Promise((resolve, reject) => {
      Post.find()
        .sort({ date: -1 })
        .then(posts => resolve(posts));
    });
  };

  getPost(postId, errorMessages) {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
      .then(post => {
        resolve(post);
      })
      .catch(err =>
        reject({ postNotFound: errorMessages.post_not_found })
      );
    });
  };

  deletePost(postId, userId, errorMessages) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId }).then(profile => {
        Post.findById(postId)
          .then(post => {
            if (post.user.toString() !== userId) {
              reject({
                unauthorised: errorMessages.user_not_authorised
              });
            }
            post.remove().then(() => resolve({ success: true }));
          })
          .catch(err => 
            reject({ postNotFound: errorMessages.post_not_found })
          );
      });
    });
  };
  
  addPost(postData) {
    return new Promise((resolve, reject) => {
      const newPost = new Post(postData);
      newPost.save().then(post => resolve(post));
    });
  };

  addLike(postId, userId, errorMessages) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId }).then(profile => {
        Post.findById(postId)
          .then(post => {
            // check if previously liked
            if (
              post.likes.filter(like => like.user.toString() === userId)
                .length > 0
            ) {
              reject({ likedAlready: errorMessages.post_already_liked });
            }
    
            // add to likes array then save
            post.likes.unshift({ user: userId });
    
            post.save().then(post => resolve(post));
          })
          .catch(err =>
            reject({ postNotFound: errorMessages.post_not_found })
          );
      });
    });
  };

  removeLike(postId, userId, errorMessages) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId }).then(profile => {
        Post.findById(postId)
          .then(post => {
            // check if previously unliked
            if (
              post.likes.filter(like => like.user.toString() === userId)
                .length === 0
            ) {
              reject({ cannotUnlike: errorMessages.post_not_yet_liked });
            }
            const removeIndex = post.likes
              .map(item => item.user.toString())
              .indexOf(userId);
    
            post.likes.splice(removeIndex, 1);
    
            post.save().then(post => resolve(post));
          })
          .catch(err => 
            reject({ postNotFound: errorMessages.post_not_found })
          );
      });
    });
  };

  addComment(postId, commentData, errorMessages) {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
        .then(post => {
          post.comments.unshift(commentData);
          post.save().then(updatedPost =>
            resolve(updatedPost)
          );
        })
        .catch(err => 
          reject({ postNotFound: errorMessages.post_not_found })
        );
    });
  };

  deleteComment(requestPostId, requestCommentId, errorMessages) {
    return new Promise((resolve, reject) => {
      Post.findById(requestPostId)
      .then(post => {
        if (
          post.comments.filter(
            comment => comment._id.toString() === requestCommentId
          ).length === 0
        ) {
          reject({ commentNotFound: errorMessages.comment_not_found });
        }
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(requestCommentId);

        post.comments.splice(removeIndex, 1);
        post.save().then(post => resolve(post));
      })
      .catch(err =>
        reject({ postNotFound: errorMessages.post_not_found })
      );
    });
  };
};

export default new PostsService();
