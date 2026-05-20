/**
 * Utilidades
 */
const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const validateMonto = (value) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
        return { valid: false, error: 'El monto debe ser mayor a 0' };
    }
    return { valid: true };
};

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

const escapeHtml = (str) => {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#039;');
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'HNL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

/**
 * Router
 */
const routes = {
    '/': 'home',
    '/agregar': 'add-transaction',
    '/historial': 'history'
};

const getEditId = () => {
    const hash = window.location.hash;
    const match = hash.match(/^#\/editar\/(.+)$/);
    return match ? match[1] : null;
};

const getCurrentRoute = () => {
    const hash = window.location.hash.slice(1) || '/';
    return hash;
};

const navigate = (path) => {
    window.location.hash = path;
};

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

const renderNav = () => {
    const nav = document.getElementById('nav');
    const currentView = store.getState().currentView;

    nav.innerHTML = `
        <a href="#/" class="nav__link ${currentView === 'home' ? 'nav__link--active' : ''}">Inicio</a>
        <a href="#/historial" class="nav__link ${currentView === 'history' ? 'nav__link--active' : ''}">Historial</a>
    `;
};