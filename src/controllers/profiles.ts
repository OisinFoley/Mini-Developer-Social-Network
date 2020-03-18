import { Request, Response, NextFunction } from "express";

import ProfilesService from '../services/profiles';
import validateProfileInput from '../validation/profile';
import validateExperienceInput from '../validation/experience';
import validateEducationInput from '../validation/education';
import errorStrings from '../utils/error-handling-strings';
import { parseRequestValuesToProfileFields } from '../utils/assignValuesToProps';
import { Profile, SetProfileResponse, ErrorResponse } from "devconnector-types/interfaces";

class ProfilesController {
  getCurrentUsersProfile(req: Request, res: Response, next: NextFunction): void {
    const { id }: any = req.user;
  
    ProfilesService.getByUserId(id, errorStrings)
      .then((profile: Profile | null) => res.json(profile))
      .catch((err: ErrorResponse) => {
        if (err.noProfile) {
          err.noProfile = errorStrings.profile_not_found_for_current_user;
        }
        next(err);
      });
  };

  getAllProfiles(req: Request, res: Response, next: NextFunction): void {
    ProfilesService.getAll(errorStrings)
      .then((profiles: Profile[]) => res.json(profiles))
      .catch((err: ErrorResponse) => next(err));
  };

  getProfileByHandle(req: Request, res: Response, next: NextFunction): void {
    const { handle }: any = req.params;

    ProfilesService.getProfileByHandle(handle, errorStrings)
      .then((profile: Profile | null) => res.json(profile))
      .catch((err: ErrorResponse) => next(err));
  };

  getProfileByUserId(req: Request, res: Response, next: NextFunction): void {
    const { user_id }: any = req.params;

    ProfilesService.getByUserId(user_id, errorStrings)
      .then((profile: Profile | null) => res.json(profile))
      .catch((err: ErrorResponse) => {
        if (err.noProfile) {
          err.noProfile = errorStrings.profile_not_found_for_user_id;
        }
        next(err);
      });
  };

  setUserProfile(req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validateProfileInput(req.body, errorStrings);
    const { id }: any = req.user;
  
    if (!isValid) return next(errors);

    const requestProps = {...req.body};

    // get fields
    let profileFields: any = {};
    profileFields.social = {};
    profileFields.user = id;

    parseRequestValuesToProfileFields(profileFields, requestProps);

    ProfilesService.setProfileForUser(id, profileFields, errorStrings)
      .then((data: SetProfileResponse) => {
        const { operation, profile } = data;
        
        if (operation === 'create') res.status(201).json(profile);
        if (operation === 'edit') res.json(profile);
      })
      .catch((err: ErrorResponse) => next(err));
  };

  addExperienceToProfile(req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validateExperienceInput(req.body, errorStrings);
    const { id }: any = req.user;
    const experienceData = {...req.body};

    if (!isValid) return next(errors);
  
    ProfilesService.addExperience(id, experienceData, errorStrings)
      .then((profile: Profile) => res.status(201).json(profile))
      .catch((err: ErrorResponse) => next(err));
  };

  deleteExperienceFromProfileById(req: Request, res: Response, next: NextFunction): void {
    const { exp_id } = req.params;
    const { id }: any = req.user;
    ProfilesService.deleteExperience(id, exp_id, errorStrings)
      .then((profile: Profile) => res.json(profile))
      .catch((err: ErrorResponse) => next(err));
  };

  addEducationToProfile(req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validateEducationInput(req.body, errorStrings);
    const educationData = {...req.body};
    const { id }: any = req.user;

    if (!isValid) return next(errors);

    ProfilesService.addEducation(id, educationData, errorStrings)
      .then((profile: Profile) => res.status(201).json(profile))
      .catch((err: ErrorResponse) => next(err));
  };

  deleteEducationFromProfileById(req: Request, res: Response, next: NextFunction): void {
    const { edu_id } = req.params;
    const { id }: any = req.user;

    ProfilesService.deleteEducation(id, edu_id, errorStrings)
      .then((profile: Profile) => res.json(profile))
      .catch((err: ErrorResponse) => next(err));
  };

  deleteAccountForUser(req: Request, res: Response, next: NextFunction): void {
    const { id }: any = req.user;
    ProfilesService.deleteProfileAndUser(id)
      .then(() => res.status(204).json());
  };
};
export default new ProfilesController();