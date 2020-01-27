import mockPosts from '../__mocks__/posts';
import mockSeedProfiles from '../__mocks__/seed-profiles';
import mockSeedUser from '../__mocks__/seed-user';
import Post from '../../src/models/Post';
import Profile from '../../src/models/Profile';
import User from '../../src/models/User';

export const addSeedPostsToDb = (callback: Function) => {
  Post.insertMany(mockPosts)
    .then(() => callback())
    .catch(err => console.log(err));
};

export const addSeedProfilesToDb = (callback: Function) => {
  Profile.insertMany(mockSeedProfiles)
    .then(() => callback())
    .catch(err => console.log(err));
};

export const addSeedUsersToDb = (callback: Function) => {
  let newUser = new User({
    name: mockSeedUser.name,
    email: mockSeedUser.email,
    password: mockSeedUser.password,
    avatar: mockSeedUser.avatar
  });
  newUser.save().then(() => callback());
};