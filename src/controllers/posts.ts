import { Request, Response, NextFunction } from "express";
import { ObjectID } from 'mongodb';

import PostsService from '../services/posts';
import validatePostInput from '../validation/post';
import errorStrings from '../utils/error-handling-strings';
import { Post, Comment, PostInput, ErrorResponse } from "devconnector-types/interfaces";

class PostsController {
  getAllPosts (req: Request, res: Response, next: NextFunction): void {
    PostsService.getAll()
      .then((posts: Post[]) => res.json(posts));
  };

  getSinglePost (req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    PostsService.getPost(id, errorStrings)
      .then((post: Post | null) => res.json(post))
      .catch((err: ErrorResponse) => next(err));
  };

  deleteSinglePost (req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { user }: any = req;
    const userId: string = user.id || '';

    PostsService.deletePost(id, userId, errorStrings)
      .then(() => res.status(204).json())
      .catch((err: ErrorResponse) => next(err));
  };

  addNewPost (req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validatePostInput(req.body, errorStrings);
    let { user }: any = req.user ? req: {};
    const postData: PostInput = {...req.body, user: user.id };

    if (!isValid) return next(errors);

    PostsService.addPost(postData)
      .then((post: Post) => res.status(201).json(post));
  };

  addLikeToPost (req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { user }: any = req;
    const userId: string = user.id || '';

    PostsService.addLike(id, userId, errorStrings)
      .then((post: Post) => res.status(201).json(post))
      .catch((err: ErrorResponse) => next(err));
  };

  removeLikeFromPost (req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { user }: any = req;
    const userId: string = user.id || '';

    PostsService.removeLike(id, userId, errorStrings)
      .then((post: Post) => res.json(post))
      .catch((err: ErrorResponse) => next(err));
  };

  addCommentToPost (req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validatePostInput(req.body, errorStrings);
    let { user }: any = req.user? req: {};

    const commentData: Comment = {...req.body, user: user.id, _id: new ObjectID() };
    const { id } = req.params;

    if (!isValid) return next(errors);
  
    PostsService.addComment(id, commentData, errorStrings)
      .then((post: Post) => res.status(201).json(post))
      .catch((err: ErrorResponse) => next(err));
  };

  deleteCommentFromPost (req: Request, res: Response, next: NextFunction): void {
    const { post_id, comment_id } = req.params;
    PostsService.deleteComment(post_id, comment_id, errorStrings)
      .then((post: Post) => res.json(post))
      .catch((err: ErrorResponse) => next(err));
  };
};

export default new PostsController();