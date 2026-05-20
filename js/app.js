/**
 * App Entry Point
 */

// Inicializar app
const init = () => {
    window.addEventListener('hashchange', handleRoute);
    handleRoute();

    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw-v5.js').then((reg) => {
            setInterval(() => reg.update(), 30000);
            reg.addEventListener('updatefound', () => {
                const newSW = reg.installing;
                newSW.addEventListener('statechange', () => {
                    if (newSW.state === 'installed') newSW.postMessage('SKIP_WAITING');
                });
            });
        });
        navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
    }
};

init();