import mockAxios from 'axios';
import * as actions from '../authActions';

describe("registerUser", () => {
  let mock;
  beforeEach(() => {
    mock = jest.spyOn(mockAxios, 'post');
  });
  afterEach(() => {
    mock.mockRestore();
  });

  it('should register the user and redirect to login', async () => {
    const push = jest.fn();
    const history = { push };
    const dispatch = jest.fn();

    await actions.registerUser('the user data', history)(dispatch);

    expect(mock).toHaveBeenCalledWith('/api/users/register', 'the user data');
    expect(history.push).toHaveBeenCalledWith('/login');
  });
});