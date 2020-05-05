import Compress from 'compression';
import CookieParser from 'cookie-parser';
import Express from 'express';
import Handlebars from 'hbs';
import createHttpError from 'http-errors';
import Logger from 'morgan';
import { join } from 'path';
import Staticify from 'staticify';

// File path of the view templates.
const viewPath = join(process.cwd(), 'app/views');
// File path of publicly hosted static files.
const publicPath = join(process.cwd(), 'public');
// Url that static assets are hosted from.
const publicAssetBaseUrl = '/static';
// Middleware that serves static assets along with versioning hashes.
const staticify = Staticify(publicPath, { pathPrefix: publicAssetBaseUrl });

/**
 * Callback to add routes / middleware to the base app.
 * @callback extendCallback
 * @param {Express.Express} app
 */

/**
 * Main express app setup / configuration class.
 */
export class BaseApp {
  /**
   * @param {extendCallback} [extendApp] Callback to add routes / middleware to the base app.
   */
  constructor(extendApp) {
    const app = Express();

    app.use(Compress());
    app.use(Logger('dev'));
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: false }));
    app.use(CookieParser());

    if (extendApp) {
      extendApp(app);
    }

    app.use(publicAssetBaseUrl, staticify.middleware);

    // Catch 404 and forward to error handler
    app.use((req, res, next) => {
      next(createHttpError(404));
    });

    // Error handler
    app.use((err, req, res, next) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

    // view engine setup
    app.set('views', viewPath);
    app.set('view engine', 'hbs');
    Handlebars.registerHelper('getVersionedPath', staticify.getVersionedPath);

    return app;
  }
}
