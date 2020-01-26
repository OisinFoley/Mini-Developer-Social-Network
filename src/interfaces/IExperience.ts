export default interface IExperience {
  _id: string;
  title: string;
  company: string;
  location?: string;
  from: Date;
  to?: Date;
  current: Boolean;
  description?: string;
}