export const mockProfiles = [{
  _id: '123fakeId',
  bio: 'Tester who enjoys testing across the testing testing as well as testing',
  user: {
    name: 'test_user',
    avatar: 'http://test_avatar.com'
  },
  githubUsername: 'testGithubName',
  status: 'test_status',
  company: 'test_company',
  location: 'test_location',
  skills: [ 'test_skill0', 'test_skill1', 'test_skill2', 'test_skill3', 'test_skill4', 'test_skill5', 'test_skill6', 'test_skill7', 'test_skill8', 'test_skill9'],
  social: [{ 'youtube': 'https://www.1test.com', 'facebook': 'https://www.2testForall.com', 'twitter':'https://www.theFinalTestTier.com' }],
  wesbite: 'https:myFakeSite.com.au',
  handle: 'test_handle'
}, {
  _id: '789fakeId',
  user: {
    name: 'test_user2',
    avatar: 'http://test_avatar.com'
  },
  status: 'test_status2',
  company: 'test_company2',
  location: 'test_location2',
  skills: [ 'test_skill10', 'test_skill11', 'test_skill12', 'test_skill13', 'test_skill14', 'test_skill15', 'test_skill16', 'test_skill17', 'test_skill18', 'test_skill19'],
  handle: 'test_handle2'
}]

export const loadingProfile = {
  loading: true,
  profiles: []
}

export const noProfiles = {
  loading: false,
  profiles: []
}