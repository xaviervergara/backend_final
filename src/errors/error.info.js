//!Invalid type
export const generateProductErrorInfo = (product) => {
  return `One or more properties are incomplete or invalid
      title: needs to be a string, received ${typeof product.title}
      description: needs to be a string, received ${typeof product.description}
      code: needs to be a string, received ${typeof product.code}
      available: needs to be a string, received ${typeof product.available}
      stock: needs to be a number, received ${typeof product.stock}
      category: needs to be a string, received ${typeof product.category}
    `;
};

//!User not found
export const userNotFound = () => {
  return 'User not found';
};

export const productNotFound = () => {
  return 'Product not found';
};
