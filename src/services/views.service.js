//traemos la clase ProductManager
import ProductManager from '../DAO/MongoDb/ProductManager.js';
import CartManager from '../DAO/MongoDb/CartManager.js';
import UserManager from '../DAO/MongoDb/UserManager.js';
import TicketManager from '../DAO/MongoDb/TicketManager.js';
//instanciamos la clase
const productManager = new ProductManager();
//instanciamos clase de carts
const cartManager = new CartManager();
//instanciamos clase de users
const userManager = new UserManager();
//VISTA DE LOS PRODUCTOS NORMAL

export const mainView_service = async (req, res) => {
  const user = req.session.user;
  try {
    const products = await productManager.getProducts();

    res.render('home', {
      products,
      user,
      style: 'home.css',
      title: 'Http Products',
    });
  } catch (error) {
    console.error(`Error al renderizar productos: ${error}`);
  }
};

//Vista /products para la 2nda Pre-entrega

export const productsView_service = async (req, res) => {
  const { page } = req.query;
  // console.log(req.session.user);
  try {
    const products = await productManager.getProducts(10, page); //10 es el limit, page es la pagina
    const { user } = req.session; //si inicio sesion ya podemos obtener el usuario
    res.render('products', { products, user, style: 'products.css' });
  } catch (error) {
    console.error(error);
  }
};

//!Vista carts

export const ownerCartView_service = async (req, res) => {
  const { user } = req.session;
  try {
    const cart = await cartManager.getCartById(user.cart);
    if (!cart) {
      return res.status(404).send({ message: 'Could not get cart' });
    }
    res.render('ownerCart', { cart, user, style: 'ownerCart.css' });
  } catch (error) {
    console.error(error);
  }
};

//!Vista para agregar productos

export const addProduct_service = async (req, res) => {
  res.render('addProduct', { style: 'add-product.css' });
};

//!Vista para agregar usuarios

export const addUser_service = async (req, res) => {
  res.render('addUser', { style: 'add-user.css' });
};

//!Vista para ver usuarios

export const viewUsers_service = async (req, res) => {
  try {
    const { user } = req.session;

    const users = await userManager.getUsers();

    if (!users) {
      req.logger.error(`Could not get users`);
      return res.status(400).send({ message: 'Could not get users' });
    }

    res.render('users', { user, users, style: 'users.css', currentUser: user });
  } catch (error) {
    // Manejar errores si ocurren durante la obtención de usuarios
    res.status(400).send({ message: 'Could not get users' });
  }
};

//!VISTA PURCHASE

export const purchaseView_service = async (req, res) => {
  const { user } = req.session;
  const { ticket } = req.session;
  try {
    res.render('purchase', { user, ticket, style: 'purchase.css' });
  } catch (error) {
    req.logger.error(error);
  }
};
