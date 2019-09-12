import ConnectedRegister from '../Register';
import { mockIsNotAuthState } from '../../../__mocks__/mockAuth';

const isNotAuthState = {
  ...mockIsNotAuthState
}
const mockIsNotAuthStore = mockStore(isNotAuthState);

let wrapper;
beforeEach(() => {
  wrapper = mount(<ConnectedRegister store={mockIsNotAuthStore} />);
});

it("name, email, password and verify password inputs are updated, then state is updated", () => {
  wrapper.find('input[name="name"]').simulate('change', { target: { name: 'name' , value: 'test_name' } })
  wrapper.find('input[name="email"]').simulate('change', { target: { name: 'email' , value: 'test@email.com' } })
  wrapper.find('input[name="password"]').simulate('change', { target: { name: 'password' , value: '123FakeStreet!' } })
  wrapper.find('input[name="password2"]').simulate('change', { target: { name: 'password2' , value: '123FakeStreet!' } })

  let updatedNameState = wrapper.children().state().name;
  let updatedEmailState = wrapper.children().state().email;
  let updatedPasswordState = wrapper.children().state().password;
  let updatedPassword2State = wrapper.children().state().password2;

  expect(updatedNameState).toEqual(`test_name`);
  expect(updatedEmailState).toEqual(`test@email.com`);
  expect(updatedPasswordState).toEqual(`123FakeStreet!`);
  expect(updatedPassword2State).toEqual(`123FakeStreet!`);
})