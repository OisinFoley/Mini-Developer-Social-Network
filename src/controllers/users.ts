import { Request, Response, NextFunction } from "express";

import UsersService from '../services/users';
import validateRegisterInput from '../validation/register';
import validateLoginInput from '../validation/login';
import errorMessages from '../utils/error-handling-strings';
import IUser from "../interfaces/IUser";
import ILoginResponse from "../interfaces/ILoginResponse";

class UsersController {
  registerUser(req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validateRegisterInput(req.body, errorMessages);
    const userData = {...req.body};
    
    if (!isValid) next(errors);

    UsersService.register(userData, errorMessages)
      .then((user: IUser) => res.status(201).json(user))
      .catch(err => next(err));
  };

  loginUser(req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validateLoginInput(req.body, errorMessages);
    const loginData = {...req.body};
    
    if (!isValid) next(errors);

    UsersService.login(loginData, errorMessages)
      .then((token: ILoginResponse) => res.json(token))
      .catch(err => next(err));
  };
};
export default new UsersController();