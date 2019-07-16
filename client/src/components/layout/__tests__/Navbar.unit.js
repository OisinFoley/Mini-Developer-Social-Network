import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Navbar } from '../Navbar';
import { mockProfiles } from '../../../__mocks__/mockProfiles';

const { user: { name, avatar } } = mockProfiles[0];
const clearCurrentProfile = jest.fn();
const logoutUser = jest.fn();
const isAuthState = {
  auth: {
    isAuthenticated: true,
    user: {
      avatar,
      name
    }
  }
};
const isNotAuthState = {
  auth: {
    ...isAuthState.auth,
    isAuthenticated: false
  }
};

let wrapper;

describe('<Navbar />', () => {

  describe('Is auth tests', () => {
    beforeEach(() => {
      wrapper = shallow(<Navbar 
        {...isAuthState} 
        logoutUser={logoutUser}
        clearCurrentProfile={clearCurrentProfile} />
      );    
    });
    it(`renders the Navbar component and,
      when authenticated, then it shows user's avatar and correct number of list items`, () => {
      const listItems = wrapper.find('li');

      expect(wrapper.find('img').get(0).props.src).toEqual(avatar);
      expect(wrapper.find('img').get(0).props.alt).toEqual(name);
      expect(listItems.length).toEqual(4);
    });

    it("renders the Navbar component and, when clicking logout, then clearCurrentProfile is called 1 time", () => {
      wrapper.find('[id="navbar__logout-li"]').simulate('click', {
        preventDefault: () => {
        }
      });

      expect(clearCurrentProfile.mock.calls.length).toBe(1);
    });
  });

  describe('Not auth tests', () => {
    beforeEach(() => {
      wrapper = shallow(<Navbar 
        {...isNotAuthState} logoutUser={logoutUser} />
      );
    });
    it(`renders the Navbar component and,
      when not authenticated, then it shows guest links`, () => {
      expect(wrapper.find('Link').get(2).props.children).toEqual('Sign Up');
      expect(wrapper.find('Link').get(2).props.to).toEqual('/register');
      expect(wrapper.find('Link').get(3).props.children).toEqual('Login');
      expect(wrapper.find('Link').get(3).props.to).toEqual('/login');
      expect(wrapper.find('Link').length).toEqual(4);
      // expect(store.getActions()).toMatchSnapshot();
    });

    it("renders the Navbar component and, when not authenticated, it shows correct number of list items", () => {
      const listItems = wrapper.find('li');

      expect(listItems.length).toEqual(3);
    });
  });
});