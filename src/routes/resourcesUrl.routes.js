import { Router } from 'express';
import { options } from '../app.js';
import { getVariables } from '../config/dotenv.config.js';

const resourcesRouter = Router();

resourcesRouter.get('/', (req, res) => {
  const { resources_url } = getVariables(options);
  res.json(resources_url);
});

export default resourcesRouter;
