import { Request, Response, NextFunction } from "express";

import UsersService from '../services/users';
import validateRegisterInput from '../validation/register';
import validateLoginInput from '../validation/login';
import errorStrings from '../utils/error-handling-strings';
import IUser from "../interfaces/IUser";
import ILoginResponse from "../interfaces/ILoginResponse";
import IErrorResponse from "../interfaces/IErrorResponse";

class UsersController {
  registerUser(req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validateRegisterInput(req.body, errorStrings);
    const userData = {...req.body};
    
    if (!isValid) next(errors);

    UsersService.register(userData, errorStrings)
      .then((user: IUser) => res.status(201).json(user))
      .catch((err: IErrorResponse) => next(err));
  };

  loginUser(req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validateLoginInput(req.body, errorStrings);
    const loginData = {...req.body};
    
    if (!isValid) next(errors);

    UsersService.login(loginData, errorStrings)
      .then((token: ILoginResponse) => res.json(token))
      .catch((err: IErrorResponse) => next(err));
  };
};
export default new UsersController();