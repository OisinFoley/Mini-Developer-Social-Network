import { Request, Response, NextFunction } from "express";

import ProfilesService from '../services/profiles';
import validateProfileInput from '../validation/profile';
import validateExperienceInput from '../validation/experience';
import validateEducationInput from '../validation/education';
import errorMessages from '../utils/error-handling-strings';
import { parseRequestValuesToProfileFields } from '../utils/assignValuesToProps';

class ProfilesController {
  getCurrentUsersProfile(req: Request, res: Response, next: NextFunction) {
    // TODO: more concrete type for this -> uuid?
    const { id }: any = req.user;
  
    // TODO: interface on returned profile arg
    ProfilesService.getByUserId(id, errorMessages)
      .then((profile: any) => res.json(profile))
      // TODO: can we interface on our custom error coming from the service
      .catch((err: any) => {
        if (err.noProfile) {
          err.noProfile = errorMessages.profile_not_found_for_current_user;
        }
        next(err);
      });
  };

  getAllProfiles(req: Request, res: Response, next: NextFunction) {
    ProfilesService.getAll(errorMessages)
    // TODO: interface on returned profiles arg
      .then((profiles: any) => res.json(profiles))
      // TODO: can we interface on our custom error coming from the service
      .catch((err: any) => next(err));
  };

  getProfileByHandle(req: Request, res: Response, next: NextFunction) {
    const { handle } = req.params;

    ProfilesService.getProfileByHandle(handle, errorMessages)
    // TODO:
      .then((profile: any) => res.json(profile))
    // TODO:
      .catch((err: any) => next(err))
  };

  getProfileByUserId(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.params;

    ProfilesService.getByUserId(user_id, errorMessages)
    // TODO:
      .then((profile: any) => res.json(profile))
    // TODO:
      .catch((err: any) => {
        if (err.noProfile) {
          err.noProfile = errorMessages.profile_not_found_for_user_id;
        }
        next(err);
      });
  };

  setUserProfile(req: Request, res: Response, next: NextFunction) {
    const { errors, isValid } = validateProfileInput(req.body, errorMessages);
    // TODO: more concrete type for this -> uuid?
    const { id = '' }: any = req.user;
  
    if (!isValid) next(errors);

    const requestBody = {...req.body};

    // get fields
    let profileFields: any = {};
    profileFields.social = {};
    profileFields.user = id;

    parseRequestValuesToProfileFields(profileFields, requestBody);

    ProfilesService.setProfileForUser(id, profileFields, errorMessages)
    // TODO: interface on types
      .then((data: any) => {
        const { operation, profile } = data;
        
        if (operation === 'create') res.status(201).json(profile);
        if (operation === 'edit') res.json(profile);
      })
      // TODO
      .catch((err: any) => next(err));
  };

  addExperienceToProfile(req: Request, res: Response, next: NextFunction) {
    const { errors, isValid } = validateExperienceInput(req.body, errorMessages);
    // TODO: more concrete type for this -> uuid?
    const { id }: any = req.user;
    const experienceData = {...req.body};

    if (!isValid) next(errors);
  
    ProfilesService.addExperience(id, experienceData, errorMessages)
    // TODO:
      .then((profile: any) => res.status(201).json(profile))
    // TODO:
      .catch((err: any) => next(err));
  };

  deleteExperienceFromProfileById(req: Request, res: Response, next: NextFunction) {
    const { exp_id } = req.params;
    // TODO: more concrete type for this -> uuid?
    const { id }: any = req.user;
    ProfilesService.deleteExperience(id, exp_id, errorMessages)
    // TODO:
      .then((profile: any) => res.json(profile))
    // TODO:
      .catch((err: any) => next(err));
  };

  addEducationToProfile(req: Request, res: Response, next: NextFunction) {
    const { errors, isValid } = validateEducationInput(req.body, errorMessages);
    const educationData = {...req.body};
    // TODO: more concrete type for this -> uuid?
    const { id }: any = req.user;

    if (!isValid) next(errors);

    ProfilesService.addEducation(id, educationData, errorMessages)
    // TODO:
      .then((profile: any) => res.status(201).json(profile))
    // TODO:
      .catch((err: any) => next(err));
  };

  deleteEducationFromProfileById(req: Request, res: Response, next: NextFunction) {
    const { edu_id } = req.params;
    // TODO: more concrete type for this -> uuid?
    const { id }: any = req.user;

    ProfilesService.deleteEducation(id, edu_id, errorMessages)
    // TODO:
      .then((profile: any) => res.json(profile))
    // TODO:
      .catch((err: any) => next(err));
  };

  deleteAccountForUser(req: Request, res: Response, next: NextFunction) {
    // TODO: more concrete type for this -> uuid?
    const { id }: any = req.user;
    ProfilesService.deleteProfileAndUser(id)
      .then(() => res.status(204).json());
  };
};
export default new ProfilesController();