import { Request, Response, NextFunction } from "express";

import PostsService from '../services/posts';
import validatePostInput from '../validation/post';
import errorStrings from '../utils/error-handling-strings';
import IPost from "../interfaces/IPost";

class PostsController {
  getAllPosts (req: Request, res: Response, next: NextFunction): void {
    PostsService.getAll()
      .then((posts: IPost[]) => res.json(posts));
  };

  getSinglePost (req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    PostsService.getPost(id, errorStrings)
      .then((post: IPost | null) => res.json(post))
      .catch(err => next(err));
  };

  deleteSinglePost (req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { user }: any = req;
    // TODO tidy this up
    const userId = user.id ? user.id : '';

    PostsService.deletePost(id, userId, errorStrings)
      .then(() => res.status(204).json())
      .catch(err => next(err));
  };

  addNewPost (req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validatePostInput(req.body, errorStrings);
    // TODO: more concrete type for this
    let { user }: any = req.user ? req: {};
    const postData = {...req.body, user: user.id };

    if (!isValid)
      next(errors);

    PostsService.addPost(postData)
      .then((post: IPost) => res.status(201).json(post));
  };

  addLikeToPost (req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    // TODO: more concrete type for this
    const { user }: any = req;
    const userId = user.id ? user.id : '';

    PostsService.addLike(id, userId, errorStrings)
      .then((post: IPost) => res.status(201).json(post))
      .catch(err => next(err));
  };

  removeLikeFromPost (req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    // TODO: more concrete type for this -> uuid?
    const { user }: any = req;
    const userId = user.id ? user.id : '';

    PostsService.removeLike(id, userId, errorStrings)
      .then((post: IPost) => res.json(post))
      .catch(err => next(err));
  };

  addCommentToPost (req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validatePostInput(req.body, errorStrings);
    // TODO: more concrete type for this -> uuid?
    let { user }: any = req.user? req: {};
    const commentData = {...req.body, user: user.id };
    const { id } = req.params;

    if (!isValid)
      next(errors);
  
    PostsService.addComment(id, commentData, errorStrings)
      .then((post: IPost) => res.status(201).json(post))
      .catch(err => next(err));
  };

  deleteCommentFromPost (req: Request, res: Response, next: NextFunction): void {
    const { post_id, comment_id } = req.params;
    PostsService.deleteComment(post_id, comment_id, errorStrings)
      .then((post: IPost) => res.json(post))
      .catch(err => next(err));
  };
};

export default new PostsController();