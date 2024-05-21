// console.log('directorio desde app.js', process.cwd());

//!                                               ░░░░░░░░░░░░░░░░░░░░░░░░░░░
//!                                               ░░░░░░░░░░IMPORTS░░░░░░░░░░
//!                                               ░░░░░░░░░░░░░░░░░░░░░░░░░░░

// importamos express
import express from 'express';
// Importamos cors
import cors from 'cors';
// Importamos handlebars
import handlebars from 'express-handlebars';
// Importar helper de hbs
import { equalHelper } from './config/helpers.js';
// Importamos socket.io
import { Server } from 'socket.io';
// Importamos mongoose
import mongoose from 'mongoose';
// Importamos productsRouter
import productsRouter from './routes/products.routes.js';
// Importamos cartsRouter
import cartsRouter from './routes/carts.routes.js';
// Importamos viewsRouter
import viewsRouter from './routes/views.routes.js';
// importamos ProductManager (MongoDB)
import ProductManager from './DAO/MongoDb/ProductManager.js';
// Importamos el esquema de mensajes (chatApp)
import { messageModel } from './DAO/models/messages.models.js';
// Importamos la clase mongoStore del modulo connect-mongo
import MongoStore from 'connect-mongo';
// Importamos session
import session from 'express-session';
// importamos las rutas de sesion
import sessionRoutes from './routes/session.routes.js';
// importamos passport
import passport from 'passport';
// importamos funcion para inicializar passport
import initializePassport from './config/passport.config.js';
// importamos command
import { Command } from 'commander';
// importamos funcion de dotenv
import { getVariables } from './config/dotenv.config.js';
// Importamos manejador de errores personalizado
import { errorHandler } from './middlewares/error.js';
// Importamos funcion middleware de logger
import { addLogger } from './utils/logger.js';
// Importamos ruta para logs
import loggerRoutes from './routes/logger.routes.js';
// Importamos ruta para usuarios
import userRoutes from './routes/users.routes.js';
//Swagger:
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { swaggerConfiguration } from './config/swagger.config.js';
// Funcion de node-cron para automatizar la limpieza de users inactivos
import { delete_inactive_user } from './utils/cron.js';
// Importamos ruta para buscar la variable de entorno que determina la url principal de los endpoints
import resourcesRouter from './routes/resourcesUrl.routes.js';

//*                                               ░░░░░░░░░░░░░░░░░░░░░░░░░░░
//*                                               ░░░░░░░░APLICACION░░░░░░░░░
//*                                               ░░░░░░░░░░░░░░░░░░░░░░░░░░░

// Instanciamos ProductManager
const productManager = new ProductManager('../../productos.json');

//! Commander

//inicializamos un nuevo comando de Commander
const program = new Command();

//! PRIMERO VA EL FLAG ABREVIADO (SI ES QUE SE QUIERE PONER) Y LUEGO EL FLAG ENTERO, AL REVES NO FUNCIONA!
program.option('-m --mode <mode>', 'Modo de trabajo', 'development');

export const options = program.parse();

const { port, mongoURL, tokenSecret, nodeEnv } = getVariables(options);

//! Limpieza de users inactivos
delete_inactive_user();

// Escuchando en puerto 8080
const PORT = port;

// Iniciamos la app
const app = express();

// middleware cors (acepta cualquier solicitud)
app.use(cors());

// Middleware de logger

app.use((req, res, next) => addLogger(req, res, next, nodeEnv));

// recibimos json
app.use(express.json());

// configuracion url
app.use(express.urlencoded({ extended: true }));

// config carpeta publica
app.use(express.static('public'));

//SESSION con MongoDb (Configuramos la session)
//Acá la coneccion con la bd es exclusivamente para las sessions, mas abajo podemos ver como nos conectamos de nuevo en el marco de mongoose

app.use(
  session({
    secret: tokenSecret,
    store: MongoStore.create({
      mongoUrl: mongoURL, // /coder => es la bd donde se va a guardar la coleccion sessions
      ttl: 900, //(900=15min)
    }),
    resave: true,
    saveUninitialized: true,
  })
);

//!   //////////////
//!  ///PASSPORT///
//! //////////////

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// CONEXION BASE DE DATOS
//! Lo hago asincrono para que no caiga el server si cae mongo
const conexionMongo = async () => {
  try {
    await mongoose.connect(mongoURL);
  } catch (error) {
    console.log(`Cayó Mongo: ${error}`);
  }
};
conexionMongo();

mongoose.connection.on('disconnected', () => {
  console.log('Se perdió la conexión a MongoDB');

  setTimeout(() => {
    conexionMongo();
  }, 3000);
});

//!Swagger

const specs = swaggerJsDoc(swaggerConfiguration);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//! MONTAJE ENRUTADOR PRODUCTS

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/api/sessions', sessionRoutes);
app.use('/api/logs', loggerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources-url', resourcesRouter);

//!MIDDLEWARE ERROR-HANDLER

// app.use(errorHandler);

//! HANDLEBARS CONFIG//////

const hbs = handlebars.create({
  //Crea un nuevo handlebars engine con la opcion "runtimeOptions" que permite envio de propiedades como prototipos
  runtimeOptions: {
    allowProtoPropertiesByDefault: true, // Permite pasar props que se consideran prototipos (mongoose tiene estas propiedades que son consideradas como tales. De esta manera nos aseguramos de que handlebars las interprete como tal y las deje pasar)
  },
  helpers: {
    equal: equalHelper,
  },
});

//(motor instanciado)
app.engine('handlebars', hbs.engine);

//indicamos donde esta la ruta de las vistas
app.set('views', 'src/views');

//indicamos que vamos a utilizar el motor handlebars para las vistas
app.set('view engine', 'handlebars');

///////FIN HANDLEBARS///////

// Server corriendo desde 8080
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));

//! SOCKET.IO CONFIG
const httpServer = app.listen(PORT, () =>
  console.log(`Server running on ${PORT}`)
);

// instanciamos un nuevo servidor web socket de la clase Server que importamos de socket.io
const io = new Server(httpServer);

const messages = [];

io.on('connection', (socket) => {
  console.log(`A new client has connected`);

  // AGREGAR PRODUCTO
  socket.on('addProduct', async (data) => {
    await productManager.addProduct(data);
    const products = await productManager.getProducts();

    io.emit('updatedProducts', products.payload); //ojo con esto, trabajando con paginate, recibimos distinto el obj y hay que ir a docs
  });

  // ELIMINAR PRODUCTO
  socket.on('deleteValue', async (data) => {
    if (!data) {
      return console.error('Socket error: Debe ingresar un Id');
    }
    await productManager.deleteProduct(data);
    const products = await productManager.getProducts();
    io.emit('updatedProducts', products.payload);
  });

  //! CHAT APP

  socket.on('message', async (data) => {
    await messageModel.create({ user: data.user, message: data.data });
    messages.push(data);

    io.emit('messageLogs', messages);
  });

  socket.on('newUser', (user) => {
    io.emit('userLog', user);
    socket.broadcast.emit('notification', user);
  });
});
