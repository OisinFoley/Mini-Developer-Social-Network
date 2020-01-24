import { Request, Response, NextFunction } from "express";

import ProfilesService from '../services/profiles';
import validateProfileInput from '../validation/profile';
import validateExperienceInput from '../validation/experience';
import validateEducationInput from '../validation/education';
import errorMessages from '../utils/error-handling-strings';
import { parseRequestValuesToProfileFields } from '../utils/assignValuesToProps';
import IProfile from "../interfaces/IProfile";
import ISetProfileResponse from "../interfaces/ISetProfileResponse";

// TODO ensure all funcs have returns types

class ProfilesController {
  getCurrentUsersProfile(req: Request, res: Response, next: NextFunction): void {
    // TODO: type
    const { id = '' }: any = req.user;
  
    ProfilesService.getByUserId(id, errorMessages)
      .then((profile: IProfile | null) => res.json(profile))
      .catch((err: any) => {
        if (err.noProfile) {
          err.noProfile = errorMessages.profile_not_found_for_current_user;
        }
        next(err);
      });
  };

  getAllProfiles(req: Request, res: Response, next: NextFunction): void {
    ProfilesService.getAll(errorMessages)
      .then((profiles: IProfile[]) => res.json(profiles))
      // TODO: can we interface on our custom error coming from the service
      .catch((err: any) => next(err));
  };

  getProfileByHandle(req: Request, res: Response, next: NextFunction): void {
    const { handle }: any = req.params;

    ProfilesService.getProfileByHandle(handle, errorMessages)
      .then((profile: IProfile | null) => res.json(profile))
    // TODO:
      .catch((err: any) => next(err));
  };

  getProfileByUserId(req: Request, res: Response, next: NextFunction): void {
    const { user_id }: any = req.params;

    ProfilesService.getByUserId(user_id, errorMessages)
      .then((profile: IProfile | null) => res.json(profile))
    // TODO:
      .catch((err: any) => {
        if (err.noProfile) {
          err.noProfile = errorMessages.profile_not_found_for_user_id;
        }
        next(err);
      });
  };

  setUserProfile(req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validateProfileInput(req.body, errorMessages);
    const { id }: any = req.user;
  
    if (!isValid) next(errors);

    const requestBody = {...req.body};

    // get fields
    let profileFields: any = {};
    profileFields.social = {};
    profileFields.user = id;

    parseRequestValuesToProfileFields(profileFields, requestBody);

    ProfilesService.setProfileForUser(id, profileFields, errorMessages)
      .then((data: ISetProfileResponse) => {
        const { operation, profile } = data;
        
        if (operation === 'create') res.status(201).json(profile);
        if (operation === 'edit') res.json(profile);
      })
      // TODO
      .catch((err: any) => next(err));
  };

  addExperienceToProfile(req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validateExperienceInput(req.body, errorMessages);
    // TODO: more concrete type for this
    const { id }: any = req.user;
    const experienceData = {...req.body};

    if (!isValid) next(errors);
  
    ProfilesService.addExperience(id, experienceData, errorMessages)
      .then((profile: IProfile) => res.status(201).json(profile))
    // TODO:
      .catch((err: any) => next(err));
  };

  deleteExperienceFromProfileById(req: Request, res: Response, next: NextFunction): void {
    const { exp_id } = req.params;
    // TODO: more concrete type for this
    const { id }: any = req.user;
    ProfilesService.deleteExperience(id, exp_id, errorMessages)
      .then((profile: IProfile) => res.json(profile))
    // TODO:
      .catch((err: any) => next(err));
  };

  addEducationToProfile(req: Request, res: Response, next: NextFunction): void {
    const { errors, isValid } = validateEducationInput(req.body, errorMessages);
    const educationData = {...req.body};
    const { id }: any = req.user;

    if (!isValid) next(errors);

    ProfilesService.addEducation(id, educationData, errorMessages)
      .then((profile: IProfile) => res.status(201).json(profile))
    // TODO:
      .catch((err: any) => next(err));
  };

  deleteEducationFromProfileById(req: Request, res: Response, next: NextFunction): void {
    const { edu_id } = req.params;
    // TODO: more concrete type for this
    const { id }: any = req.user;

    ProfilesService.deleteEducation(id, edu_id, errorMessages)
      .then((profile: IProfile) => res.json(profile))
    // TODO:
      .catch((err: any) => next(err));
  };

  deleteAccountForUser(req: Request, res: Response, next: NextFunction): void {
    // TODO: more concrete type for this
    const { id }: any = req.user;
    ProfilesService.deleteProfileAndUser(id)
      .then(() => res.status(204).json());
  };
};
export default new ProfilesController();