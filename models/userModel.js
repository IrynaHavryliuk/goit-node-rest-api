import mongoose from 'mongoose';
import gravatar from 'gravatar';


const { Schema, model } = mongoose;
const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: { type: String, default: function() {
    return gravatar.url(this.email, { s: '250', d: 'identicon' });
  }},
});

const User = model('User', userSchema);
export default User;