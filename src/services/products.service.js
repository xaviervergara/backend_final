import ProductManager from '../DAO/MongoDb/ProductManager.js'; //(MongoDB)
import ProductDTO from '../DAO/dto/product.dto.js';
import CustomErrors from '../errors/CustomError.js';
import ErrorEnum from '../errors/error.enum.js';
import { generateProductErrorInfo } from '../errors/error.info.js';
import { generateProduct } from '../utils/fakerJs.js';
import { options } from '../app.js';
import MailingService from '../utils/mailing.js';
import UserManager from '../DAO/MongoDb/UserManager.js';
import { getDeleteProductEmail } from '../mails/mails.js';

//Instanciamos la clase de productos
const productManager = new ProductManager();
//Instanciamos la clase de usuarios
const userManager = new UserManager();

/////////////

// GET + LIMIT

export const getProducts_service = async (req, res) => {
  const { limit = 10, page = 1, query = '', sort = '' } = req.query;

  try {
    const products = await productManager.getProducts(limit, page, query, sort);

    if (products) {
      res.send(products);
    } else {
      res.status(404).send({ message: 'Products not found' });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

// GET+PARAM

export const getProductById_service = async (req, res) => {
  const { pid } = req.params;
  try {
    const producById = await productManager.getProductById(pid);
    res.send({ producById });
  } catch (error) {
    res.status(400).send({ message: `Error en el servidor: ${error.message}` });
  }
};

//!GET MOCKING PRODUCTS

export const getMockingProducts = async (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProduct());
  }

  if (!products) {
    res.status(404).send({ message: 'Could not get products' });
  }
  res.send({ products });
};

// POST

export const addProduct_service = async (req, res) => {
  const { title, description, code, price, category } = req.body;
  const user = req.session.user;

  try {
    if (!title || !description || !code || !price || !category) {
      CustomErrors.createError({
        name: 'Product creation failed',
        cause: generateProductErrorInfo(req.body),
        message: 'Error trying to create product',
        code: ErrorEnum.INVALID_TYPE_ERROR,
      });
    }

    const product = new ProductDTO(req.body);
    //si es usuario premium le agregamos al producto la prop "owner"y ahi guardamos el id del user que lo creo
    if (user.role === 'premium') {
      product.owner = user.id;
    }
    await productManager.addProduct({ ...product, status: true });
    res.json({
      message: `Producto agregado satisfactoriamente!`,
      redirectTo: '/',
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      Error: error.name,
      Causa: error.cause,
      Mensaje: error.message,
      Codigo: error.code,
    });
  }
};

// PUT

export const updateProduct_service = async (req, res) => {
  const { pid } = req.params;
  const user = req.session.user;

  const updatedProduct = req.body;
  try {
    const productToUpdate = await productManager.getProductById(pid);

    //!Si role es PREMIUM solo puede eliminar productos que le pertenezcan
    if (user.role === 'premium') {
      if (productToUpdate.owner === user.id) {
        const upd = await productManager.updateProduct(pid, updatedProduct);
        if (!upd.modifiedCount) {
          return res.status(400).json({
            message: 'Could not update user | Read carefully each obj key',
          });
        }
      } else {
        return res
          .status(401)
          .send({ message: 'No tiene permisos para modificar este producto' });
      }
    }
    //!Si role es ADMIN  puede eliminar cualquier producto
    if (user.role === 'admin') {
      const upd = await productManager.updateProduct(pid, updatedProduct);
      if (!upd.modifiedCount) {
        return res.status(400).json({
          message: 'Could not update user | Read carefully each obj key',
        });
      }
    }

    res.send({ message: 'Producto actualizado satisfactoriamente' });
  } catch (error) {
    res.status(404).json({ message: `Error en el servidor: ${error.message}` });
  }
};

// DELETE
// TODO ==> Separar los cuerpos de los mails en otro archivo y traerlos en una variable

export const deleteProduct_service = async (req, res) => {
  const { pid } = req.params;
  const currentUser = req.session.user;

  try {
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).send({ message: 'No existe el producto' });
    }
    //!USAMOS NULL PARA QUE NO SALTE ERROR EN EL METODO DE USER MANAGER DE CAST ID
    let owner = null;
    if (product.owner !== 'admin') {
      owner = await userManager.getUserById(product.owner);
    }

    if (currentUser.role === 'premium') {
      if (currentUser.id === product.owner) {
        await productManager.deleteProduct(pid);
        return res.send({ message: 'Producto eliminado' });
      } else {
        return res.status(401).send({
          message: 'No tiene permisos para eliminar este producto (premium)',
        });
      }
    }

    if (currentUser.role === 'admin') {
      await productManager.deleteProduct(pid);
      //!SOLO MANDA MAIL SI EL OWNER ES PREMIUM
      if (owner !== null) {
        const deleteMail = getDeleteProductEmail(product);

        const mailingService = new MailingService(options);
        await mailingService.sendSimpleMail({
          from: 'Coderhouse',
          to: owner.email,
          subject: 'Productos eliminados',
          html: deleteMail,
        });
      }

      return res.send({ message: 'Producto eliminado' });
    } else {
      return res
        .status(401)
        .send({ message: 'No tiene permisos para eliminar este producto' });
    }
  } catch (error) {
    console.error('Error en el servidor:', error); // Agrega logging para debug
    res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};
