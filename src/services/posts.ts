import Post from '../models/Post';

class PostsService {
  // TODO: interface type against these parameters
  getAll() {
    return new Promise(resolve => {
      Post.find()
        .sort({ date: -1 })
        .then(posts => resolve(posts));
    });
  };

  // TODO: interface type against these parameters
  getPost(postId: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
      // TODO: interface type against these parameters
        .then(post => {
          if (!post)
            reject({ postNotFound: errorMessages.post_not_found });
          
          resolve(post);
        })
        .catch(err => reject());
    });
  };

  // TODO: interface type against these parameters
  deletePost(postId: any, userId: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
        .then((post: any) => {
          // TODO: interface type against these parameters
          if (!post)
            return reject({ postNotFound: errorMessages.post_not_found })

          // did user create the post
          if (post.user.toString() !== userId) {
            return reject({
              unauthorised: errorMessages.user_not_authorised
            });
          }
          post.remove().then(() => resolve());
        })
        .catch(err => reject(err));
    });
  };
  
  // TODO: interface type against these parameters
  addPost(postData: any) {
    return new Promise((resolve, reject) => {
      new Post(postData)
        .save()
        // TODO: interface type against these parameters
        .then(post => resolve(post))
        .catch(err => reject(err));
    });
  };

  // TODO: interface type against these parameters
  addLike(postId: any, userId: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
      // TODO: interface type against these parameters
        .then((post: any) => {
          if (!post)
            return reject({ postNotFound: errorMessages.post_not_found });

          // check if previously liked
          if (
            // TODO
            post.likes.filter((like: any) => like.user.toString() === userId)
              .length > 0
          ) {
            return reject({ likedAlready: errorMessages.post_already_liked });
          }
  
          // add to likes array then save
          post.likes.unshift({ user: userId });
  
          // TODO: interface type against these parameters
          post.save().then((post: any) => resolve(post));
        })
        .catch(err => reject(err));
    });
  };

  // TODO: interface type against these parameters
  removeLike(postId: any, userId: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
      // TODO: interface type against these parameters
        .then((post: any) => {
          if (!post)
            return reject({ postNotFound: errorMessages.post_not_found });

          // check if user has already liked
          const removeIndex = post.likes
          // TODO: interface type against these parameters
            .map((item: any) => item.user.toString())
            .indexOf(userId);
          
          if (removeIndex === -1)
            return reject({ cannotUnlike: errorMessages.post_not_yet_liked });
  
          post.likes.splice(removeIndex, 1);
  
          // TODO: interface type against these parameters
          post.save().then((post: any) => resolve(post));
        })
        .catch(err => reject(err));
    });
  };

  // TODO: interface type against these parameters
  addComment(postId: any, commentData: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
      // TODO: interface type against these parameters
        .then((post: any) => {
          if (!post)
            return reject({ postNotFound: errorMessages.post_not_found });

          post.comments.unshift(commentData);
          // TODO: interface type against these parameters
          post.save().then((updatedPost: any) =>
            resolve(updatedPost)
          );
        })
        .catch(err => reject(err));
    });
  };

  // TODO: interface type against these parameters
  deleteComment(requestPostId: any, requestCommentId: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Post.findById(requestPostId)
      // TODO: interface type against these parameters
        .then((post: any) => {
          if (!post)
            return reject({ postNotFound: errorMessages.post_not_found });

          const removeIndex = post.comments
          // TODO: interface type against these parameters
            .map((item: any) => item.id)
            .indexOf(requestCommentId);

          if (removeIndex === -1)
            return reject({ commentNotFound: errorMessages.comment_not_found });

          post.comments.splice(removeIndex, 1);
          // TODO: interface type against these parameters
          post.save().then((post: any) => resolve(post));
        })
        .catch(err => reject(err));
    });
  };
};

export default new PostsService();