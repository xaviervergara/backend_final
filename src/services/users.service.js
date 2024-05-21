import CartManager from '../DAO/MongoDb/CartManager.js';
import UserManager from '../DAO/MongoDb/UserManager.js';
import { createHash } from '../utils/bcyrpt.js';
import MailingService from '../utils/mailing.js';
import { options } from '../app.js';
//TODO==> ESTO DEBERIA SER USADO PARA QUE EL ADMIN PUEDA CREAR USUARIOS DE
//TODO==> PRUEBA Y LE PUEDA PONER LAS CARACTERISTICAS QUE CONSIEDERE NECESARIAS SEGUN EL CASO

const userManager = new UserManager();
const cartManager = new CartManager();

//!GET

export const getUsers_service = async (req, res) => {
  try {
    const users = await userManager.getUsers();
    if (!users) {
      return res.status(404).send({ message: `Could not get users` });
    }
    return res.send(users);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

//!GET BY ID

export const getUserById_service = async (req, res) => {
  const { uId } = req.params;
  try {
    const user = await userManager.getUserById(uId);
    if (!user) {
      return res.status(404).send({ message: `Could not get user` });
    }
    return res.send(user);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

//!CREATE

export const addUser_service = async (req, res) => {
  const user = req.body;
  try {
    const userCreated = await userManager.createUser(user);
    if (!userCreated) {
      return res.status(400).send(`Could not create user`);
    }
    return res.status(201).send(`User created`);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

//!CREATE FROM ADMIN

export const addUserRegister_service = async (req, res) => {
  const { user } = req.session;
  req.logger.warning(user.role);

  if (user.role === 'admin') {
    const { first_name, last_name, email, age, password, role } = req.body;
    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role,
      cart: await cartManager.addCart(),
    };

    try {
      const result = await userManager.createUser(newUser);
      return res.redirect('/');
    } catch (error) {
      console.log('Error al agregar usuario:', error);
      return res.status(500).send('Error al agregar usuario');
    }
  } else {
    return res.status(401).send({ message: 'Unauthorized' });
  }
};

//!PUT

export const updateUser_service = async (req, res) => {
  const { uId } = req.params;
  const newUser = req.body;
  try {
    const oldUser = await userManager.getUserById(uId);
    if (!oldUser) {
      return res
        .stauts(404)
        .send({ message: 'No user found on the specified id' });
    }
    const updatedUser = await userManager.modifyUser(id, newUser);
    if (!updatedUser.modifiedCount) {
      return res.status(400).send({ message: `Could not update user` });
    }
    return res.send({ mesage: `User updated` });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

//!DELETE

export const deleteUser_service = async (req, res) => {
  const { uId } = req.params;
  try {
    const deletedUser = await userManager.deleteUser(uId);
    if (deletedUser.deletedCount === 0) {
      return res.status(400).send({ message: `Could not delete user` });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({ message: 'Failed to destroy session' });
      }
      return res.send({ message: `User deleted and session destroyed` });
    });
    return res.send({ message: `User deleted` });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

//!CHANGE ROL original

export const switchRole_service = async (req, res) => {
  const { uId } = req.params;

  try {
    const userFromDb = await userManager.getUserById(uId);

    if (userFromDb.role === 'admin') {
      userFromDb.role = 'premium';
    } else if (userFromDb.role === 'premium') {
      userFromDb.role = 'admin';
    }

    await userManager.modifyUser(uId, userFromDb);
    res.send({ message: `Role switched ${userFromDb.role}` });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

//!CHANGE ROL CUSTOM (cambiar tu propio rol desde home)

export const switchOwnRole_service = async (req, res) => {
  const { uId } = req.params;
  const { user: userFromSession } = req.session;

  //! const { user } = req.session;
  try {
    const userFromDb = await userManager.getUserById(uId);
    // return res.send(user);

    if (userFromDb.role === 'admin') {
      userFromDb.role = 'premium';
      userFromSession.role = 'premium';
    } else if (userFromDb.role === 'premium') {
      userFromDb.role = 'admin';
      userFromSession.role = 'admin';
    }

    await userManager.modifyUser(uId, userFromDb);
    res.send({ message: `Role switched ${userFromDb.role}` });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

//*DELETE LAST_CONNECTION > 2.DAYS

export const lastConnectionDelete_service = async (req, res) => {
  try {
    const usersToDelete = await userManager.lastConnectionDelete();
    if (!usersToDelete) {
      return res.status(404).send({
        message: 'No hay usuarios cuya conexion sea menor a dos días',
      });
    }

    let emailList = usersToDelete.map((ele) => {
      return ele.email;
    });
    let emailString = emailList.join(',');

    const mailingService = new MailingService(options);
    await usersToDelete.forEach((ele) => userManager.deleteUser(ele._id));

    await mailingService.sendSimpleMail({
      from: 'Coderhouse',
      to: emailString,
      subject: 'Cuenta eliminada',
      html: `
      Tu cuenta ha sido eliminada por inactividad
      `,
    });

    res.send({ message: 'Users to delete', payload: usersToDelete });
  } catch (error) {
    req.logger.error(`Error lastConnectionDelete: ${error}`);
  }
};
