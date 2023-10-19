import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  picture: { type: String, default: '' },
  line_id: { type: String, required: true, unique: true },
  condition: { type: Number, default: 0 },
  notify_token: { type: String, default: '' },
  notify_count: { type: Number, default: 0 },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;

export interface IUser extends mongoose.Document, UserProps {}

export interface UserProps {
  name: string;
  email: string;
  picture: string;
  line_id: string;
  condition: number;
  notify_token: string;
  notify_count: number;
}
