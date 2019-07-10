import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import Education from '../Education';
import thunk from "redux-thunk";

const mockStore = configureStore([thunk]);

import { mockEducation } from '../../../__mocks__/mockEducation.js';

const props = {
  deleteEducation: jest.fn()
};

// console.log(mockEducation);

const eduState = {
  education: mockEducation
}

console.log(eduState);

const educationStore = mockStore(eduState);

describe('<Education />', () => {
  it("shallow renders the Education component and, when education info is provided, then education info is rendered", () => {
    const wrapper = shallow(<Education store={educationStore} props={props} />);
    const component = wrapper.dive();

    console.log(component.debug());
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