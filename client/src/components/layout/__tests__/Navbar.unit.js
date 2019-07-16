import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Navbar from '../Navbar';
import { mockStore } from '../../../__mocks__/mockStore';
import { mockIsNotAuthState } from '../../../__mocks__/mockAuth';
import { mockProfiles } from '../../../__mocks__/mockProfiles';

const { user: { name, avatar } } = mockProfiles[0];
const clearCurrentProfile = jest.fn();
const logoutUser = jest.fn();
const isAuthenticatedState = {
  auth: {
    isAuthenticated: true,
    user: {
      avatar,
      name
    }
  }
};
const props = {
  clearCurrentProfile,
  logoutUser
}
const notAuthenticatedStore = mockStore(mockIsNotAuthState);
const isAuthenticatedStore = mockStore(isAuthenticatedState);

// a beforeach after fixing the test maybe ?

describe('<Navbar />', () => {
  it(`renders the Navbar component and,
    when authenticated, then it shows user's avatar and correct number of list items`, () => {
    const wrapper = shallow(<Navbar store={isAuthenticatedStore} props={props} />);
    const component = wrapper.dive();
    const img = component.find('img');
    const listItems = component.find('li');
    
    expect(img.get(0).props.src).toEqual(avatar);
    expect(img.get(0).props.alt).toEqual(name);
    expect(listItems.length).toEqual(4);


    // need further testing here

    // expect(component.find('Link').get(0).props.children).toEqual('Sign Up');
    // expect(component.find('Link').get(1).props.to).toEqual('/login');
    // expect(component.find('Link').get(1).props.children).toEqual('Login');
    // expect(component.find('Link').length).toEqual(2);
    
    // console.log(component.find('Link').get(0).props.to);
    // console.log(component.find('Link').get(0).props.children);
    // console.log(component.find('Link').length);

    // expect(store.getActions()).toMatchSnapshot();
  });

  // it("renders the Navbar component and, when clicking logout, then clearCurrentProfile is called 1 time", () => {
  //   const wrapper = shallow(<Navbar store={isAuthenticatedStore} props={props} />);
  //   const component = wrapper.dive();
  //   console.log(component.find('[id="navbar__logout-li"]').debug());
  //   component.find('[id="navbar__logout-li"]').simulate('click', {
  //     preventDefault: () => {
  //     }
  //   });
  //   // need to mock localStorage (in auth actions) for this to be passable
  //   // expect(clearCurrentProfile.mock.calls.length).toBe(1);
  // });

  

  // for some reason, this is looking for avatar, even though it's not needed - maybe need to do a beforeEach and afterEach
  // it("renders the Navbar component and, when not authenticated, it shows correct number of list items", () => {
  //   const wrapper = shallow(<Navbar store={notAuthenticatedStore} props={props} />);
  //   const component = wrapper.dive();
  //   const listItems = component.find('li');
    
  //   expect(listItems.length).toEqual(3);
  // });
});