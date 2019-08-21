import mockPosts from '../__mocks__/posts';
import mockSeedProfiles from '../__mocks__/seed-profiles';
import mockSeedUser from '../__mocks__/seed-user';
import Post from '../../src/models/Post';
import Profile from '../../src/models/Profile';
import User from '../../src/models/User';

export const addSeedPostsToDb = (resolve) => {
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

export const addSeedProfilesToDb = (resolve) => {
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

export const addSeedUsersToDb = (resolve) => {
  let newUser = new User({
    name: mockSeedUser.name,
    email: mockSeedUser.email,
    password: mockSeedUser.password,
    avatar: mockSeedUser.avatar
  });
  newUser.save().then(() => resolve());
};