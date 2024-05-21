import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils/bcyrpt.js';
import { userModel } from '../DAO/models/user.model.js';
import { Strategy as GithubStrategy } from 'passport-github2';
import CartManager from '../DAO/MongoDb/CartManager.js';

const cartManager = new CartManager();

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  //REGISTER

  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },

      async (req, username, password, done) => {
        let { first_name, last_name, email, age, role } = req.body;

        if (email === 'user_admin@coder.com.ar') {
          role = 'admin';
        }
        if (
          email === 'user_premium@coder.com.ar' ||
          email === 'xaviervergara00@gmail.com'
        ) {
          role = 'premium';
        }
        try {
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            role,
            password: createHash(password),
            cart: await cartManager.addCart(),
          };

          const result = await userModel.create(newUser);

          return done(null, result);
        } catch (error) {
          return done('Error to obtain the user ' + error);
        }
      }
    )
  );

  //LOGIN

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          // este if de abajo esta chequeando el email en realidad.. Si no se encontro el user en la Bd es porque el email no existe

          if (!user) {
            console.log('User does not exist');
            return done(null, false);
          }

          // y en este if finalmente validamos la password

          if (!isValidPassword(user, password)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //output del login (user), es el input del serializer

  //LOGIN GITHUB

  passport.use(
    'github',
    new GithubStrategy(
      {
        clientID: 'Iv1.3789cee2521a5f6c',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
        clientSecret: '2b882cc1aa2c7bee25eb43732d0a97941feaa759',
      }, //chequear docu oficial de passport-github2
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log({ profile });

          const user = await userModel.findOne({ email: profile._json.email }); //profile viene de github, dentro tiene el obj "_json" y dentro de este tiene el email
          if (!user) {
            const newUser = {
              first_name: profile._json.name.split(' ')[0], //divimos por espacio, nos quedamos con nombre [0] y apellido [1] si tiene mas de un nombre cagamos. otra solucion es sacar el required del campo last_name en el model, que de hecho hicimos eso porque si no tiene apellido tambien cagamos
              last_name: profile._json.name.split(' ')[1], //last name no viene en github, el nombre viene todo entero en 'profile._json.name'
              age: 18, //age no viene en github, aqui ponemos un random porque no es de relevancia
              email: profile._json.email, // en este caso cada usuario deberia configurar su email en github para que aparezca como publico. otra forma es que en vez de que se logueen con el email lo hagan con el username(email: profile.username)(siempre consologuear profile para ver como vienen los datos!)
              password: 'GithubGenerated', // no viene en github, ponemos "GithubGenerated" para tener de referencia de que se inicio sesion con github
            };
            const result = await userModel.create(newUser);
            return done(null, result);
          }
          return done(null, user); // aqui si el usuario ya existe se lo pasamos. Este es el user que obtuvimos del userModel.findOne({ email: profile._json.email })
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //SERIALIZE

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  //DESERIALIZE

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findOne({ _id: id });

      done(null, user);
    } catch (error) {
      return done(error);
    }
  });
};

export default initializePassport;
