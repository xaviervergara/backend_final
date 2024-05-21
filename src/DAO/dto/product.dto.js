class ProductDTO {
  constructor(product) {
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.code = product.code;
    this.stock = product.stock;
    this.status = product.status;
    this.available = product.available;
    this.category = product.category;
  }
}

export default ProductDTO;
