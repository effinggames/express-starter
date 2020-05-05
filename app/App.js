import { AppRouter } from './AppRouter.js';
import { BaseApp } from '../core/BaseApp.js';

/**
 * Express app setup / configuration class.
 * Most of the non-app-specific settings live in BaseApp.
 */
export class App {
  constructor() {
    return new BaseApp((app) => {
      app.use(AppRouter);
    });
  }
}
