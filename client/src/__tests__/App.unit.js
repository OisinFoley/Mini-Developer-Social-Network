import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import App from '../App';
import Landing from '../components/layout/Landing';
import Register from '../components/auth/Register';

describe('<App />', () => {
  test("empty path should direct to Landing", () => {

    // can always try unconnected if not working

    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/' ]}>
        <App/>
      </MemoryRouter>
    );
    console.log(wrapper.find(Landing).length);
    console.log(wrapper.find(Landing).debug());
    expect(wrapper.find(Landing)).toHaveLength(1);
    expect(wrapper.find(Register)).toHaveLength(0);
  });
})