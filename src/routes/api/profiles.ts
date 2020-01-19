import express from 'express';
import profilesController from '../../controllers/profiles';
import { authenticate as authenticateUser } from '../../config/passport-manager';
const router = express.Router();


// @route GET api/profiles/
// @desc gets current user's profile
// @access Private
router.get('/', authenticateUser, profilesController.getCurrentUsersProfile);


// @route GET api/profiles/all
// @desc get all profiles
// @access public
router.get('/all', profilesController.getAllProfiles);


// @route GET api/profiles/handle/:handle
// @desc get profile by their handle
// @access public
router.get('/handle/:handle', profilesController.getProfileByHandle);


// @route GET api/profiles/user/:user_id
// @desc get profile by user_id
// @access public
router.get('/user/:user_id', profilesController.getProfileByUserId);


// @route POST api/profiles/
// @desc creates or edit user's profile
// @access Private
router.post('/', authenticateUser, profilesController.setUserProfile);


// @route POST api/profiles/experiences
// @desc adds a user's experience to their profile
// @access Private
router.post('/experiences', authenticateUser, profilesController.addExperienceToProfile);


// @route DELETE api/profiles/experiences/:exp_id
// @desc delete a user's experience from their profile
// @access Private
router.delete('/experiences/:exp_id', authenticateUser, profilesController.deleteExperienceFromProfileById);


// @route POST api/profiles/educations
// @desc adds a user's education to their profile
// @access Private
router.post('/educations', authenticateUser, profilesController.addEducationToProfile);


// @route DELETE api/profiles/educations/:edu_id
// @desc delete a user's education from their profile
// @access Private
router.delete('/educations/:edu_id', authenticateUser, profilesController.deleteEducationFromProfileById);


// @route DELETE api/profiles/
// @desc delete user and their profile
// @access Private
router.delete('/', authenticateUser, profilesController.deleteAccountForUser);

export default router;