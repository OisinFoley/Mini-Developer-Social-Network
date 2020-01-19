export const getStatusCodeFromError = (err: string) => {
  switch (true) {
    case err.hasOwnProperty('likedAlready'):
    case err.hasOwnProperty('cannotUnlike'):
    case err.hasOwnProperty('text'):
    case err.hasOwnProperty('handle'):
    case err.hasOwnProperty('status'):
    case err.hasOwnProperty('skills'):
    case err.hasOwnProperty('website'):
    case err.hasOwnProperty('youtube'):
    case err.hasOwnProperty('twitter'):
    case err.hasOwnProperty('linkedin'):
    case err.hasOwnProperty('facebook'):
    case err.hasOwnProperty('instagram'):
    case err.hasOwnProperty('title'):
    case err.hasOwnProperty('company'):
    case err.hasOwnProperty('from'):
    case err.hasOwnProperty('school'):
    case err.hasOwnProperty('degree'):
    case err.hasOwnProperty('fieldOfStudy'):
    case err.hasOwnProperty('name'):
    case err.hasOwnProperty('email'):
    case err.hasOwnProperty('password'):
    case err.hasOwnProperty('password2'):
      return 400;
    case err.hasOwnProperty('unauthorised'):
      return 401;
    case err.hasOwnProperty('postNotFound'):
    case err.hasOwnProperty('commentNotFound'):
    case err.hasOwnProperty('noProfile'):
    case err.hasOwnProperty('noProfiles'):
    case err.hasOwnProperty('educationNotFound'):
    case err.hasOwnProperty('experienceNotFound'):
    case err.hasOwnProperty('emailNotFound'):
      return 404;
    default:
      return 500;
  }
};