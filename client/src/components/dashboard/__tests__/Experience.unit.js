import React from 'react';
import { shallow, mount } from 'enzyme';
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

// describe('<Experience />', () => {
//   // it("shallow renders the Experience component and, when experience info is provided, then experience info is rendered", () => {
//   //   const component = wrapper;

//   //   // console.log('i am a test and am starting to run');
//   //   // console.log(component.debug());
//   // })
 
  

// });