import Profile from '../models/Profile';
import User from '../models/User';

class ProfilesService {
  // TODO: interface type against these parameters
  getByUserId(userId: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
          if (!profile) {
            reject({ noProfile: errorMessages.profile_not_found_generic });
          }
          resolve(profile);
        })
        .catch(err => reject(err));
    });
  };
// TODO: interface type against these parameters
  getAll(errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.find()
        .populate('user', ['name', 'avatar'])
        // TODO: interface type against these parameters
        .then(profiles => resolve(profiles))
        .catch(err => reject({ noProfiles: errorMessages.profiles_not_found }));
    });
  };
// TODO: interface type against these parameters
  getProfileByHandle(handle: string, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ handle })
        .populate('user', ['name', 'avatar'])
        // TODO: interface type against these parameters
        .then(profile => {
          if (!profile) {
            reject({ noProfile: errorMessages.profile_not_found_for_handle });
          }
          resolve(profile);
        })
        .catch(err => reject(err));
    })
  };

  // TODO: interface type against these parameters
  setProfileForUser(userId: any, profileFields: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
      // TODO: interface type against these parameters
        .then(profile => {
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
            Profile.findOne({ handle: profileFields.handle }).then(profile => {
              // TODO: interface type against these parameters
              if (profile) {
                return reject({ handle: errorMessages.handle_already_exists });
              }
      
              // do the save
              // TODO: interface type against these parameters
              new Profile(profileFields).save().then(profile => 
                resolve({ operation: 'create', profile: profile })
              );
            });
          }
        })
        .catch(err => reject(err));
    });
  };

  addExperience(userId: any, experienceData: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
      // TODO: interface type against these parameters
        .then((profile: any) => {
          if (!profile)
            return reject({ noProfile: errorMessages.profile_not_found_generic });
          
          profile.experience.unshift(experienceData);
          // TODO: interface type against these parameters
          profile.save().then((profile: any) => 
            resolve(profile)
          );
        })
        .catch(err => reject(err));
    });
  };

  // TODO: interface type against these parameters
  deleteExperience(userId: any, exp_id: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
      // TODO: interface type against these parameters
        .then((profile: any) => {
          if (!profile)
            return reject({ noProfile: errorMessages.profile_not_found_generic });
          
          // get remove index
          const removeIndex = profile.experience
          // TODO: interface type against these parameters -> IExperience
            .map((item: any) => item.id)
            .indexOf(exp_id);

          if (removeIndex === -1)
            return reject({ experienceNotFound: errorMessages.experience_not_found });
          
          // remove experience out of the array by its id, then save update
          profile.experience.splice(removeIndex, 1);
          // TODO: interface type against these parameters
          profile.save().then((profile: any) => resolve(profile));
        })
        // TODO: interface type against these parameters
        .catch(err => reject(err));
    });
  };

  // TODO: interface type against these parameters
  addEducation(userId: any, educationData: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
      // TODO: interface type against these parameters
        .then((profile: any) => {
          if (!profile)
            return reject({ noProfile: errorMessages.profile_not_found_generic });
          
          profile.education.unshift(educationData);
          // TODO: interface type against these parameters
          profile.save().then((profile: any) => resolve(profile));
        })
        // TODO: interface type against these parameters
        .catch(err => reject(err));
    });
  };

  // TODO: interface type against these parameters
  deleteEducation(userId: any, edu_id: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
      // TODO: interface type against these parameters
        .then((profile: any) => {
          if (!profile)
            return reject({ noProfile: errorMessages.profile_not_found_generic });
          
          // get remove index
          const removeIndex = profile.education
          // TODO: interface type against these parameters -> IEducation
            .map((item: any) => item.id)
            .indexOf(edu_id);

          if (removeIndex === -1)
            return reject({ educationNotFound: errorMessages.education_not_found });

          // remove education out of the array by its id
          profile.education.splice(removeIndex, 1);

          // save the update
          // TODO: interface type against these parameters
          profile.save().then((profile: any) => resolve(profile));
        })
        // TODO: interface type against these parameters
        .catch(err => reject(err));
    });
  };

  // TODO: interface type against these parameters -> uuid?
  deleteProfileAndUser(userId: any) {
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