const profiles = [{
  "_id": "5d4c5dd08a0743f89b9f7078",
  "skills": [
    "Javascript",
    " Python",
    " Selenium"
  ],
  "date": "2019-08-06T13:06:01.309Z",
  "user": "5d4c5ddd1bf0b3474c7af3b7",
  "handle": "123qwert",
  "company": "123qwert EMEA",
  "website": "https://iamfake.com.au",
  "location": "Madagascar",
  "status": "QA / Tester",
  "social": [
    {
      "_id": "5d4c5de468064c4077d71db9",
      "youtube": "https://someFakeYoutubeUrl.com",
      "facebook": "https://someFakeFacebookUrl.com",
      "twitter": "https://someFakeTwitterUrl.com",
      "linkedin": "https://someFakeLinkedinUrl.com",
      "instagram": "https://someFakeInstagramUrl.com"
    }
  ],
  "experience": [
    {
      "current": false,
      "_id": "5d4c5dec5b62789cbc86d014",
      "title": "FakeTitle",
      "company": "FakeExperience",
      "location": "FakeTown, British Columbia",
      "from": "2017-12-31T00:00:00.000Z",
      "to": "2018-10-31T00:00:00.000Z",
      "description": "Doing fake stuff for testing purposes."
    }
  ],
  "education": [
    {
      "current": false,
      "_id": "5d4c5df704347a3d899893d1",
      "school": "Testing Institute",
      "degree": "Msc. in Testing",
      "fieldOfStudy": "Hypothesising",
      "from": "2015-10-29T00:00:00.000Z",
      "to": "2016-10-30T00:00:00.000Z",
      "description": "Here I learned how to test."
    }
  ],
  "bio": "A fake profile, to be used as mock data during testing"
}, {
  "_id": "5d4c5e02d44bfe8b1a96ca3f",
  "skills": [
    "C#"
  ],
  "date": "2019-08-06T13:06:01.309Z",
  "user": "5d497baeed8f0b4d00e98765",
  "handle": "alternate_test_handle",
  "company": "fake company EMEA",
  "website": "https://iamalsofake.ca",
  "location": "Norway",
  "status": "Developer",
  "social": null,
  "experience": null,
  "education": null,
  "bio": "A second fake profile, for comparing expected with actual values"
}];

module.exports = profiles;