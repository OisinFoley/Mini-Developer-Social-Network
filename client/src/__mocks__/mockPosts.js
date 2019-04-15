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
// export const { deletedPostId } = '5c96bf2a0bc6cd1e4127481e';

export const mockPosts = [
  {
    "date": "2018-12-17T19:19:22.980Z",
    "_id": "5c17f746d586af43b4e2cae6",
    "text": "Ever used SMACSS or BEM to organise your CSS?\nDid you find it improved your workflow?",
    "name": "Oisín Foley",
    "user": "5be772318a0efa11e7a68014",
    "avatar": "https://fakeAvatar.com",
    "likes": [
      {
        "_id": "5c17f7c8d586af43b4e2caec",
        "user": "5bea114159b84a0e35b41d33"
      },
      {
        "_id": "5c17f7bfd586af43b4e2caeb",
        "user": "5be772318a0efa11e7a68014"
      }
    ],
    "comments": [
      {
        "date": "2018-12-19T18:00:17.567Z",
        "_id": "5c1a886a6cbdd01bd0d3f27e",
        "text": "Won't you please test me ?",
        "name": "Oisín Foley",
        "avatar": "https://fakeAvatar.com",
        "user": "5be772318a0efa11e7a68014"
      },
      {
        "date": "2018-12-17T19:19:22.980Z",
        "_id": "5c17f824d586af43b4e2caed",
        "text": "I found that SMACSS made it easier to find the styles I wanted to change without having to dig through all my stylesheets. \nCannot speak for BEM as I haven't read up about it or used it yet.",
        "name": "John Eamon",
        "avatar": "fakeAvatar.gov",
        "user": "5bea114159b84a0e35b41d33"
      }
    ]
  }
];