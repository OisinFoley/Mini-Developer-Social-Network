import { Educations } from '../Educations';
import { mockEducation } from '../../../__mocks__/mockEducation.js';

const deleteEducation = jest.fn();
const eduState = {
  education: mockEducation,
  deleteEducation
}
let wrapper;
beforeEach(() => {
  wrapper = shallow(<Educations {...eduState} />);
});

describe('<Education />', () => {
  it("shallow renders the Educations component and, when education info is provided, then education info is rendered", () => {
    let tbody = wrapper.find('tbody');
    let tdList = tbody.find('tr').find('td');

    expect(tdList.get(0).props.children).toEqual('IT Sligo');
    expect(tdList.get(1).props.children).toEqual('Bsc. Software Development');
  })
});