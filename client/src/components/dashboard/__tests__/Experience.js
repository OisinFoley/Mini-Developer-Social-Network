import React from 'react';
import { shallow, mount } from 'enzyme';

import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import ConnectedExperience, { Experience } from '../Experience';
import thunk from "redux-thunk";

const mockStore = configureStore([thunk]);

import { mockExperience } from '../../../__mocks__/mockExperience.js';

const expState = {
  experience: mockExperience
}

const deleteExperience = jest.fn();

// const props = {
//   // experience: mockExperience,
//   deleteExperience: jest.fn()
// };

const experienceStore = mockStore(expState);

describe('<Experience />', () => {
  it("shallow renders the Experience component and, when experience info is provided, then experience info is rendered", () => {
    const wrapper = shallow(
      <Experience deleteExperience={deleteExperience} experience={mockExperience}  />
    );
    const component = wrapper;

    // console.log('i am a test and am starting to run');
    // console.log(component.debug());
  })
 
  // it("shallow renders the Education component and, when delete button is pressed and confirmed, then deleteEducation() is called", () => {
  //   const wrapper = shallow(<Education store={educationStore} props={props} />);
  //   const component = wrapper.dive();

  //   console.log(component.debug());

  //   wrapper.find('#delete-education-btn-0').simulate('click');	
  //   let deleteProfileModal = wrapper.find('[modalTitle="Delete Profile"]');	

  //   console.log(deleteProfileModal.find(`button#${mockEducation[0]._id}`).debug())
  //   deleteProfileModal.find(`button#${mockEducation[0]._id}`).simulate('click');
  // })

});