import ProfileAbout from '../ProfileAbout';
import { mockProfiles } from '../../../__mocks__/mockProfiles';

const profile = mockProfiles[0];
const mockProfileState = {
  profile
};
const mockProfileWithoutBioState = {
  profile: {
    ...mockProfileState.profile,
    bio: null
  }
}
let wrapper;
beforeEach(() => {
  wrapper = shallow(<ProfileAbout {...mockProfileState} />);
});

describe('<ProfileAbout />', () => {
  it("shallow renders ProfileAbout, and when user name and bio is provided, then it shows header saying {username}'s Bio, and user's bio", () => {
    const mainHeaderText = wrapper.find('h3').at(0).text();
    const usersBioParagraphText = wrapper.find('p').at(0).text().trim();

    expect(mainHeaderText).toEqual(`${profile.user.name}'s Bio`);
    expect(usersBioParagraphText).toEqual(`${profile.bio}`);
  });

  it(`shallow renders ProfileAbout, and when bio isn't provided, then it shows {username} does not have a bio `, () => {
    wrapper = shallow(<ProfileAbout {...mockProfileWithoutBioState} />);
    const usersBioParagraphText = wrapper.find('p').at(0).text().trim();

    expect(usersBioParagraphText).toEqual(`${profile.user.name} does not have a bio`);
  });
})