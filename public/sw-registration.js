if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const SWHelper = {
      async getWaitingWorker() {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.find(reg => reg.waiting)?.waiting;
      },

      async skipWaiting() {
        const waitingWorker = await SWHelper.getWaitingWorker();
        if (waitingWorker) {
          waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        }
      },

      async prepareCachesForUpdate() {
        const waitingWorker = await SWHelper.getWaitingWorker();
        if (waitingWorker) {
          waitingWorker.postMessage({ type: 'PREPARE_CACHES_FOR_UPDATE' });
        }
      }
    };

    const registerServiceWorker = async () => {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const newServiceWorkerWaiting = registration.waiting && registration.active;

      if (newServiceWorkerWaiting) {
        console.log('New service worker is waiting.');
        window.swUpdate = true;
        await SWHelper.skipWaiting();  // Skip the waiting service worker immediately
      }

      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;

        if (installingWorker) {
          console.log('Service worker is being installed.');
          installingWorker.addEventListener('statechange', async () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker installed.');
              window.swUpdate = true;

              // Prepare caches and activate the new service worker
              setTimeout(async () => {
                await SWHelper.prepareCachesForUpdate();
              }, 500);
            }
          });
        }
      });
    };

    // Register the service worker
    registerServiceWorker();

    // Update the service worker when the page is about to be unloaded or the app goes offline
    const updateServiceWorkerIfNeeded = async () => {
      if (window.swUpdate) {
        window.swUpdate = false; // Prevent multiple updates
        await SWHelper.skipWaiting(); // Skip the waiting worker
      }
    };

    window.addEventListener('beforeunload', updateServiceWorkerIfNeeded);
    window.addEventListener('pagehide', updateServiceWorkerIfNeeded);

    // Retry requests when the user comes back online
    const retryRequests = () => navigator.serviceWorker.controller?.postMessage({ type: 'retry-requests' });
    window.addEventListener('online', retryRequests);

    // Retry any stored requests immediately after loading the page
    retryRequests();
  });
}
