import express from 'express';
import usersController from '../../controllers/users';
const router = express.Router();


// @route POST api/users/register
// @desc Registers user
// @access Public
router.post('/register', usersController.registerUser);


// @route POST api/users/login
// @desc Login user, returns JWT
// @access Public
router.post('/login', usersController.loginUser);

export default router;