import { options } from '../app.js';
import MailingService from '../utils/mailing.js';
import { userModel } from '../DAO/models/user.model.js';
import { createHash, isValidPassword } from '../utils/bcyrpt.js';
import { DateTime } from 'luxon';
import { userTimeZone } from '../config/luxon.config.js';

//!Register

export const register_service = async (req, res) => {
  req.session.user = {
    id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    role: req.user.role,
    age: req.user.age,
    cart: req.user.cart._id,
  };

  return res.redirect('/');
};

//!Login

export const login_service = async (req, res) => {
  if (!req.user) {
    return res.status(400).send({ message: 'Error with credentials' });
  }

  const dt = DateTime.now();
  req.user.last_connection = dt;
  await req.user.save();

  //* le pasamos el usuario a la session

  req.session.user = {
    id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    role: req.user.role,
    age: req.user.age,
    cart: req.user.cart,
  };
  console.log(
    `User "${req.user.email}" starts session at: ${req.user.last_connection}`
  );
  res.redirect('/');
};

// !Logout

export const logout_service = async (req, res) => {
  try {
    const dt = DateTime.now();
    req.user.last_connection = dt;
    await req.user.save();

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
    });
    console.log(
      `User "${req.user.email}" last connection at: ${req.user.last_connection}`
    );
    res.send({ redirect: 'http://localhost:8080/login' }); // la redireccion la mandamos para que la maneje el frontend
  } catch (error) {
    res.status(400).send({ error });
  }
};

//*   //////////////////////////////////////
//*  //////EMAIL TO RESTORE PASSWORD///////
//* //////////////////////////////////////

export const emailToRestorePass_Service = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    req.logger.error('Ingresar una dirección de correo');
  }
  const mailingService = new MailingService(options);
  await mailingService.sendSimpleMail({
    from: 'Coderhouse',
    to: email,
    subject: 'Cambia tu password',
    html: `
    <button><a href='http://localhost:8080/restore-password'>¡Cambiá tu password haciendo click aquí!</button>
  `,
  });
  res.redirect('/login');
};

//    ////////////////////
//   ////Restore-Pass////
//  ////////////////////

export const restorePassword_service = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    user.password = createHash(password);
    await user.save();
    res.send({ message: 'Password updated' });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error });
  }
};
