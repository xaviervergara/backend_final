import express from 'express';
import {
  addProduct_service,
  deleteProduct_service,
  getMockingProducts,
  getProductById_service,
  getProducts_service,
  updateProduct_service,
} from '../services/products.service.js';
// import { authorization } from '../middlewares/auth.js';//!DEPRECADO
import { applyPolicies } from '../middlewares/auth.js'; //*ACTUAL

//instanciamos el enrutador
const productsRouter = express.Router();
//████████████████████████████████████████
//█               MOCKING                █
//████████████████████████████████████████

productsRouter.get(
  '/mockingproducts',
  applyPolicies(['PUBLIC']),
  getMockingProducts
);

//████████████████████████████████████████
//█              GET+LIMIT               █
//████████████████████████████████████████

productsRouter.get('/', applyPolicies(['PUBLIC']), getProducts_service);

//████████████████████████████████████████
//█              GET+PARAM               █
//████████████████████████████████████████

productsRouter.get('/:pid', applyPolicies(['PUBLIC']), getProductById_service);

//████████████████████████████████████████
//█                POST                  █
//████████████████████████████████████████

productsRouter.post(
  '/',
  applyPolicies(['ADMIN', 'PREMIUM']),
  addProduct_service
); //No funciona en postman

//████████████████████████████████████████
//█                PUT                   █
//████████████████████████████████████████

productsRouter.put(
  '/:pid',
  applyPolicies(['ADMIN', 'PREMIUM']),
  updateProduct_service
);

//████████████████████████████████████████
//█               DELETE                 █
//████████████████████████████████████████

productsRouter.delete(
  '/:pid',
  applyPolicies(['ADMIN', 'PREMIUM']),
  deleteProduct_service
);

export default productsRouter;
