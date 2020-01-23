import Profile from '../models/Profile';
import User from '../models/User';
import IProfile from '../interfaces/IProfile';
import IProfileResponse from '../interfaces/IProfileResponse';
import IProfileFields from '../interfaces/IProfileFields';
import IExperience from '../interfaces/IExperience';
import IEducation from '../interfaces/IEducation';

class ProfilesService {
  // TODO: fix this compiler error
  // getByUserId(userId: string, errorMessages: any): Promise<IProfileResponse> {
  //   return new Promise((resolve, reject) => {
  //     Profile.findOne({ user: userId })
  //       .populate('user', ['name', 'avatar'])
  //       .then((profile: IProfile | null) => {
  //         if (!profile) {
  //           reject({ noProfile: errorMessages.profile_not_found_generic });
  //         }
  //         resolve(profile);
  //       })
  //       .catch((err: Error) => reject(err));
  //   });
  // };

  // TODO: set func return type
  getAll(errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.find()
        .populate('user', ['name', 'avatar'])
        .then((profiles: IProfile[] | null) => resolve(profiles))
        .catch((err: Error) => reject({ noProfiles: errorMessages.profiles_not_found }));
    });
  };

  // TODO: set func return type
  getProfileByHandle(handle: string, errorMessages: any): Promise<IProfile> {
    return new Promise((resolve, reject) => {
      Profile.findOne({ handle })
        .populate('user', ['name', 'avatar'])
        .then((profile: IProfile | null) => {
          if (!profile) {
            reject({ noProfile: errorMessages.profile_not_found_for_handle });
          }
          resolve(profile);
        })
        .catch((err: Error) => reject(err));
    })
  };

  // TODO: set func return type
  setProfileForUser(userId: any, profileFields: IProfileFields, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
        .then((profile: IProfile | null) => {
          if (profile) {
            //update
            Profile.findOneAndUpdate(
              { user: userId },
              { $set: profileFields },
              { new: true }
            ).then(profile =>
              resolve({ operation: 'edit', profile: profile })
            );
          } else {
            //create
      
            // does handle exist
            Profile.findOne({ handle: profileFields.handle })
              .then((profile: IProfile | null) => {
                if (profile) {
                  return reject({ handle: errorMessages.handle_already_exists });
                }
        
                // TODO: interface type against these parameters
                new Profile(profileFields)
                  .save()
                  .then((profile: IProfile) => {
                    resolve({ operation: 'create', profile: profile })
                  });
            });
          }
        })
        .catch(err => reject(err));
    });
  };

  // TODO: set func return type
  addExperience(userId: string, experienceData: IExperience, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
        .then((profile: IProfile | null) => {
          if (!profile)
            return reject({ noProfile: errorMessages.profile_not_found_generic });
          
          profile.experience.unshift(experienceData);
          profile
            .save()
            .then(profile => resolve(profile));
        })
        .catch((err: Error) => reject(err));
    });
  };

  // TODO: set func return type
  deleteExperience(userId: string, exp_id: string, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
        .then((profile: IProfile | null) => {
          if (!profile)
            return reject({ noProfile: errorMessages.profile_not_found_generic });
          
          // get remove index
          const removeIndex = profile.experience
            .map((item: IExperience) => item.id)
            .indexOf(exp_id);

          if (removeIndex === -1)
            return reject({ experienceNotFound: errorMessages.experience_not_found });
          
          // find and remove experience by its id
          profile.experience.splice(removeIndex, 1);
          profile
            .save()
            .then(profile => resolve(profile));
        })
        .catch((err: Error) => reject(err));
    });
  };

  // TODO: set func return type
  addEducation(userId: string, educationData: IEducation, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
        .then((profile: IProfile | null) => {
          if (!profile)
            return reject({ noProfile: errorMessages.profile_not_found_generic });
          
          profile.education.unshift(educationData);
          profile
            .save()
            .then(profile => resolve(profile));
        })
        .catch((err: Error) => reject(err));
    });
  };

  // TODO: set func return type
  deleteEducation(userId: string, edu_id: string, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
        .then((profile: IProfile | null) => {
          if (!profile)
            return reject({ noProfile: errorMessages.profile_not_found_generic });
          
          // get remove index
          const removeIndex = profile.education
            .map((item: IEducation) => item.id)
            .indexOf(edu_id);

          if (removeIndex === -1)
            return reject({ educationNotFound: errorMessages.education_not_found });

          // remove education out of the array by its id
          profile.education.splice(removeIndex, 1);

          // save the update
          profile
            .save()
            .then(profile => resolve(profile));
        })
        .catch((err: Error) => reject(err));
    });
  };

  // TODO: set func return type
  deleteProfileAndUser(userId: string) {
    return new Promise((resolve, reject) => {
      // TODO: we should get something in the response that indicates a success
      // TODO: interface type against these parameters
      Profile.findOneAndRemove({ user: userId }).then(() => {
        User.findOneAndRemove({ _id: userId }).then(() => {
          resolve();
        });
      })
    });
  };
};

export default new ProfilesService();