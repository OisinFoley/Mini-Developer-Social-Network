import ConnectedLogin from '../Login';
import { mockIsNotAuthState } from '../../../__mocks__/mockAuth';

const loginUser = jest.fn();
let isNotAuthState = {
  ...mockIsNotAuthState,
  loginUser
}
const mockIsNotAuthStore = mockStore(isNotAuthState);

let wrapper;
beforeEach(() => {
  wrapper = mount(<ConnectedLogin store={mockIsNotAuthStore} />);
});

it("email and password inputs are updated, then state is updated", () => {
  wrapper.find('input[type="email"]').simulate('change', { target: { name: 'email' , value: 'test@email.com' } })
  wrapper.find('input[type="email"]').simulate('change', { target: { name: 'password' , value: '123FakeStreet' } })

  let updatedEmailState = wrapper.children().state().email;
  let updatedPasswordState = wrapper.children().state().password;

  expect(updatedEmailState).toEqual(`test@email.com`);
  expect(updatedPasswordState).toEqual(`123FakeStreet`);
})