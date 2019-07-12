import React from 'react';
import { shallow, mount } from 'enzyme';

import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import Experience from '../Experience';
import thunk from "redux-thunk";

const mockStore = configureStore([thunk]);

// import { mockExperience } from '../../../__mocks__/mockExperience.js';

export const mockExperience = [
  {
    "current":true,
    "_id":"5be841c2bce4001d09376bda",
    "title":"Full Stack Developer",
    "company":"Beijer Electronics AB",
    "location":"Malmo, Sweden",
    "from":"2017-10-23T00:00:00.000Z",
    "to":null,
    "description":"Fullstack web development position utilising .NET Core and EmberJs (among others), working toward creating IoT-friendly applications."
  },
  {
    "current":false,
    "_id":"5be8416cbce4001d09376bd9",
    "title":"Intern",
    "company":"Fastcom Telecom",
    "location":"Sligo, Ireland",
    "from":"2015-03-30T00:00:00.000Z",
    "to":"2015-08-28T00:00:00.000Z",
    "description":"Created Javascript and Visual Basic scripts to run network analyses and then output the results using graphics provided by D3js."
  }
]

// console.log(mockExperience);

const expState = {
  experience: mockExperience
}

// console.log(expState);
// console.log(expState.experience);
// expState.experience.map((aaa, i) => {
//   console.log(i);
// })


const props = {
  // experience: mockExperience,
  deleteExperience: jest.fn()
};

// console.log(eduState);

const experienceStore = mockStore(expState);

describe('<Experience />', () => {
  it("shallow renders the Experience component and, when experience info is provided, then experience info is rendered", () => {
    const wrapper = shallow(
      <Provider store={experienceStore} props={props} >
        <Router>
          <Experience store={experienceStore} props={props} />
        </Router>
      </Provider>
    );
    const component = wrapper.dive();

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