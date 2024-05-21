import winston from 'winston';

const CustomLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'red',
    error: 'magenta',
    warning: 'yellow',
    info: 'blue',
    http: 'cyan',
    debug: 'white',
  },
};

//!Logger de entorno DEVELOPMENT
const devLogger = winston.createLogger({
  levels: CustomLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ colors: CustomLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

//!Logger de entorno PRODUCTION
const prodLogger = winston.createLogger({
  levels: CustomLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize({ colors: CustomLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: './errors.log', level: 'error' }),
  ],
});

export const addLogger = (req, res, next, nodeEnv) => {
  switch (nodeEnv) {
    case 'development':
      req.logger = devLogger;
      break;
    case 'production':
      req.logger = prodLogger;
      break;
    default:
      throw new Error('enviroment does not exist');
  }

  next();
};
