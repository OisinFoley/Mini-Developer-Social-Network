import { AddEducation } from '../AddEducation';

const addEducation = jest.fn();

let wrapper;
beforeEach(() => {
  wrapper = shallow(<AddEducation addEducation={addEducation} />);
});

describe('<AddEducation />', () => {
  it("shallow renders the AddEducation component and AddEducation form is shown", () => {
    const mainHeaderText = wrapper.find('h1');
    const subHeading = wrapper.find('p');
    const textAreaFieldGroupList = wrapper.find('TextFieldGroup');
    const form = wrapper.find('form');

    expect(mainHeaderText.text()).toEqual(`Add Education`);
    expect(subHeading.text()).toEqual(`Add academic education or coding training you've attended`);
    expect(textAreaFieldGroupList.length).toEqual(5);
    expect(form.length).toEqual(1);
  });

  it(`shallows renders AddEducation,
    and when onSubmit event is fired,
    then it calls AddEducation action`, () => {
    const form = wrapper.find('form');

    form.simulate('submit', {
      preventDefault: () => {
      }
    });

    expect(addEducation.mock.calls.length).toEqual(1);
  });
});
