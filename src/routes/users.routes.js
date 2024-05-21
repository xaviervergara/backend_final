import { Router } from 'express';
import {
  addUser_service,
  deleteUser_service,
  getUserById_service,
  getUsers_service,
  switchRole_service,
  updateUser_service,
  addUserRegister_service,
  lastConnectionDelete_service,
  switchOwnRole_service,
} from '../services/users.service.js';

// import { applyPolicies } from '../middlewares/auth.js';
const userRoutes = Router();

//*GET
userRoutes.get('/', getUsers_service);

//*GET BY ID
userRoutes.get('/:uId', getUserById_service);

//*POST
userRoutes.post('/', addUser_service);

//*POST FROM ADMIN
userRoutes.post('/add-user-register', addUserRegister_service);

//*DELETE LAST_CONNECTION > 2.DAYS
//!Esto se implemento con libreria node-cron. Se maneja automaticamente sin necesidad de pegarle a esta ruta
userRoutes.delete('/last-connection', lastConnectionDelete_service);

//*PUT
userRoutes.put('/:uId', updateUser_service);

//*DELETE
userRoutes.delete('/delete/:uId', deleteUser_service);

//*SWITCH ROLE (FUNCION CONVENCIONAL DESDE LA VISTA DE USUARIOS SOLO PUEDE ACCEDER ADMIN Y CAMBIAR EL ROL DE TERCEROS)
userRoutes.put('/premium/:uId', switchRole_service);

//*SWITCH OWN ROLE (IMPLEMENTADO PARA PROBAR MAS RAPIDO ALGUNAS COSAS, DEJA CAMBIAR EL ROL DEL PREMIUM Y DEL ADMIN DESDE LA VISTA PRINCIPAL)
userRoutes.put('/premium/own-role/:uId', switchOwnRole_service);

export default userRoutes;
