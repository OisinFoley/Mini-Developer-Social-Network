export const assignSingleValueToManyObjectProps = (obj, propsArray, value) => {
  propsArray.forEach(prop => {
    obj[prop] = value;
  });
};

export const parseRequestValuesToProfileFields = (profileFields, requestBody) => {
  profileFields.handle = requestBody.handle || null;
    profileFields.company = requestBody.company || null;
    profileFields.bio = requestBody.bio || null;
    profileFields.website = requestBody.website || null;
    profileFields.location = requestBody.location || null;
    profileFields.status = requestBody.status || null;
    profileFields.githubUsername = requestBody.githubUsername || null;
  
    //skills needs to be parsed to an array
    if (typeof requestBody.skills !== 'undefined') {
      profileFields.skills = requestBody.skills.split(',');
    }
  
    profileFields.social = {};
    profileFields.social.youtube = requestBody.youtube || null;
    profileFields.social.facebook = requestBody.facebook || null;
    profileFields.social.twitter = requestBody.twitter || null;
    profileFields.social.linkedin = requestBody.linkedin || null;
    profileFields.social.instagram = requestBody.instagram || null;
};