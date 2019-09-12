// import { BrowserRouter as Router } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import ConnectedProfile from '../Profile';
// // import { mockIsNotAuthState } from '../../../__mocks__/mockAuth';

// const getProfileByHandle = jest.fn();
// const push = jest.fn();
// const history = { push };

// const isLoadingState = {
//   profile: {
//     profile: null,
//     loading: true
//   },
//   match: {
//     params: {
//       handle: 'test_handle'
//     }
//   },
//   getProfileByHandle
// };

// const mockIsLoadingStore = mockStore(isLoadingState);

// // let wrapper;
// // beforeEach(() => {
// //   wrapper = mount(<ConnectedLogin store={mockIsNotAuthStore} />);
// // });

// describe('<Profile />', () => {
 
//   it(`shallow renders Profile, and when profile is null, then it renders Spinner component`, () => {
//     const wrapper = mount(
//       <Provider store={mockIsLoadingStore} >
//         <Router>
//           <ConnectedProfile />
//         </Router>
//       </Provider>
//     );
    
//     // const wrapper = shallow(<Profile profile={nullProfile} />);
//     const spinnerComponent = wrapper.find('Spinner');

//     console.log(wrapper.debug())

//     expect(spinnerComponent.length).toEqual(1);
//   });
// })