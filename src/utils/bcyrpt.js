import bcrypt from 'bcrypt';

//FUNCION PARA HASHEAR PASS

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

//COMPARAR LA PASS QUE INGRESAN EN EL FRONT CON LA QUE YA TENEMOS HASHEADA EN NUESTRA BD

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};
