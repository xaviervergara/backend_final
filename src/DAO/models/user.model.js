import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.ObjectId,
    ref: 'carts',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user',
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
    default: [],
  },
  last_connection: {
    type: Date,
  },
});

export const userModel = mongoose.model(userCollection, userSchema);
