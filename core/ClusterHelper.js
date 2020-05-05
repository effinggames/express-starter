import Cluster from 'cluster';
import { cpus } from 'os';

/**
 * Helper function to start a server using node cluster for multi-core support.
 * @param {Function} startFunction The starting function to start the app.
 * @param {boolean} [isProductionMode=false] True / false if should run with multiple cores.
 */
export function startCluster(startFunction, isProductionMode) {
  if (Cluster.isMaster) {
    let cpuCount = cpus().length;

    if (isProductionMode) {
      console.log('Running in production mode!');
    } else {
      console.log('Running in development mode!');
      cpuCount = 1;
    }

    for (let i = 0; i < cpuCount; i++) {
      Cluster.fork();
    }

    Cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.id} died :(`);
      Cluster.fork();
    });
  } else {
    startFunction(Cluster.worker.id);
    console.log(`Worker ${Cluster.worker.id} running!`);
  }
}
