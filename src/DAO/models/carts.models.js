import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartSchema = mongoose.Schema({
  products: {
    //Products es tipo array []
    type: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          required: true, //tambien es required
          ref: 'products', //=> hacemos referencia a la coleccion products (population)
        },
        quantity: Number,
      },
    ],
    default: [], //products es un array vacio entonces por defecto
  },
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
