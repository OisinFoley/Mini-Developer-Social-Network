import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import ConnectedApp, { Education } from '../Education';
import thunk from "redux-thunk";

const mockStore = configureStore([thunk]);

import { mockEducation } from '../../../__mocks__/mockEducation.js';


const deleteEducation = jest.fn();
// console.log(mockEducation);

const eduState = {
  education: mockEducation
}

// const props = {
//   education: mockEducation,
//   deleteEducation
// };

const props = {
  // education: mockEducation,
  deleteEducation
};

// console.log(eduState);

const educationStore = mockStore(eduState);

describe('<Education />', () => {
  it("shallow renders the Education component and, when education info is provided, then education info is rendered", () => {
    const wrapper = shallow(<Education deleteEducation={deleteEducation} education={mockEducation} props={props} />);
    let tbody = wrapper.find('tbody');
    let tdList = tbody.find('tr').find('td');

    expect(tdList.get(0).props.children).toEqual('IT Sligo');
    expect(tdList.get(1).props.children).toEqual('Bsc. Software Development');
  })
 
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

});