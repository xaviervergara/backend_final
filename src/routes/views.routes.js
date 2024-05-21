import { Router } from 'express';

//traemos los middlewares de autenticacion
import {
  applyPolicies,
  checkAuth,
  checkExistingUser,
} from '../middlewares/auth.js';
import {
  addProduct_service,
  addUser_service,
  mainView_service,
  ownerCartView_service,
  productsView_service,
  purchaseView_service,
  viewUsers_service,
} from '../services/views.service.js';

//instanciamos la ruta
const viewsRouter = Router();

//VISTA DE LOS PRODUCTOS NORMAL (mainView)
viewsRouter.get('/', checkAuth, mainView_service);

//! VISTA /PRODUCTS PARA LA 2NDA PRE-ENTREGA (PRODUCTSVIEW)

viewsRouter.get('/products', checkAuth, productsView_service);

//! VISTA CARTS

viewsRouter.get('/cart', checkAuth, ownerCartView_service);

//!VISTA ADD PRODUCT

viewsRouter.get(
  '/add-product',
  checkAuth,
  applyPolicies(['ADMIN', 'PREMIUM']),
  addProduct_service
);

//!VISTA ADD USER

viewsRouter.get(
  '/add-user',
  applyPolicies(['ADMIN']),
  checkAuth,
  addUser_service
);

//!VISTA  USER

viewsRouter.get(
  '/users',
  checkAuth,
  applyPolicies(['ADMIN']),
  viewUsers_service
);

//!VISTA PUCRHASE

viewsRouter.get(
  '/purchase',
  checkAuth,
  applyPolicies(['PUBLIC']),
  purchaseView_service
);

//  ██████████████████████████████████
//  █████████████SESSIONS█████████████
//  ██████████████████████████████████

//!login
viewsRouter.get('/login', checkExistingUser, (req, res) => {
  //si ya esta logueado el usuario, osea si existe ese user en la session, no puede volver al login, se lo redirecciona a la pagina de bienvenida

  res.render('login', { style: 'login.css' });
});

//!register
viewsRouter.get('/register', checkExistingUser, (req, res) => {
  res.render('register');
});

//!email to restore password
viewsRouter.get('/restore-email', checkExistingUser, (req, res) => {
  res.render('restore-password-email');
});

//!restore password
viewsRouter.get('/restore-password', checkExistingUser, (req, res) => {
  res.render('restore-password');
});

//!fail register
viewsRouter.get('/failregister', (req, res) => {
  res.render('failregister');
});

//!fail login
viewsRouter.get('/failogin', (req, res) => {
  res.render('failogin');
});

//!CHAT APP
viewsRouter.get('/chat', (req, res) => {
  res.render('chat', {
    title: 'Chat app',
    style: 'chat.css',
  });
});

//VISTA DE LOS PRODUCTOS TIEMPO REAL
viewsRouter.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', {
    style: 'realTimeProducts.css',
    title: 'Real Time',
  });
});

export default viewsRouter;
