import { PostForm } from '../PostForm';
import { mockAuth } from '../../../__mocks__/mockAuth';

const addPost = jest.fn();
const { auth } = mockAuth;
const errors = {};
const props = {
  addPost,
  auth,
  errors
};

let wrapper;
beforeEach(() => {
  wrapper = shallow(<PostForm {...props} />);
});

describe('<PostForm />', () => {
  it(`shallows renders PostForm,
    and when onSubmit event is fired,
    then it calls addPost action`, () => {
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(addPost.mock.calls.length).toEqual(1);
  })
});

