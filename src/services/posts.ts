import Post from '../models/Post';
import IPost from '../interfaces/IPost';
import IPostData from '../interfaces/IPostData';
import ILike from '../interfaces/ILike';
import IComment from '../interfaces/IComment';

// TODO: ensure all funcs have return types

class PostsService {
  getAll(): Promise<IPost[]> {
    return new Promise(resolve => {
      Post.find()
        .sort({ date: -1 })
        .then((posts: IPost[]) => resolve(posts));
    });
  };

  getPost(postId: any, errorStrings: any): Promise<IPost | null> {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
        .then((post: IPost | null) => {
          if (!post)
            reject({ postNotFound: errorStrings.post_not_found });
          
          resolve(post);
        })
        .catch(err => reject());
    });
  };

  deletePost(postId: string, userId: string, errorStrings: any): Promise<null> {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
        .then((post: IPost | null) => {
          if (!post)
            return reject({ postNotFound: errorStrings.post_not_found })

          // did user create the post
          if (post.user.toString() !== userId) {
            return reject({
              unauthorised: errorStrings.user_not_authorised
            });
          }
          post.remove().then(() => resolve());
        })
        .catch((err: Error) => reject(err));
    });
  };
  
  addPost(postData: IPostData): Promise<IPost> {
    return new Promise((resolve, reject) => {
      new Post(postData)
        .save()
        .then((post: IPost) => resolve(post))
        .catch((err: Error) => reject(err));
    });
  };

  addLike(postId: string, userId: string, errorStrings: any): Promise<IPost> {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
        .then((post: IPost | null) => {
          if (!post)
            return reject({ postNotFound: errorStrings.post_not_found });

          // check if already liked
          if (
            post.likes.filter((like: ILike) => like.user.toString() === userId)
              .length > 0
          ) {
            return reject({ likedAlready: errorStrings.post_already_liked });
          }
  
          // update then save
          post.likes.unshift({ user: userId });
          post.save().then(post => resolve(post));
        })
        .catch((err: Error) => reject(err));
    });
  };

  removeLike(postId: string, userId: string, errorStrings: any): Promise<IPost> {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
        .then((post: IPost | null) => {
          if (!post)
            return reject({ postNotFound: errorStrings.post_not_found });

          // check if user has already liked
          const removeIndex = post.likes
            .map((item: ILike) => item.user.toString())
            .indexOf(userId);
          
          if (removeIndex === -1)
            return reject({ cannotUnlike: errorStrings.post_not_yet_liked });
  
          post.likes.splice(removeIndex, 1);
          post.save().then(post => resolve(post));
        })
        .catch((err: Error) => reject(err));
    });
  };

  addComment(postId: string, commentData: IComment, errorStrings: any): Promise<IPost> {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
        .then((post: IPost | null) => {
          if (!post)
            return reject({ postNotFound: errorStrings.post_not_found });

          post.comments.unshift(commentData);
          post.save().then(updatedPost => resolve(updatedPost));
        })
        .catch((err: Error) => reject(err));
    });
  };

  deleteComment(requestPostId: string, requestCommentId: string, errorStrings: any): Promise<IPost> {
    return new Promise((resolve, reject) => {
      Post.findById(requestPostId)
        .then((post: IPost | null) => {
          if (!post)
            return reject({ postNotFound: errorStrings.post_not_found });

          const removeIndex = post.comments
            .map((item: IComment) => item.id)
            .indexOf(requestCommentId);

          if (removeIndex === -1)
            return reject({ commentNotFound: errorStrings.comment_not_found });

          post.comments.splice(removeIndex, 1);
          post
            .save()
            .then(post => resolve(post));
        })
        .catch((err: Error) => reject(err));
    });
  };
};

export default new PostsService();