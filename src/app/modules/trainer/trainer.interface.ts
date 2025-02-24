import { Types } from 'mongoose';

export interface ITrainer {
  firstName: string;
  lastName: string;
  gender?: 'male' | 'female' | 'others';
  contactNo?: string;
  profileImageUrl?: string;
  dob?: Date;
  userName: string;
  country?: string;
  zipCode?: number;
  about?: string;
  onlineSession?: 'yes' | 'no';
  faceToFace?: 'yes' | 'no';
  consultationType?: 'paid' | 'free';
  qualification?: string[];
  specialism?: string[];
  radius?: string;
  TikTok?: string;
  Instagram?: string;
  Facebook?: string;
  Youtube?: string;
  Twitter?: string;
  user?: Types.ObjectId;
}
