import { productModel } from '../models/products.models.js';

class ProductManager {
  constructor() {}

  //████████████████████████████████████████
  //█              ADD PRODUCT             █
  //████████████████████████████████████████

  async addProduct(product) {
    // let { title, description, code, price, available, stock, category } =
    //   product;
    // //Si no valido acá cuando trabajo en realTime con socket me crashea el Server
    // if (
    //   !title ||
    //   !description ||
    //   !code ||
    //   !price ||
    //   !available ||
    //   !stock ||
    //   !category
    // ) {
    //   return console.error(`Constructor error: Completar todos los campos`);
    // }
    product.status = true;
    product.available = true;
    try {
      await productModel.create(product);
    } catch (error) {
      console.error(`Constructor error: ${error}`);
      throw error;
    }
  }

  //████████████████████████████████████████
  //█              GET PRODUCT             █
  //████████████████████████████████████████

  async getProducts(limit = 10, page = 1, query = '', sort = '') {
    //por si usamos este metodo en otro lado, dejamos los parametros igual que en routes.
    try {
      const [key, value] = query.split(':'); //en la url esto llega como por ej: title:'teclado', dividimos a partir de : y nos queda["key", "value"], Luego desestructuramos

      const products = await productModel.paginate(
        //Sin los corchetes, JavaScript interpretaría key como una cadena literal. Cuando en realidad deberia ser tomada como una variable dinamica
        {
          [key]: value,
        },
        {
          limit, //sintacticamente sucede: ||limit: 10||, o el numero que pasemos Revisar ES6
          page,
          sort: sort ? { price: sort } : {}, //sort acepta asc, desc, ascending, descending.
        }
      );

      //los products que vienen en products.docs se los pasamos a la nueva prop "payload" y eliminamos la prop docs que los contenia asi no repetimos todos los productos de nuevo
      products.payload = products.docs;
      delete products.docs;

      return { status: 'Ok', ...products }; //.docs;
    } catch (error) {
      console.error(`No se pudo ingresar a la BD: ${error}`);
      throw error;
    }
  }

  //████████████████████████████████████████
  //█              GET BY ID               █
  //████████████████████████████████████████

  async getProductById(id) {
    try {
      const product = await productModel.findOne({ _id: id }).lean();

      if (!product) {
        return console.error('Constructor error: No se encontro Id');
      }

      return product;
    } catch (error) {
      console.error(`Constructor error: ${error}`);
      throw error;
    }
  }

  //████████████████████████████████████████
  //█             UPDATE PRODUCT           █
  //████████████████████████████████████████

  async updateProduct(id, update) {
    try {
      const upd = await productModel.updateOne({ _id: id }, update);
      return upd;
    } catch (error) {
      console.error(`No se pudo actualizar producto: ${error}`);
      throw error;
    }
  }

  //████████████████████████████████████████
  //█             DELETE PRODUCT           █
  //████████████████████████████████████████

  async deleteProduct(id) {
    try {
      await productModel.deleteOne({ _id: id });
    } catch (error) {
      console.error(
        `Constructor error: no se pudo eliminar el producto: ${error}`
      );
      throw error;
    }
  }
}

export default ProductManager;
