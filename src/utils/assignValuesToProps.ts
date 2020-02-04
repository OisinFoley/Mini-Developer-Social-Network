import { ProfileFields, ProfileInput } from "devconnector-types/interfaces";

export const assignSingleValueToManyObjectProps 
  = (obj: any, propsArray: (string | number)[], value: string | number | boolean): void => {
    propsArray.forEach((prop: any) => {
      obj[prop] = value;
    });
};

export const parseRequestValuesToProfileFields = (profileFields: ProfileFields, requestBody: ProfileInput): void => {
  profileFields.handle = requestBody.handle || '';
  profileFields.company = requestBody.company || '';
  profileFields.bio = requestBody.bio || '';
  profileFields.website = requestBody.website || '';
  profileFields.location = requestBody.location || '';
  profileFields.status = requestBody.status || '';
  profileFields.githubUsername = requestBody.githubUsername || '';

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