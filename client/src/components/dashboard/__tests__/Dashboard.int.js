
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConnectedDashboard, { Dashboard } from '../Dashboard';
import { mockProfiles } from '../../../__mocks__/mockProfiles';

const deleteAccount = jest.fn();
const { user: { name } } = mockProfiles[0];
const { handle } = mockProfiles[0];
const auth = {
  user: {
    name
  }
}

const profile = {
  profile: {
    profile: {
      handle,
      experience: [],
      education: []
    },
    experience: [],
    education: [],
    loading: false
  },
  deleteAccount
}

const dashboardState = {
  profile,
  auth,
  getCurrentProfile: jest.fn(),
  deleteAccount: jest.fn()
};

const mockDashboardStore = mockStore(dashboardState);

describe('<Dashboard />', () => {
  // it(`mounts the Dashboard component and, when 'Delete my Account' is clicked and confirmed,
  //   then deleteAccount function is called once`, () => {

  //   // need to tidy this up before it'll pass
  //   // must you use store (i.e. - connected component, so that you can automatically pass props down to edu and exp
    
  //   // const wrapper = mount(
  //   // <Provider store={mockDashboardStore} profile={profile} deleteAccount={deleteAccount} >
  //   //   <Router>
  //   //     <ConnectedDashboard deleteAccount={deleteAccount} />
  //   //   </Router>
  //   // </Provider>
  //   // );

  //   const wrapper = mount(      
  //         <Dashboard {...dashboardState} />
  //     );

  //   wrapper.find('.dashboard__delete-account-btn').simulate('click');	
  //   let deleteProfileModal = wrapper.find('[modalTitle="Delete Profile"]');
      
  //   // console.log(wrapper.props().props.deleteAccount.mock.calls.length);
  //   // console.log(deleteProfileModal.find('button#delete-profile-modal-confirm-btn').debug())
  //   deleteProfileModal.find('button#delete-profile-modal-confirm-btn').simulate('click');

  //   expect(deleteAccount.mock.calls.length).toBe(1);
  // });
});