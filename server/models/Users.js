import mongoose from 'mongoose';
import LocalMongoose from 'passport-local-mongoose';
import { request } from 'http';
import uuid from 'uuid/v4';

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  sid: {
    type: String,
    required: true,
    default: uuid,
  },
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
  },
  userType: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  passport: {
    type: String,
    // required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true
  }
});

usersSchema.plugin(LocalMongoose);

export default mongoose.model('Users', usersSchema);