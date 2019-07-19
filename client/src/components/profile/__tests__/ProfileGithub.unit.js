// import React from 'react';
// import { shallow } from 'enzyme';
// import ProfileGithub from '../ProfileGithub';
// import { githubInfo } from '../../../__mocks__/mockGithubInfo';

// // const profile = mockProfiles[0];
// // const mockProfileState = {
// //   profile
// // };
// // const mockProfileWithoutBioState = {
// //   profile: {
// //     ...mockProfileState.profile,
// //     bio: null
// //   }
// // }

// const props = {
//   username: 'test_username',
//   repos: []
// };

// let wrapper;
// beforeEach(() => {
//   wrapper = shallow(<ProfileGithub {...props} />);
// });

// describe('<ProfileGithub />', () => {
//   it("shallow renders ProfileGithub, and fetches the repo data, then it displays the data", done => {
//     const mockSuccessResponse = {githubInfo};
//     const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
//     const mockFetchPromise = Promise.resolve({ // 3
//       json: () => mockJsonPromise,
//     });
//     jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); // 4
    
//     const wrapper = shallow(<ProfileGithub />); // 5
                            
//     expect(global.fetch).toHaveBeenCalledTimes(1);
//     // expect(global.fetch).toHaveBeenCalledWith('https://url-of-your-server.com/example/json');

//     console.log(wrapper.state());

//     process.nextTick(() => { // 6
//       // expect(wrapper.state().repos).toEqual(githubInfo);

//       global.fetch.mockClear(); // 7
//       done(); // 8
//     });
  
    
//     // const mainHeaderText = wrapper.find('h3').at(0).text();
//     // const usersBioParagraphText = wrapper.find('p').at(0).text().trim();

//     // expect(mainHeaderText).toEqual(`${profile.user.name}'s Bio`);
//     // expect(usersBioParagraphText).toEqual(`${profile.bio}`);
//   });

//   // it(`shallow renders ProfileGithub, and when bio isn't provided, then it shows {username} does not have a bio `, () => {
//   //   wrapper = shallow(<ProfileGithub {...mockProfileWithoutBioState} />);
//   //   const usersBioParagraphText = wrapper.find('p').at(0).text().trim();

//   //   expect(usersBioParagraphText).toEqual(`${profile.user.name} does not have a bio`);
//   // });
// })