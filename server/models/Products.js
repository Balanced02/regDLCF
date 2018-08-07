import mongoose from 'mongoose';
import uuid from 'uuid/v4';

const Schema = mongoose.Schema;

const productsSchema = new Schema({
  sid: {
    type: String,
    required: true,
    default: uuid,
  },
  username: {
    type: String,
    required: true,
  }, 
  product: {
    type: String,
    required: true,
  }, 
  state:{
    type: String,
    required: true,
  }, 
  localGovtArea: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true
  },
  negotiable: {
    type: Boolean,
    required: true,
  },
  premium: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  picName: {
    type: String,
    required: true
  }
});

export default mongoose.model('Products', productsSchema);