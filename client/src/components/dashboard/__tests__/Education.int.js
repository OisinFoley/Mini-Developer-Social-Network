import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import ConnectedApp, { Education } from '../Education';

import { mockStore } from '../../../__mocks__/mockStore';

import { mockEducation } from '../../../__mocks__/mockEducation.js';


const deleteEducation = jest.fn();
const eduState = {
  education: mockEducation,
  deleteEducation
}

const props = {
  deleteEducation
};
const educationStore = mockStore(eduState);

// just need a bit of pateince with this one
  // it("mounts the Education component and, when delete button is pressed and confirmed, then deleteEducation() is called", () => {
  //   // const wrapper = mount(
  //   //   <Provider store={educationStore} props={props} >
  //   //     <Router>
  //   //       <ConnectedApp />
  //   //     </Router>
  //   //   </Provider>
  //   // );
  //   const wrapper = mount(<ConnectedApp store={educationStore} props={props} />);
  //   // const wrapper = shallow(<Education store={educationStore} deleteEducation={deleteEducation} education={mockEducation} props={props} />);
  //   const component = wrapper;

  //   console.log(component.debug());

  //   wrapper.find('#delete-education-btn-0').simulate('click');	
  //   let deleteProfileModal = wrapper.find('[modalTitle="Delete Profile"]');	

  //   console.log(deleteProfileModal.find(`button#${mockEducation[0]._id}`).debug())
  //   deleteProfileModal.find(`button#${mockEducation[0]._id}`).simulate('click');
  // })