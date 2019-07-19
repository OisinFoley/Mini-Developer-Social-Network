import React from 'react';
import { shallow } from 'enzyme';
import { PostForm } from '../PostForm';
// import { mockProfiles } from '../../../__mocks__/mockProfiles';

const addPost = jest.fn();

describe('<PostForm />', () => {
  it(`shallows renders PostForm,
    and when onSubmit event is fired,
    then it calls addPost action`, () => {
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(addPost.mock.calls.length).toEqual(1);
  })
});

