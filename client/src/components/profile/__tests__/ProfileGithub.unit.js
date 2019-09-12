import ProfileGithub from '../ProfileGithub';
import { githubInfo } from '../../../__mocks__/mockGithubInfo';

const props = {
  username: 'test_username',
  repos: []
};

let wrapper;
let mockSuccessResponse;
let mockJsonPromise;
let mockFetchPromise;
beforeEach(() => {
  mockSuccessResponse = githubInfo;
  mockJsonPromise = Promise.resolve(mockSuccessResponse);
  mockFetchPromise = Promise.resolve({
    json: () => mockJsonPromise,
  });
  jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
});

describe('<ProfileGithub />', () => {
  it("mounts ProfileGithub, and fetches the repo data, then repos state matches the data returned from the mocked api call", done => {
    const wrapper = mount(<ProfileGithub {...props} />);
                            
    process.nextTick(() => {
      expect(wrapper.state().repos).toEqual(githubInfo);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      global.fetch.mockClear();
      done();
    });
  });

  mockSuccessResponse = [];
  it(`mounts ProfileGithub, and when no repo data is returned from api call, then it shows text saying 'No repos to display' `, () => {
    const wrapper = mount(<ProfileGithub {...props} />);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(
      wrapper.find('#profile-github__info-container')
        .text()
        .includes('No repos to display for this username')
    )
    .toEqual(true);
  });
});