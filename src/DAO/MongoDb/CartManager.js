import { cartModel } from '../models/carts.models.js';
import mongoose from 'mongoose';

class CartManager {
  constructor() {}

  //████████████████████████████████████████
  //█               GET CARTS              █
  //████████████████████████████████████████

  async getCarts() {
    try {
      const carts = await cartModel.find(); //.populate('products');
      return carts;
    } catch (error) {
      console.log(`Error al traer carritos: ${error}`);
    }
  }

  //████████████████████████████████████████
  //█            GET CART BY ID            █
  //████████████████████████████████████████

  async getCartById(id) {
    try {
      const cartId = await cartModel
        .findOne({ _id: id })
        .populate('products.product'); //population
      return cartId;
    } catch (error) {
      console.log(`Error al traer carrito: ${error}`);
    }
  }

  //████████████████████████████████████████
  //█               ADD CART               █
  //████████████████████████████████████████

  async addCart() {
    try {
      //No nos manejamos con un array de carritos dentro de la clase, sino
      //directamente con el contenido del archivo json que escribimos
      const cart = await cartModel.create({ products: [] });
      return cart;
    } catch (error) {
      console.log(`Error al agregar carrito: ${error}`);
      // return false;
    }
  }

  //████████████████████████████████████████
  //█           addProductToCart           █
  //████████████████████████████████████████

  async addProductToCart(pid, cid) {
    try {
      const updatedCart = await cartModel.findOneAndUpdate(
        { _id: cid, 'products.product': pid },
        { $inc: { 'products.$.quantity': 1 } },
        { new: true } //devuelve el documento actualizado
      );

      if (!updatedCart) {
        // Si el producto no existe en el carrito, lo agregamos
        await cartModel.updateOne(
          { _id: cid },
          { $push: { products: { product: pid, quantity: 1 } } }
        );
      }

      return true;
    } catch (error) {
      console.error(`Error al actualizar carrito: ${error}`);
      throw error;
    }
  }

  //████████████████████████████████████████
  //█       DELETE PRODUCT FROM CART       █
  //████████████████████████████████████████//Elimina un producto del carrito

  async deleteProductInCart(cId, pId) {
    try {
      //updateOne: 1er Arg: filtro, 2do Arg: que es lo que se quiere actualizar.
      const result = await cartModel.updateOne(
        { _id: cId },
        {
          $pull: { products: { product: pId } }, // The  $pull operator removes from an existing array all instances of a value or values that match a specified condition.
          //new mongoose.Types.ObjectId(pId)-->hay que escribir todo eso para que mongoose entienda el id...
        }
      );
      console.log(`ACA ESTA RESULT: ${result.modifiedCount}`);
      if (result.modifiedCount > 0) {
        //verificamos que se haya modificado el doc
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  //████████████████████████████████████████
  //█             UPDATE PRODS             █
  //████████████████████████████████████████

  async updateCart(cId, newProds) {
    try {
      const result = await cartModel.updateOne({ _id: cId }, newProds);
      return result;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  //████████████████████████████████████████
  //█        UPDATE PRODS quantity         █
  //████████████████████████████████████████

  async updateProductInCart(cId, pId, quantity) {
    console.log(`cantidad desde constructor : ${quantity}`);
    if (!quantity) {
      console.error('Must provide "quantity"');
      return false;
    }
    try {
      const cart = await cartModel.findOne({ _id: cId });
      if (!cart) {
        console.error('Cart not found');
        return false;
      }
      const product = cart.products.find(
        (product) => product.product.toString() === pId
      ); //product.product porque dentro del objeto product la propiedad que contiene su Id se llama product tambien //y es toString porque el id en el modelo esta como ObjectId

      if (!product) {
        console.error('Could not find product');
        return false;
      }
      product.quantity = quantity;

      await cart.save(); //una vez que modificamos la cantidad del producto lo guardamos en la bD
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  //████████████████████████████████████████
  //█        DELETE ALL PRODS IN CART      █
  //████████████████████████████████████████//Elimina todos los productos del carrito

  async deleteAllProductsInCart(cId) {
    try {
      const deleted = await cartModel.updateOne({ _id: cId }, { products: [] });

      if (deleted.modifiedCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export default CartManager;
//                                                   |      PRODUCTO 1 ES OBJETO                    |,|       PRODUCTO 2 ES OBJETO                     |
//carts: [{id: "65c2c667b34f08a5f22a6c74", products:[{product:"65c05d90092c7f55ea837fd7", quantity:4},{product:"65c05d90092c7f55ea837fd7", quantity:6}]}]
//        |         ID DEL CARRITO      |, |                                              ARRAY DE PRODUCTOS                                          |
