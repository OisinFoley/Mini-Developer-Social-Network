import Profile from '../models/Profile';
import User from '../models/User';
import IProfile from '../interfaces/IProfile';
import IProfileFields from '../interfaces/IProfileFields';
import IExperience from '../interfaces/IExperience';
import IEducation from '../interfaces/IEducation';
import ISetProfileResponse from '../interfaces/ISetProfileResponse';

class ProfilesService {
  getByUserId(userId: string, errorMessages: any): Promise<IProfile | null> {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
        .populate('user', ['name', 'avatar'])
        .then((profile: IProfile | null) => {
          if (!profile) {
            reject({ noProfile: errorMessages.profile_not_found_generic });
          }
          resolve(profile);
        })
        .catch((err: Error) => reject(err));
    });
  };

  
  getAll(errorMessages: any): Promise<IProfile[]> {
    return new Promise((resolve, reject) => {
      Profile.find()
        .populate('user', ['name', 'avatar'])
        .then((profiles: IProfile[]) => resolve(profiles))
        .catch((err: Error) => reject({ noProfiles: errorMessages.profiles_not_found }));
    });
  };

  getProfileByHandle(handle: string, errorMessages: any): Promise<IProfile | null> {
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

  
  setProfileForUser(
    userId: string,
    profileFields: IProfileFields,
    errorMessages: any
  )
  : Promise<ISetProfileResponse> {
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
                resolve({ operation: 'edit', profile })
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
          .catch((err: Error) => reject(err));
      });
    };

  addExperience(
    userId: string,
    experienceData: IExperience,
    errorMessages: any
  )
  : Promise<IProfile> {
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

  deleteExperience(
    userId: string,
    exp_id: string,
    errorMessages: any)
  :
  Promise<IProfile> {
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

  addEducation(
    userId: string,
    educationData: IEducation,
    errorMessages: any)
  :
  Promise<IProfile> {
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

  
  deleteEducation(
    userId: string,
    edu_id: string,
    errorMessages: any
  )
  : Promise<IProfile> {
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

  deleteProfileAndUser(userId: string): Promise<null> {
    return new Promise((resolve, reject) => {
      Profile.findOneAndRemove({ user: userId }).then(() => {
        User.findOneAndRemove({ _id: userId }).then(() => {
          resolve();
        });
      })
    });
  };
};

export default new ProfilesService();