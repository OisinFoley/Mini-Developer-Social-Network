export const newPost = {
  "avatar": "https://fakeAvatar.com",
  "comments": [],
  "date": "2019-03-23T23:07:09.622Z",
  "likes": [],
  "name": "Oisín Foley",
  "text": "test 123",
  "user": "5be772318a0efa11e7a68014",
  "_id": "5c96bca37eddc8185dd51aad"
};

export const deletedPostId = ['5c96bf2a0bc6cd1e4127481e'];

export const mockPosts = [
  {
    "date": "2018-12-17T19:19:22.980Z",
    "_id": "5c17f746d586af43b4e2cae6",
    "text": "sample test text",
    "name": "Oisín Foley",
    "user": "test_id",
    "avatar": "https://fakeAvatar.com",
    "likes": [{
      "_id":"5d1c3c97a5aa791b72152b17","user":"test_id2",
      "_id":"12345c97a5aa791b72112345","user":"test_id"
    }],
    "comments": [{
      "date":"2019-05-13T20:10:25.251Z",
      "_id":"5cd9da2ca5aa791b72152af4",
      "text":"I am a test comment",
      "name":"Oisín Foley",
      "avatar":"https://test_avatar.com",
      "user":"5be772318a0efa11e7a68014"
    }]
  }
];

export const likesListToTriggerFalsy = [{
  "_id":"5d1c3c97a5aa791b72152b17",
  "user":"test_id_12345",
}];