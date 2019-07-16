import React from 'react';
import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConnectedDashboard, { Dashboard } from '../Dashboard';

const auth = {
  user: {
    name
  }
}

const profile = {
  profile: {
    profile: {
      handle,
      experience: [{}],
      education: [{}]
    },
    loading: loadingFalse
  }
}

// fix this next time you are active - see example in Login.js
  // this one is a little trickier than the expect call to have been made that we see in Login,
  // because here, we must mount in order to access the confirm delete btn in the modal, and mounting renders the connect() wrapper

  // it(`mounts the Dashboard component and, when 'Delete my Account' is clicked, a modal appears and after confirming
  //   then deleteAccount function is called once`, () => {

  //   // const wrapper = mount(
  //   //   <Provider store={hasProfileStore} props={props} >      
  //   //     <Router >
  //   //       <Dashboard />
  //   //     </Router>
  //   //   </Provider>
  //   // );

  //   // fix this next time you are active - see example in Login.js

  //   const wrapper = mount(<Dashboard 
  //       getCurrentProfile={getCurrentProfile}
  //       deleteAccount={deleteAccount}
  //       auth={auth}
  //       profile={profile}
  //      />);
  //     //  store={hasProfileStore} props={props}

  //   wrapper.find('.dashboard__delete-account-btn').simulate('click');	
  //   let deleteProfileModal = wrapper.find('[modalTitle="Delete Profile"]');
  
  //   // this returns the props that were passed into the component, and they're also returning 0, whether for the action, or the class prop which is an arrow function
  //   console.log(wrapper.props().props.deleteAccount.mock.calls.length);
 
  //   // console.log(deleteProfileModal.find('button#delete-profile-modal-confirm-btn').debug())
  //   deleteProfileModal.find('button#delete-profile-modal-confirm-btn').simulate('click');

  //   expect(onDeleteProfileClick.mock.calls.length).toBe(1);
  // })