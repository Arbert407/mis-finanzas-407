/**
 * App Entry Point
 * 
 * Esta función inicializa la aplicación SPA configurando el router basado en hash,
 * registering service workers para caché offline, y escuchando eventos de cambio de URL.
 * 
 * Funciones llamadas:
 *   - handleRoute() => definida en js/views.js, procesa el hash y renderiza la vista corresponding
 *   - navigator.serviceWorker.register() => API nativa del navegador paraService Worker caching
 *   - window.addEventListener('hashchange', ...) => Listener nativo para cambios en la URL hash
 * 
 * Archivos involucrados:
 *   - js/views.js (define handleRoute)
 *   - sw-v5.js (Service Worker para cache offline)
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