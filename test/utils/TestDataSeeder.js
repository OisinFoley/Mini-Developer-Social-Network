const mockPosts = require('../__mocks__/posts');
const mockSeedProfiles = require('../__mocks__/seed-profiles');
const mockSeedUser = require('../__mocks__/seed-user');

addSeedPostsToDb = (resolve) => {
  mockPosts.forEach(post => {
    const newPost = new Post({
      _id: post._id,
      text: post.text,
      name: post.name,
      user: post.user,
      date: post.date,
      avatar: post.avatar,
      likes: post.likes,
      comments: post.comments
    });
    newPost.save();
  });
  resolve();
};

addSeedProfilesToDb = (resolve) => {
  mockSeedProfiles.forEach(profile => {
    const newProfile = new Profile({
      _id: profile._id,
      skills: profile.skills,
      date: profile.date,
      user: profile.user,
      handle: profile.handle,
      company: profile.company,
      website: profile.website,
      location: profile.location,
      status: profile.status,
      social: profile.social,
      experience: profile.experience,
      education: profile.education,
      bio: profile.bio
    });
    newProfile.save();
  });
  resolve();
};

addSeedUsersToDb = (resolve) => {
  let newUser = new User({
    name: mockSeedUser.name,
    email: mockSeedUser.email,
    password: mockSeedUser.password,
    avatar: mockSeedUser.avatar
  });
  newUser.save().then(() => resolve());
};

module.exports = {
  addSeedPostsToDb,
  addSeedProfilesToDb,
  addSeedUsersToDb
};