import mongoose from 'mongoose';

const messageCollection = 'messages';

// Scheme

const messageSchema = mongoose.Schema({
  user: String,
  message: String,
});

export const messageModel = mongoose.model(messageCollection, messageSchema);
