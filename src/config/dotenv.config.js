import dotenv from 'dotenv';

// console.log('Estamos en este pathagagsasg', process.cwd());

export const getVariables = (options) => {
  const environment = options.opts().mode;

  dotenv.config({
    path:
      environment === 'development'
        ? './src/environments/.env.development'
        : './src/environments/.env.production',
  });

  return {
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    tokenSecret: process.env.TOKENSECRET,
    userAdmin: process.env.USERADMIN,
    userPass: process.env.USERPASS,
    nodeEnv: process.env.NODE_ENV,
    mailingService: process.env.MAILING_SERVICE,
    mailingUser: process.env.MAILING_USER,
    mailingPassword: process.env.MAILING_PASSWORD,
  };
};
