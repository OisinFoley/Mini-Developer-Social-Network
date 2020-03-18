import { Request, Response, NextFunction } from "express";

import UsersService from '../services/users';
import validateRegisterInput from '../validation/register';
import validateLoginInput from '../validation/login';
import errorStrings from '../utils/error-handling-strings';
import { User, LoginResponse, ErrorResponse } from "devconnector-types/interfaces";

class UsersController {
  registerUser(req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validateRegisterInput(req.body, errorStrings);
    const userData = {...req.body};
    
    if (!isValid) return next(errors);

    UsersService.register(userData, errorStrings)
      .then((user: User) => res.status(201).json(user))
      .catch((err: ErrorResponse) => next(err));
  };

  loginUser(req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validateLoginInput(req.body, errorStrings);
    const loginData = {...req.body};
    
    if (!isValid) return next(errors);

    UsersService.login(loginData, errorStrings)
      .then((token: LoginResponse) => res.json(token))
      .catch((err: ErrorResponse) => next(err));
  };
};
export default new UsersController();