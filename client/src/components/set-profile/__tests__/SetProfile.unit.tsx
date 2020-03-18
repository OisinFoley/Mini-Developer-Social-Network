import { SetProfile } from '../SetProfile';

const setProfile = jest.fn();
const getCurrentProfile = jest.fn();
const profile = {};
const errors = {};
const mockState = {
  profile,
  setProfile,
  getCurrentProfile,
  errors
};

let wrapper;
beforeEach(() => {
  wrapper = shallow(<SetProfile {...mockState} />);
});

describe('<SetProfile />', () => {
  it("shallow renders SetProfile, then headers are shown", () => {
    const mainHeaderText = wrapper.find('h1');
    const subHeading = wrapper.find('p');
    const textFieldGroupList = wrapper.find('TextFieldGroup');
    const textAreaFieldGroupList = wrapper.find('TextAreaFieldGroup');
    
    expect(mainHeaderText.text()).toEqual(`Create Profile`);
    expect(subHeading.text()).toEqual(`Provide info to make your profile stand out`);
    expect(textFieldGroupList.length).toEqual(6);
    expect(textAreaFieldGroupList.length).toEqual(1);
  });

  it("shallows renders SetProfile, and when onSubmit event is fired, then it calls SetProfile action", () => {
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(setProfile.mock.calls.length).toEqual(1);
  });

  it(`shallows renders SetProfile, and when 'Add Social Network Links' button is clicked, 
    then displaySocialInputs state updates and 5 additional inputs are displayed`, () => {
      expect(wrapper.state().displaySocialInputs).toEqual(false);
      expect(wrapper.find('InputGroup').length).toEqual(0);
      wrapper.find('button[type="button"]').simulate('click');

      expect(wrapper.state().displaySocialInputs).toEqual(true);
      expect(wrapper.find('InputGroup').length).toEqual(5);
      wrapper.find('button[type="button"]').simulate('click');

      expect(wrapper.state().displaySocialInputs).toEqual(false);
      expect(wrapper.find('InputGroup').length).toEqual(0);
  });
});

