import Post from '../models/Post';

class PostsService {
  getAll() {
    return new Promise(resolve => {
      Post.find()
        .sort({ date: -1 })
        .then(posts => resolve(posts));
    });
  };

  getPost(postId, errorMessages) {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
        .then(post => {
          if (!post)
            reject({ postNotFound: errorMessages.post_not_found });
          
          resolve(post);
        })
        .catch(err => reject());
    });
  };

  deletePost(postId, userId, errorMessages) {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
        .then(post => {
          if (!post)
            reject({ postNotFound: errorMessages.post_not_found })

          // did user create the post
          if (post.user.toString() !== userId) {
            reject({
              unauthorised: errorMessages.user_not_authorised
            });
          }
          post.remove().then(() => resolve());
        })
        .catch(err => reject(err));
    });
  };
  
  addPost(postData) {
    return new Promise((resolve, reject) => {
      new Post(postData)
        .save()
        .then(post => resolve(post))
        .catch(err => reject(err));
    });
  };

  addLike(postId, userId, errorMessages) {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
        .then(post => {
          if (!post)
            reject({ postNotFound: errorMessages.post_not_found });

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
        .catch(err => reject(err));
    });
  };

  removeLike(postId, userId, errorMessages) {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
        .then(post => {
          if (!post)
            reject({ postNotFound: errorMessages.post_not_found });

          // check if user has already liked
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(userId);
          
          if (removeIndex === -1)
            reject({ cannotUnlike: errorMessages.post_not_yet_liked });
  
          post.likes.splice(removeIndex, 1);
  
          post.save().then(post => resolve(post));
        })
        .catch(err => reject(err));
    });
  };

  addComment(postId, commentData, errorMessages) {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
        .then(post => {
          if (!post)
            reject({ postNotFound: errorMessages.post_not_found });

          post.comments.unshift(commentData);
          post.save().then(updatedPost =>
            resolve(updatedPost)
          );
        })
        .catch(err => reject(err));
    });
  };

  deleteComment(requestPostId, requestCommentId, errorMessages) {
    return new Promise((resolve, reject) => {
      Post.findById(requestPostId)
        .then(post => {
          if (!post)
            reject({ postNotFound: errorMessages.post_not_found });

          const removeIndex = post.comments
            .map(item => item.id)
            .indexOf(requestCommentId);

          if (removeIndex === -1)
            reject({ commentNotFound: errorMessages.comment_not_found });

          post.comments.splice(removeIndex, 1);
          post.save().then(post => resolve(post));
        })
        .catch(err => reject(err));
    });
  };
};

export default new PostsService();