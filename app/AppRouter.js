import Express from 'express';
import * as MainController from './controllers/MainController.js';

/**
 * Singleton router for all routes
 */
export const AppRouter = Express.Router();

AppRouter.get('/', MainController.getHomePage);
AppRouter.get('/api/test', MainController.getSampleJSON);
