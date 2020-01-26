import { Document } from 'mongoose';
import ISocialLinks from './ISocialLinks';
import IExperience from './IExperience';
import IEducation from './IEducation';
import IUser from './IUser';

export default interface IProfile extends Document {
  user: IUser['_id'];
  handle: string;
  company: string;
  website: string;
  location: string;
  status: string;
  skills: string[];
  bio: string;
  githubUsername: string;
  experience: IExperience[];
  education: IEducation[];
  social: ISocialLinks[];
}