import mongoose from "mongoose";
import uuid from "uuid/v4";

const Schema = mongoose.Schema;

const productsSchema = new Schema({
  sid: {
    type: String,
    required: true,
    default: uuid
  },
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  localGovtArea: {
    type: String,
    required: true
  },
  denomination: {
    type: String,
    required: true
  },
  languagesSpoken: {
    type: String
  },
  institution: {
    type: String
  },
  institutionAddress: {
    type: String
  },
  level: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  registrationOfficer: {
    type: String,
    required: true
  }
});

export default mongoose.model("Products", productsSchema);
