import { App } from './app/App.js';
import { startCluster } from './core/ClusterHelper.js';
import { IS_PRODUCTION, PORT } from './EnvConstants.js';

/**
 * Starts the app with multiple processes using node cluster.
 * If NODE_ENV === 'production' then runs with multiple cores.
 */
startCluster(() => {
  const app = new App();

  app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);

    if (!IS_PRODUCTION) {
      console.log(`Viewable at http://localhost:${PORT}`);
    }
  });
}, IS_PRODUCTION);
