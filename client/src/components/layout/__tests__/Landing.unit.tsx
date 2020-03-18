import Landing from '../Landing';
import { mockIsAuthState, mockIsNotAuthState } from '../../../__mocks__/mockAuth';

const push = jest.fn();
const history = { push };
const isNotAuthenticatedStore = mockStore(mockIsNotAuthState);
const isAuthenticatedStore = mockStore(mockIsAuthState);

describe('<Landing />', () => {
  it('renders the Landing page when not authenticated', () => {
    const wrapper = shallow(<Landing store={isNotAuthenticatedStore} />);
    const component = wrapper.dive();
    let linkComponents = component.find('Link');

    expect(linkComponents.get(0).props.to).toEqual('/register');
    expect(linkComponents.get(0).props.children).toEqual('Sign Up');
    expect(linkComponents.get(1).props.to).toEqual('/login');
    expect(linkComponents.get(1).props.children).toEqual('Login');
    expect(linkComponents.length).toEqual(2);
  });


  it('pushes /dashboard to history when isAuthenticated is true', () => {
    const wrapper = shallow(<Landing store={isAuthenticatedStore} history={history} />);
    wrapper.dive();

    expect(history.push).toHaveBeenCalledWith('/dashboard');
  });
});