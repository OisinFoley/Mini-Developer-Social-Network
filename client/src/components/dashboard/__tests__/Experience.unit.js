import React from 'react';
import { shallow } from 'enzyme';
import { Experience } from '../Experience';
import { mockExperience } from '../../../__mocks__/mockExperience.js';
const deleteExperience = jest.fn();
const expState = {
  experience: mockExperience,
  deleteExperience
}
let wrapper;
beforeEach(() => {
  wrapper = shallow(<Experience {...expState}  />);
});

describe('<Experience />', () => {
  it("shallow renders the Experience component and, when experience info is provided, then experience info is rendered", () => {
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