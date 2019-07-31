import React from 'react';
import { shallow } from 'enzyme';
import ProfileCreds from '../ProfileCreds';
import { mockExperience, mockExpNoCompanyOrLocation } from '../../../__mocks__/mockExperience';
import { mockEducation } from '../../../__mocks__/mockEducation';

// tidy the mock exp file so that it is formatted the same as mock edu, and use object assing like you do when creating variations of same object for education
// some of the code coverage may not be passing for this component because we passed null to some props, when we are checking for empty string in the jsx,
// and likewise, in some situations we are passing an empty string, when maybe we should pass null to the jsx check

const experience = mockExperience;
const education = mockEducation;
const educationOngoing = {
  ...education[0],
  current: true,
  to: null
};
const educationNoDescription = {...education[0], description: null};

const expStateOngoingJob = {
  experience,
  education: []
};
const expStateWithDefinedToDate = {
  experience: [mockExperience[1]],
  education: []
}
const expStateNoCompanyOrLocation = {
  experience: mockExpNoCompanyOrLocation,
  education: []
}

const eduStateOngoingStudy = {
  experience: [],
  education: [educationOngoing]
};
const eduStateWithDefinedToDate = {
  experience: [],
  education: [mockEducation[0]]
}
const eduStateNoDescription = {
  experience: [],
  education: [educationNoDescription]
}


const mockCredsWithoutExperienceState = {
  // profile: {
  //   ...mockProfileState.profile,
  //   bio: null
  // }
}
const mockCredsWithoutEducationState = {
  // profile: {
  //   ...mockProfileState.profile,
  //   bio: null
  // }
}

describe('<ProfileCreds /> Experience testing', () => {
  it(`shallow renders ProfileCreds, and when experience is provided and ongoing,
    then it populates 'company', 'from', 'to', 'location', 'description' fields, and 'to' displays: ' Now'`, () => {
    const wrapper = shallow(<ProfileCreds {...expStateOngoingJob} />);
    const companyHeader = wrapper.find('h4').at(0).text();
    const momentFrom = wrapper.find('t').at(0).children().text();
    const momentTo = wrapper.find('p').at(0).text().split('-')[1].trim(); // jsx => "<Moment>{from date}</Moment> - Now"
    const title = wrapper.find('p').at(1).text();
    const location = wrapper.find('p').at(2).text();
    const description = wrapper.find('p').at(3).text();

    expect(companyHeader).toEqual(experience[0].company);
    expect(momentFrom).toEqual(experience[0].from);
    expect(momentTo).toEqual('Now');
    expect(title).toEqual(`Position: ${experience[0].title}`);
    expect(location).toEqual(`Location: ${experience[0].location}`);
    expect(description).toEqual(`Description: ${experience[0].description}`);
  });

  it(`shallow renders ProfileCreds, and when experience is provided with specified 'to' prop (end date), then it is displayed `, () => {
    const wrapper = shallow(<ProfileCreds {...expStateWithDefinedToDate} />);
    const momentTo = wrapper.find('t').at(1).children().text(); // jsx => "<Moment>{from date}</Moment> - <Moment>{to date}</Moment>"

    expect(momentTo).toEqual(`${mockExperience[1].to}`);
  });

  it("shallow renders ProfileCreds, and when experience is provided without location or description, then no info is displayed for those 2 fields", () => {
    const wrapper = shallow(<ProfileCreds {...expStateNoCompanyOrLocation} />);
    const companyHeader = wrapper.find('h4').at(0).text();
    const location = wrapper.find('p').at(2).text();

    expect(companyHeader).toEqual('');
    expect(location).toEqual(``);
  });
});

describe('<ProfileCreds /> Education testing', () => {
  it(`shallow renders ProfileCreds, and when education is provided and ongoing,
    then it populates 'school', 'from', 'to', 'degree', 'fieldOfStudy' 'description' fields, and 'to' displays: ' Now'`, () => {
    const wrapper = shallow(<ProfileCreds {...eduStateOngoingStudy} />);
    const schoolHeader = wrapper.find('h4').at(0).text();
    const momentFrom = wrapper.find('t').at(0).children().text();
    const momentTo = wrapper.find('p').at(1).text().split('-')[1].trim(); // jsx => "<Moment>{from date}</Moment> - Now"
    const degree = wrapper.find('p').at(2).text();
    const fieldOfStudy = wrapper.find('p').at(3).text();
    const description = wrapper.find('p').at(4).text();

    expect(schoolHeader).toEqual(education[0].school);
    expect(momentFrom).toEqual(education[0].from);
    expect(momentTo).toEqual('Now');
    expect(degree).toEqual(`Degree: ${education[0].degree}`);
    expect(fieldOfStudy).toEqual(`Field of Study: ${education[0].fieldOfStudy}`);
    expect(description).toEqual(`Description: ${education[0].description}`);
  });

  it(`shallow renders ProfileCreds, and when experience is provided with specified 'to' prop (end date), then it is displayed `, () => {
    const wrapper = shallow(<ProfileCreds {...eduStateWithDefinedToDate} />);
    const momentTo = wrapper.find('t').at(1).children().text(); // jsx => "<Moment>{from date}</Moment> - <Moment>{to date}</Moment>"

    expect(momentTo).toEqual(`${mockEducation[0].to}`);
  });

  it("shallow renders ProfileCreds, and when education is provided without description, then no info is displayed for that field", () => {
    const wrapper = shallow(<ProfileCreds {...eduStateNoDescription} />);
    const description = wrapper.find('p').at(4).text();

    expect(description).toEqual(`Description: `);
  });
});