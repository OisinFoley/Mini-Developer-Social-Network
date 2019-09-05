import Profile from '../models/Profile';
import User from '../models/User';

class ProfilesService {
  getByUserId(userId, errorMessages) {  
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          reject({ noProfile: errorMessages.profile_not_found_generic });
        }
        resolve(profile);
      })
      .catch(err => {
        reject({ noProfile: errorMessages.profile_not_found_generic });
      });
      
    });
  };

  getAll() {
    return new Promise((resolve, reject) => {
      Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => resolve(profiles))
        .catch(err => reject({ noProfiles: errorMessages.profiles_not_found }));
    });
  };

  getProfileByHandle(handle, errorMessages) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ handle })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          reject({ noProfile: errorMessages.profile_not_found_for_handle });
        }
        resolve(profile);
      })
      .catch(err => reject({ noProfile: errorMessages.profile_not_found_for_handle }));
    })
  };

  setProfileForUser(userId, profileFields, errorMessages) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId }).then(profile => {
        if (profile) {
          //update
          Profile.findOneAndUpdate(
            { user: userId },
            { $set: profileFields },
            { new: true }
          ).then(profile => resolve(profile));
        } else {
          //create
    
          // does handle exist
          Profile.findOne({ handle: profileFields.handle }).then(profile => {
            if (profile) {
              reject({ handle: errorMessages.handle_already_exists });
            }
    
            // do the save
            new Profile(profileFields).save().then(profile => resolve(profile));
          });
        }
      });
    });
  };

  addExperience(userId, experienceData, errorMessages) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId }).then(profile => {
        profile.experience.unshift(experienceData);
        profile.save().then(profile => resolve(profile));
      });
    });
  };

  deleteExperience(userId, exp_id, errorMessages) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
      .then(profile => {
        // get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(exp_id);

        // remove experience id out of the array
        profile.experience.splice(removeIndex, 1);

        // save the update
        profile.save().then(profile => resolve(profile));
      })
      // TODO: update response err message
      .catch(err => reject(err));
    });
  };

  addEducation(userId, educationData, errorMessages) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId }).then(profile => {
        profile.education.unshift(educationData);
        profile.save().then(profile => resolve(profile));
      });
    });
  };

  deleteEducation(userId, edu_id, errorMessages) {
    return new Promise((resolve, reject) => {
      Profile.findOne({ user: userId })
      .then(profile => {
        // get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(edu_id);

        // remove education id out of the array
        profile.education.splice(removeIndex, 1);

        // save the update
        profile.save().then(profile => resolve(profile));
      })
      .catch(err => reject(err));
    });
  };

  deleteProfileAndUser(userId) {
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