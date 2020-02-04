export const emptyProfile = { 
  _id: '',
  user: {
    name: '',
    avatar: '',
    id: ''
  },
  handle: '',
  status: '',
  skills: [],
  experience: [],
  education: [],
  social: [{
    facebook: '',
    youtube: '',
    instagram: '',
    linkedin: '',
    twitter: ''
  }]
};

export const emptyUser = {
  id: '',
  name: 'Unidentified User',
  avatar: ''
};

export const emptyPost = {
  _id: '',
  name: '',
  avatar: '',
  likes: [],
  comments: [],
  date: new Date(),
  user: '',
  text: ''
};