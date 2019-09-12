import React from 'react';
import { configure, shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mockStore } from './__mocks__/mockStore';
configure({ adapter: new Adapter() });

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  jwtToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTc3MjMxOGEwZWZhMTFlN2E2ODAxNCIsIm5hbWUiOiJPaXPDrW4gRm9sZXkiLCJhdmF0YXIiOiJodHRwczovL2FuZ2VsLmNvL2Nkbi1jZ2kvaW1hZ2Uvd2lkdGg9MjAwLGhlaWdodD0yMDAsZm9ybWF0PWF1dG8sZml0PWNvdmVyL2h0dHBzOi8vZDFxYjJuYjVjem5hdHUuY2xvdWRmcm9udC5uZXQvdXNlcnMvMjA5NDkzMi1vcmlnaW5hbD8xNTYzNzI1OTgyIiwiaWF0IjoxNTYzODE5NDUxLCJleHAiOjE1NjM4MjMwNTF9.iHngRNoz-WinG9GNVMYWq1-y0H0hao29G5DxwLklEnI'
};

global.localStorage = localStorageMock;
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
global.mockStore = mockStore;