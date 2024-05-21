import { userModel } from '../DAO/models/user.model.js';
import { isValidPassword } from '../utils/bcyrpt.js';

//CHEQUEAMOS SI EL USER ESTA LOGUEADO, DE LO CONTRARIO SE LO REDIRECCIONA A LA PAGINA LOGIN PARA QUE SE LOGUEE

export const checkAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

//CHEQUEAMOS SI EL USUARIO ESTA LOGUEADO, DE SER ASI LO LLEVAMOS A LA PAGINA DE INICIO

export const checkExistingUser = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/products');
  }

  next();
};

//ESTE MIDDLEWARE SE USA MUCHO EN EL ROUTER DE PRODUCTS, PORQUE VERIFICA LOS PERMISOS OTORGADOS SEGUN EL ROL PARA
//PODER REALIZAR LAS DISTINTAS OPERACIONES DE CRUD CON LOS PRODUCTOS, ES DECIR; PARA AGREGAR PRODUCTOS A LA BD O MODIFICARLOS,
//ES NECESARIO TENER UN ROL DE ADMINISTRADOR, PARA LEERLOS CON UN ROL DE ADMIN ESTA BIEN. ESTO SE PUEDE APLICAR EN VARIOS LUGARES.<

//!DEPRECADO
// export const authorization = (role) => {
//   return async (req, res, next) => {
//     if (req.session?.user?.role !== role) {
//       return res.status(403).send({ error: 'No permissions' });
//     }
//     next();
//   };
// };

//!ACTUAL (FUNCIONA COMO ARRAY)

export const applyPolicies = (roles) => {
  return (req, res, next) => {
    if (roles[0].toUpperCase() === 'PUBLIC') {
      return next();
    }
    if (!req.user) {
      return res
        .status(401)
        .send({ status: 'Error', message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role.toUpperCase())) {
      return res
        .status(403)
        .send({ status: 'Error', message: 'Not authorized' });
    }

    return next();
  };
};
