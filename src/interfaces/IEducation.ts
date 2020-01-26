export default interface IEducation {
  _id?: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  from: Date;
  to?: Date;
  current?: Boolean;
  description?: string;
}