import UsersService from '../services/users';
import validateRegisterInput from '../validation/register';
import validateLoginInput from '../validation/login';
import errorMessages from '../error-handling/strings';

class UsersController {
  registerUser(req, res) {
    const { errors, isValid } = validateRegisterInput(req.body);
    const userData = {...req.body};
  
    if (!isValid) {
      return res.status(400).json(errors);
    }

    UsersService.register(userData, errorMessages)
      .then(user => res.json(user))
      .catch(err => res.status(400).json(err));
  };

  loginUser(req, res) {
    const { errors, isValid } = validateLoginInput(req.body);
    const loginData = {...req.body};
  
    if (!isValid) {
      return res.status(400).json(errors);
    }

    UsersService.login(loginData, errorMessages)
      .then(token => res.json(token))
      .catch(err => {
        if (err.email) res.status(404).json(err);
        if (err.password) res.status(400).json(err);
      });
  };
};
export default new UsersController();