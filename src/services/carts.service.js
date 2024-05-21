import CartManager from '../DAO/MongoDb/CartManager.js'; //MongoDb
import ProductManager from '../DAO/MongoDb/ProductManager.js'; //MongoDb
import TicketManager from '../DAO/MongoDb/TicketManager.js';
import CustomErrors from '../errors/CustomError.js';
import ErrorEnum from '../errors/error.enum.js';
import { productNotFound } from '../errors/error.info.js';

//instanciamos ticket

const ticketManager = new TicketManager();
//Instanciamos la clase del carrito
const cartManager = new CartManager();
//Instanciamos la clase del productManager
const productManager = new ProductManager();

// GET

export const getCarts_service = async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.send({ carts });
  } catch (error) {
    console.log(`Error peticion get: ${error}`);
  }
};

// GET ID

export const getCartById_service = async (req, res) => {
  const { cid } = req.params;

  try {
    const producById = await cartManager.getCartById(cid);
    if (!producById) {
      res.status(400).send({ message: 'Carrito inexistente' });
    }
    res.send(producById);
  } catch (error) {
    console.log(`Error peticion get: ${error}`);
  }
};

//POST

export const addCart_service = async (req, res) => {
  const cartAdded = await cartManager.addCart();

  if (!cartAdded) {
    res.status(400).send({ message: 'carrito no agregado' });
  }
  res.send({ message: 'Carrito agregado satisfactoriamente!' });
};

// POST /:cid/product/:pid

export const addProductToCart_service = async (req, res) => {
  const { cid, pid } = req.params;
  const user = req.session.user;

  try {
    const prodId = await productManager.getProductById(pid);

    if (prodId.owner === user.id) {
      req.logger.info(
        `User premium no puede agregar sus propios productos al cart`
      );
      return res.status(403).send({
        message: 'User premium no puede agregar sus propios productos al cart',
      });
    }

    if (!prodId) {
      CustomErrors.createError({
        name: 'NON-EXISTENT ID',
        cause: productNotFound(),
        message: 'no product found',
        code: ErrorEnum.PRODUCT_NOT_FOUND,
      });
    }

    await cartManager.addProductToCart(pid, cid);
    res.status(200).send({ message: 'Carrito actualizado satisfactoriamente' });

    req.logger.info(
      `El item "${prodId.title}" se ha agregado correctamente al carrito`
    );
  } catch (error) {
    res.status(400).send({
      Error: error.name,
      Causa: error.cause,
      Mensaje: error.message,
      Codigo: error.code,
    });
  }
};

//DELETE PRODUCT FROM CART

export const deleteProductInCart_service = async (req, res) => {
  const { cId, pId } = req.params;
  try {
    const result = await cartManager.deleteProductInCart(cId, pId);

    if (result) {
      res.send({ message: 'Product deleted from cart' });
    } else {
      res.status(400).json({ message: 'Could not delete product' });
    }
  } catch (error) {
    console.error(`Error al eliminar producto del carrito: ${error}`);
  }
};

// PUT (new prods)

export const updateCart_service = async (req, res) => {
  const { cId } = req.params;
  const newProds = req.body;

  try {
    const result = await cartManager.updateCart(cId, newProds);
    if (result.modifiedCount > 0) {
      res.send({ message: 'Cart Updated' });
    } else {
      res.status(400).send({ message: 'Could not update cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: 'Could not update cart' });
  }
};

// PUT (prods quantity)

export const updateProductInCart_service = async (req, res) => {
  const { cId, pId } = req.params;
  const { quantity } = req.body; // esto tiene que estar desestructurado ya que necesitamos la variable "quantity" del objeto body

  try {
    const result = await cartManager.updateProductInCart(cId, pId, quantity);
    if (result) {
      res.send({ message: 'Product updated' });
    } else {
      res.status(400).send({ message: 'Could not update quantity' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: 'Could not update quantity' });
  }
};

// DELETE ALL PRODS IN CART

export const deleteAllProductsInCart_service = async (req, res) => {
  const { cId } = req.params;

  try {
    //!cheeueamos si el carrito ya esta vacio
    const checkEmptyCart = await cartManager.getCartById(cId);

    if (checkEmptyCart.products.length === 0) {
      return res.status(204).send();
    }

    const deleted = await cartManager.deleteAllProductsInCart(cId);
    if (deleted) {
      return res.send({ message: 'Products has been deleted' });
    } else {
      return res.status(400).send({ message: 'Could not delete products' });
    }
  } catch (error) {
    console.error(error);
  }
};

//* CART PURCHASE

export const cartPurchase_service = async (req, res) => {
  const { cId } = req.params;

  try {
    //! se obtiene carrito de usuario
    let userCart = await cartManager.getCartById(cId);
    if (userCart.products.length === 0) {
      return res.status(204).send();
    }

    //!guarda lo que no tiene stock suficiente
    let outOfStock = userCart.products.filter(
      (prod) => prod.product.stock < prod.quantity
    );
    //!saca del carrito los prodctos que no tienen stock
    userCart = userCart.products.map((prod) => {
      if (prod.product.stock >= prod.quantity) {
        prod.product.stock -= prod.quantity;
        return prod;
      } else return null;
    });

    userCart = userCart.filter((p) => p !== null);
    //!Detiene la compra en caso de que algun producto no tenga stock
    if (outOfStock.length > 0) {
      return res.send({
        message:
          'No se pudo hacer la compra, los siguientes productos no cuentan con stock suficiente ',
        outOfStock,
      });
    }
    //!Sumamos el valor total de los productos en el carrito
    let totalAmount = userCart.reduce((total, item) => {
      const productPrice = item.product.price * item.quantity;
      return total + productPrice;
    }, 0);
    //!Definimos el ticket
    const ticket = {
      purchaser: req.session.user.email,
      purchase: userCart,
      outOfStock,
      amount: totalAmount,
    };

    //!Guardamos el ticket en la bd
    await ticketManager.saveTicket(ticket);

    //! Guardamos el ticket en la sesión del usuario
    req.session.ticket = ticket;

    //TODO:==> MANDAR MAIL CON TICKET?
    //TODO:==> NO DEJAR IR A PURCHASE SI TIENE EL CARRITO VACIO!

    res.send({
      ticket,
      redirect: 'http://localhost:8080/purchase',
    });
    //!Luego, vaciamos el carrito
    await cartManager.deleteAllProductsInCart(cId);
    //!Tambien eliminamos el ticket de la sesion
    delete req.session.ticket;
  } catch (error) {
    console.error(error);
  }
};
