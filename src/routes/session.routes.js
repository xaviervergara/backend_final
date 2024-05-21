import { Router } from 'express';

import passport from 'passport';
import {
  emailToRestorePass_Service,
  login_service,
  logout_service,
  register_service,
  restorePassword_service,
} from '../services/session.service.js';

const sessionRoutes = Router();

//?    /////////////
//?   /Register////
//?  /////////////

sessionRoutes.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/failregister' }),
  register_service
);

//?    ///////////////
//?   ////Login//////
//?  ///////////////

sessionRoutes.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/failogin' }),
  login_service
);

// ?   ///////////////
// ?  ////Logout/////
// ? ///////////////

sessionRoutes.post('/logout', logout_service);

//?    ////////////////////////////
//?   ////EMAIL TORestore-Pass////
//?  ////////////////////////////

sessionRoutes.post('/restore-password-email', emailToRestorePass_Service);

//?    ////////////////////
//?   ////Restore-Pass////
//?  ////////////////////

sessionRoutes.post('/restore-password', restorePassword_service);

//?    /////////////////////
//?   ////Git-hub login////
//?  /////////////////////

sessionRoutes.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }), // el scope nos dice que el nombre de usuario va a ser el email
  (req, res) => {}
); //cuando se pase este middleware, se pasa directamente al get que tenemos abajo

sessionRoutes.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
    // console.dir(req.session, { depth: null });
  }
);

export default sessionRoutes;
