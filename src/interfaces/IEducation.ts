export default interface IEducation {
  id?: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  from: Date;
  to?: Date;
  current?: Boolean;
  description?: string;
}