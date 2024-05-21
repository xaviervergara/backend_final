import fs from 'fs';

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    // this.id = 0;
  }

  async addProduct(product) {
    try {
      product.id = Math.floor(Date.now() * Math.random() * 1);

      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.code ||
        !product.stock
      ) {
        return console.log('Por favor completar todos los campos');
      }

      let readFile = await fs.promises.readFile(this.path, 'utf-8');
      let fileParse = JSON.parse(readFile);

      fileParse.push(product);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(fileParse),
        'utf-8'
      );
    } catch (error) {
      console.log(`No se pudo escribir el archivo: ${error}`);
    }
  }

  async getProducts() {
    try {
      let readFile = await fs.promises.readFile(this.path, 'utf-8');

      let fileParse = JSON.parse(readFile);

      return fileParse;
    } catch (error) {
      console.log(`Error al traer archivo ${error}`);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      let productsArray = await fs.promises.readFile(this.path, 'utf-8');

      let productsArrayToObj = JSON.parse(productsArray);

      let productById = productsArrayToObj.find((product) => product.id === id);

      return productById;
    } catch (error) {
      console.log(`Error al traer producto por Id ${error}`);
    }
  }

  async updateProduct(id, update) {
    try {
      let productsArray = await fs.promises.readFile(this.path, 'utf-8');

      let productsArrayToObj = JSON.parse(productsArray);

      //VERIFICACION ID EXISTE?
      if (!productsArrayToObj.some((prod) => prod.id === +id)) {
        return console.error('Error: el id no existe');
      }

      productsArrayToObj = productsArrayToObj.map((producto) => {
        if (producto.id === +id) {
          return {
            ...producto,
            ...update,
            id: +id,
          };
        }
        return producto;
      });

      let arrayToJson = JSON.stringify(productsArrayToObj);

      await fs.promises.writeFile(this.path, arrayToJson, 'utf-8');
    } catch (error) {
      console.error(`Error al actualizar: ${error}`);
    }
  }

  async deleteProduct(id) {
    try {
      let readFile = await fs.promises.readFile(this.path, 'utf-8');
      let fileParse = JSON.parse(readFile);
      //VALIDACION
      if (!fileParse.some((prod) => prod.id === +id)) {
        return console.error('Error: el id no existe');
      }
      let productById = fileParse.find((product) => product.id === +id);

      let filterProducts = fileParse.filter(
        (product) => product.id !== productById.id
      );

      let toJson = JSON.stringify(filterProducts);
      // this.products.push(toJson);

      await fs.promises.writeFile(this.path, toJson, 'utf-8');
    } catch (error) {
      console.error(`Error: no se pudo eliminar el producto: ${error}`);
    }
  }

  async deleteAll() {
    this.products = [];
    let toJson = JSON.stringify(this.products);
    await fs.promises.writeFile(this.path, toJson, 'utf-8');
  }
}

// ____________________
console.log('Directorio actual:', process.cwd());
const test = async () => {
  let productManager = new ProductManager('./productos.json');

  let prod1 = {
    title: 'Notebook',
    description: 'Notebook gamer oferta color negro',
    price: 2000,
    thumbnail: 'url',
    code: 727,
    stock: 400,
  };
  let prod2 = {
    title: 'Mouse',
    description: 'Mouse gamer oferta color rojo',
    price: 500,
    thumbnail: 'url',
    code: 224,
    stock: 210,
  };

  let prod3 = {
    title: 'Teclado',
    description: 'Teclado oficina oferta color blanco',
    price: 300,
    thumbnail: 'url',
    code: 445,
    stock: 996,
  };

  let prod4 = {
    title: 'mouse',
    description: 'mouse optico color blanco',
    price: 20,
    thumbnail: 'url',
    code: 127,
    stock: 254,
  };

  let prod5 = {
    title: 'Monitor',
    description: 'Monitor curvo oferta 32 pulgadas',
    price: 3000,
    thumbnail: 'url',
    code: 531,
    stock: 642,
  };

  try {
    await productManager.addProduct(prod1);
    // await productManager.addProduct(prod2);
    // await productManager.addProduct(prod3);
    // await productManager.addProduct(prod4);
    // await productManager.addProduct(prod5);

    //   await productManager.getProducts();
    //   await productManager.updateProduct(1, prod5);
    //   await productManager.getProducts();
    //   console.log(await productManager.getProductById(2));
    // await productManager.deleteProduct(0);
    // await productManager.deleteProduct(2);
  } catch (error) {
    console.log`Error al testear: ${error}`;
  }
};

// test();
export default ProductManager;
