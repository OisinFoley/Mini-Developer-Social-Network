import Profile from '../models/Profile';
import User from '../models/User';
import {
  ProfileModel,
  ProfileFields,
  Experience,
  Education,
  SetProfileResponse
} from 'devconnector-types/interfaces';

class ProfilesService {
  getByUserId(userId: string, errorStrings: any): Promise<ProfileModel | null> {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
        .populate('user', ['name', 'avatar'])
        .then((profile: ProfileModel | null) => {
          if (!profile) {
            reject({ noProfile: errorStrings.profile_not_found_generic });
          }
          resolve(profile);
        })
        .catch((err: Error) => reject(err));
    });
  };

  
  getAll(errorStrings: any): Promise<ProfileModel[]> {
    return new Promise((resolve, reject) => {
      Profile.find()
        .populate('user', ['name', 'avatar'])
        .then((profiles: ProfileModel[]) => resolve(profiles))
        .catch((err: Error) => reject({ noProfiles: errorStrings.profiles_not_found }));
    });
  };

  getProfileByHandle(handle: string, errorStrings: any): Promise<ProfileModel | null> {
    return new Promise((resolve, reject) => {
      Profile.findOne({ handle })
        .populate('user', ['name', 'avatar'])
        .then((profile: ProfileModel | null) => {
          if (!profile) {
            reject({ noProfile: errorStrings.profile_not_found_for_handle });
          }
          resolve(profile);
        })
        .catch((err: Error) => reject(err));
    })
  };

  
  setProfileForUser(
    userId: string,
    profileFields: ProfileFields,
    errorStrings: any
  )
  : Promise<SetProfileResponse> {
      return new Promise((resolve, reject) => {
        Profile.findOne({ user: userId })
          .then((profile: ProfileModel | null) => {
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
                .then((profile: ProfileModel | null) => {
                  if (profile) {
                    return reject({ handle: errorStrings.handle_already_exists });
                  }
          
                  new Profile(profileFields)
                    .save()
                    .then((profile: ProfileModel) => {
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
    experienceData: Experience,
    errorStrings: any
  )
  : Promise<ProfileModel> {
      return new Promise((resolve, reject) => {
        Profile.findOne({ user: userId })
          .then((profile: ProfileModel | null) => {
            if (!profile)
              return reject({ noProfile: errorStrings.profile_not_found_generic });
            
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
    errorStrings: any)
  :
  Promise<ProfileModel> {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
        .then((profile: ProfileModel | null) => {
          if (!profile)
            return reject({ noProfile: errorStrings.profile_not_found_generic });
          
          // get remove index
          const removeIndex = profile.experience
            .map((item: Experience) => item._id)
            .indexOf(exp_id);

          if (removeIndex === -1)
            return reject({ experienceNotFound: errorStrings.experience_not_found });
          
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
    educationData: Education,
    errorStrings: any)
  :
  Promise<ProfileModel> {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
        .then((profile: ProfileModel | null) => {
          if (!profile)
            return reject({ noProfile: errorStrings.profile_not_found_generic });
          
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
    errorStrings: any
  )
  : Promise<ProfileModel> {
      return new Promise((resolve, reject) => {
        Profile.findOne({ user: userId })
          .then((profile: ProfileModel | null) => {
            if (!profile)
              return reject({ noProfile: errorStrings.profile_not_found_generic });
            
            // get remove index
            const removeIndex = profile.education
              .map((item: Education) => item._id)
              .indexOf(edu_id);

            if (removeIndex === -1)
              return reject({ educationNotFound: errorStrings.education_not_found });

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