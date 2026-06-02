/**
 * Utilidades - Helper functions, Router y formateo
 * 
 * Este archivo contiene funciones utility reutilizables incluyendo:
 * - Generadores de IDs únicos (UUID)
 * - Validadores de formularios
 * - Formateo de fechas y monedas
 * - Router SPA basado en hash (#/ruta)
 * 
 * Funciones llamadas:
 *   - store.getState() => js/state.js, 获取 estado global
 *   - render() => js/views.js, re-renderiza la vista
 *   - navigate() => función local para cambiar hash
 * 
 * Archivos involucrados:
 *   - js/state.js (estado global)
 *   - js/views.js (render principal)
 */

// Genera un UUID versión 4 aleatorio.
// Formato: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
// Retorna: string con el ID generado
const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Valida que el monto sea un número mayor a cero.
// Parámetro: value (string o número)
// Retorna: { valid: boolean, error: string }
const validateMonto = (value) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
        return { valid: false, error: 'El monto debe ser mayor a 0' };
    }
    return { valid: true };
};

// Formatea una fecha al formato "dd MMM yyyy HH:mm" (español).
// Parámetro: dateStr (string ISO)
// Retorna: string formateada, ej: "15 mar 2024 14:30"
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const dateStr2 = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    return `${dateStr2} ${timeStr}`;
};

// Escapea caracteres HTML especiales para prevenir XSS.
// Caracteres escapados: & < > " '
// Parámetro: str (string)
// Retorna: string segura para inserted en HTML
const escapeHtml = (str) => {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#039;');
};

// Formatea un número como moneda lempiras (HNL).
// Usa Intl.NumberFormat con locale en-US y moneda HNL.
// Parámetro: amount (number)
// Retorna: string formateada, ej: "L 1,234.56"
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'HNL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

/**
 * Router SPA basado en hash (#/ruta)
 *
 * Rutas disponibles:
 *   - #/ => home
 *   - #/agregar => add-transaction
 *   - #/historial => history
 *   - #/editar/:id => edit-transaction
 *
 * Mapping de rutas a nombres de vistas.
 */
const routes = {
    '/': 'home',
    '/agregar': 'add-transaction',
    '/historial': 'history'
};

// Extrae el ID de edición desde la URL (#/editar/:id).
// Retorna: string con el ID o null si no hay edición
const getEditId = () => {
    const hash = window.location.hash;
    const match = hash.match(/^#\/editar\/(.+)$/);
    return match ? match[1] : null;
};

// Obtiene la ruta actual desde el hash (sin #).
// Ejemplos: "/" => "/", "/agregar" => "/agregar"
// Retorna: string con la ruta
const getCurrentRoute = () => {
    const hash = window.location.hash.slice(1) || '/';
    return hash;
};

// Navega a una nueva ruta actualizando el hash.
// Parámetro: path (string), ej: "/agregar"
// Efecto: cambia window.location.hash
const navigate = (path) => {
    window.location.hash = path;
};

// Maneja el cambio de ruta:
// 1. Obtiene ruta actual y ID de edición
// 2. Determina nombre de vista
// 3. Actualiza state con currentView y editingId
// 4. Llama a render() para actualizar UI
// Llama a: store.setState(), render() desde views.js
const handleRoute = () => {
    const path = getCurrentRoute();
    const editId = getEditId();

    let viewName;
    if (editId) {
        viewName = 'edit-transaction';
    } else {
        viewName = routes[path] || 'home';
    }

    store.setState({
        ...store.getState(),
        currentView: viewName,
        editingId: editId
    });

    render();
};

// Renderiza el menú de navegación.
// Lee currentView del state para aplicar clase active.
// Llama a: store.getState()
const renderNav = () => {
    const nav = document.getElementById('nav');
    const currentView = store.getState().currentView;

    nav.innerHTML = `
        <a href="#/" class="nav__link ${currentView === 'home' ? 'nav__link--active' : ''}">Inicio</a>
        <a href="#/historial" class="nav__link ${currentView === 'history' ? 'nav__link--active' : ''}">Historial</a>
    `;
};