import mongoose from 'mongoose';

const ticketCollection = 'tickets';

const ticketSchema = mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datetime: String,
  amount: Number,
  purchaser: String,
  outOfStock: Array,
  purchase: Array,
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);
