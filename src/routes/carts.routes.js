import express from 'express';

import {
  getCarts_service,
  getCartById_service,
  addCart_service,
  addProductToCart_service,
  deleteProductInCart_service,
  updateCart_service,
  updateProductInCart_service,
  deleteAllProductsInCart_service,
  cartPurchase_service,
} from '../services/carts.service.js';
import { applyPolicies } from '../middlewares/auth.js';

//!instanciamos el enrutador
const cartsRouter = express.Router();

//!GET
cartsRouter.get('/', applyPolicies(['ADMIN']), getCarts_service);

//!GET ID
cartsRouter.get('/:cid', applyPolicies(['PUBLIC']), getCartById_service);

//!POST
cartsRouter.post('/', applyPolicies(['PUBLIC']), addCart_service);

//! POST /:cid/product/:pid

cartsRouter.post(
  '/:cid/product/:pid',
  applyPolicies(['PUBLIC']),
  addProductToCart_service
);

//!DELETE PRODUCT FROM CART

cartsRouter.delete(
  '/:cId/product/:pId',
  applyPolicies(['PUBLIC']),
  deleteProductInCart_service
);

//!PUT (NEW PRODS)

cartsRouter.put('/:cId', applyPolicies(['PUBLIC']), updateCart_service);

//! PUT (PRODS QUANTITY)

cartsRouter.put(
  '/:cId/products/:pId',
  applyPolicies(['PUBLIC']),
  updateProductInCart_service
);

//! DELETE ALL PRODS IN CART

cartsRouter.delete(
  '/:cId',
  applyPolicies(['PUBLIC']),
  deleteAllProductsInCart_service
);

//! GENERATE TICKET FROM CART

cartsRouter.get(
  '/:cId/purchase',
  applyPolicies(['PUBLIC']),
  cartPurchase_service
);

export default cartsRouter;
