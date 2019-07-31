import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Education } from '../Education';
import { mockEducation } from '../../../__mocks__/mockEducation.js';

const deleteEducation = jest.fn();
const eduState = {
  education: mockEducation,
  deleteEducation
}

describe('<Education />', () => {
  it("mounts the Education component and, when delete button is pressed and confirmed, then deleteEducation() is called", () => {
    const wrapper = mount(<Education {...eduState} />);

    wrapper.find('#delete-education-btn-0').simulate('click');	
    let deleteEducationModal = wrapper.find('[modalTitle="Delete Education"]');	
    deleteEducationModal = deleteEducationModal.at(0);
    deleteEducationModal.find(`button[id="${mockEducation[0]._id}"]`).simulate('click');

    expect(deleteEducation.mock.calls.length).toBe(1);
  });
});