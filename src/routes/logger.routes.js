import { Router } from 'express';

const loggerRoutes = Router();

loggerRoutes.get('/loggerTest', (req, res) => {
  req.logger.fatal('Esto es un log FATAL');
  req.logger.error('Esto es un log ERROR');
  req.logger.warning('Esto es un log WARNING');
  req.logger.info('Esto es un log INFO');
  req.logger.http('Esto es un log HTTP');
  req.logger.debug('Esto es un log DEBUG');
  res.send({ message: 'Error de prueba' });
});

export default loggerRoutes;
