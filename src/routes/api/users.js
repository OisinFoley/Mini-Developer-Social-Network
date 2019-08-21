import express from 'express';
import usersController from '../../controllers/users';
import PassportManager from '../../config/passport-manager';
const router = express.Router();


// @route POST api/users/register
// @desc Registers user
// @access Public

router.post('/register', usersController.registerUser);


// @route POST api/users/login
// @desc Login user, returns JWT
// @access Public

router.post('/login', usersController.loginUser);


// TODO: Can we remove this endpoint?
// @route GET api/users/current
// @desc Return current user
// @access Private

// router.get('/current', PassportManager.authenticate, usersController.getCurrentUser);

export default router;