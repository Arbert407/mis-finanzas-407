/**
 * Gestión de Estado - Store centralizado, Persistencia y Sincronización
 *
 * Este archivo maneja el estado global de la aplicación usando el patrón Pub/Sub.
 * Incluye servicios de persistencia (localStorage) y sincronización (Google Sheets).
 */
const createStore = (initialState) => {
    let state = initialState;
    const listeners = [];

    return {
        getState: () => state,
        setState: (newState) => {
            state = newState;
            listeners.forEach(fn => fn(state));
        },
        subscribe: (listener) => {
            listeners.push(listener);
            return () => {
                const idx = listeners.indexOf(listener);
                if (idx > -1) listeners.splice(idx, 1);
            };
        }
    };
};

// Crea el store centralizado con patrón Pub/Sub. Métodos: getState(), setState(newState), subscribe(listener)
const initialState = {
    transactions: [],
    categoriesGasto: [
        { id: 'g1', nombre: 'Alimentación', icono: '🍔', asignacion: 'needs' },
        { id: 'g2', nombre: 'Transporte', icono: '🚗', asignacion: 'needs' },
        { id: 'g3', nombre: 'Entretenimiento', icono: '🎮', asignacion: 'wants' },
        { id: 'g4', nombre: 'Servicios', icono: '💡', asignacion: 'needs' },
        { id: 'g5', nombre: 'Salud', icono: '🏥', asignacion: 'needs' },
        { id: 'g6', nombre: 'Ropa', icono: '👕', asignacion: 'needs' },
        { id: 'g7', nombre: 'Hogar', icono: '🏠', asignacion: 'needs' },
        { id: 'g8', nombre: 'Educación', icono: '📚', asignacion: 'needs' },
        { id: 'g9', nombre: 'Mascotas', icono: '🐕', asignacion: 'wants' },
        { id: 'g10', nombre: 'Seguros', icono: '🛡️', asignacion: 'needs' },
        { id: 'g11', nombre: 'Impuestos', icono: '📋', asignacion: 'needs' },
        { id: 'g12', nombre: 'Restaurant', icono: '🍽️', asignacion: 'wants' },
        { id: 'g13', nombre: 'Suscripciones', icono: '📱', asignacion: 'wants' },
        { id: 'g14', nombre: 'Viajes', icono: '✈️', asignacion: 'wants' },
        { id: 'g15', nombre: 'Banca', icono: '🏦', asignacion: 'needs' },
        { id: 'g16', nombre: 'Telecomunicaciones', icono: '📞', asignacion: 'needs' },
        { id: 'g17', nombre: 'Deportes', icono: '⚽', asignacion: 'wants' },
        { id: 'g18', nombre: 'Belleza', icono: '💅', asignacion: 'wants' },
        { id: 'g19', nombre: 'Juguetes', icono: '🎁', asignacion: 'wants' },
        { id: 'g20', nombre: 'Tecnología', icono: '💻', asignacion: 'wants' },
        { id: 'g21', nombre: 'Parking', icono: '🅿️', asignacion: 'needs' },
        { id: 'g22', nombre: 'Combustible', icono: '⛽', asignacion: 'needs' },
        { id: 'g23', nombre: 'Taxi', icono: '🚕', asignacion: 'needs' },
        { id: 'g24', nombre: 'Otros', icono: '📦', asignacion: 'wants' },
        { id: 'g25', nombre: 'Mantenimiento Automóvil', icono: '🔧', asignacion: 'needs' },
    ],
    categoriesIngreso: [
        { id: 'i1', nombre: 'Salario', icono: '💼' },
        { id: 'i2', nombre: 'Bonificación', icono: '🎁' },
        { id: 'i3', nombre: 'Inversión', icono: '📈' },
        { id: 'i4', nombre: 'Regalo', icono: '🎀' },
        { id: 'i5', nombre: 'Dividendos', icono: '💵' },
        { id: 'i6', nombre: 'Freelance', icono: '💻' },
        { id: 'i7', nombre: 'Venta', icono: '🏷️' },
        { id: 'i8', nombre: 'Devolución', icono: '🔙' },
        { id: 'i9', nombre: 'Premio', icono: '🏆' },
        { id: 'i10', nombre: 'Mesada', icono: '👪' },
        { id: 'i11', nombre: 'Pensión', icono: '👴' },
        { id: 'i12', nombre: 'Alquiler', icono: '🏠' },
        { id: 'i13', nombre: 'Comisiones', icono: '🤝' },
        { id: 'i14', nombre: 'Técnico', icono: '🔧' },
        { id: 'i15', nombre: 'Royalties', icono: '📚' },
        { id: 'i16', nombre: 'Préstamo', icono: '💳' },
        { id: 'i17', nombre: 'Herencia', icono: '🏛️' },
        { id: 'i18', nombre: 'Reembolso', icono: '💊' },
        { id: 'i19', nombre: 'Otros', icono: '💰' }
    ],
    selectedType: 'Gasto',
    historyFilter: 'all',
    currentView: 'home',
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear()
};

/**
 * DataService - Persistencia
 */
const DataService = (() => {
    const STORAGE_KEY = 'lifestats-data';

    const getStorage = () => {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            console.error('Error leyendo storage:', e);
            return null;
        }
    };

    const setStorage = (data) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error guardando storage:', e);
        }
    };

    return {
        load: (defaults) => {
            const stored = getStorage();
            if (stored) {
                const parsed = JSON.parse(stored);
                if (!parsed.categoriesGasto) parsed.categoriesGasto = defaults.categoriesGasto;
                if (!parsed.categoriesIngreso) parsed.categoriesIngreso = defaults.categoriesIngreso;
                if (parsed.categoriesGasto && parsed.categoriesGasto.length < defaults.categoriesGasto.length) {
                    const existingIds = new Set(parsed.categoriesGasto.map(c => c.id));
                    const newCats = defaults.categoriesGasto.filter(c => !existingIds.has(c.id));
                    parsed.categoriesGasto = [...parsed.categoriesGasto, ...newCats];
                }
                if (parsed.categoriesGasto) {
                    parsed.categoriesGasto = parsed.categoriesGasto.map(cat => {
                        const def = defaults.categoriesGasto.find(d => d.id === cat.id);
                        return def ? { ...def, ...cat } : cat;
                    });
                }
                if (parsed.categoriesIngreso && parsed.categoriesIngreso.length < defaults.categoriesIngreso.length) {
                    const existingIds = new Set(parsed.categoriesIngreso.map(c => c.id));
                    const newCats = defaults.categoriesIngreso.filter(c => !existingIds.has(c.id));
                    parsed.categoriesIngreso = [...parsed.categoriesIngreso, ...newCats];
                }
                if (parsed.categoriesIngreso) {
                    parsed.categoriesIngreso = parsed.categoriesIngreso.map(cat => {
                        const def = defaults.categoriesIngreso.find(d => d.id === cat.id);
                        return def ? { ...def, ...cat } : cat;
                    });
                }
                if (!parsed.selectedType) parsed.selectedType = 'Gasto';
                if (!parsed.historyFilter) parsed.historyFilter = 'all';
                if (!parsed.appScriptUrl) parsed.appScriptUrl = '';
                return parsed;
            }
            return null;
        },
        save: (data) => {
            const { selectedMonth, selectedYear, ...dataWithoutMonth } = data;
            setStorage(dataWithoutMonth);
        }
};
})();

/**
 * SyncService - Sincronización con Google Sheets via Apps Script
 *
 * Servicio IIFE para sincronizar transacciones con Google Sheets.
 * Usa URL de Apps Script configurada por el usuario en el modal de settings.
 *
 * Keys localStorage:
 *   - lifestats-appscript-url => URL del Apps Script
 *   - lifestats-sync-timestamp => último sync
 *
 * Métodos:
 *   - getUrl() / setUrl(url) => gestión de URL
 *   - getLastSync() => obtener timestamp
 *   - testConnection() => probar conectividad
 *   - syncToSheet(record) => sincronizar un registro
 *   - syncIncremental(records) => sincronizar solo nuevos
 *   - importFromSheet() => importar datos
 *
 * Llamado por: js/components.js (openSettings)
 */
const SyncService = (() => {
    const APPSCRIPT_KEY = 'lifestats-appscript-url';
    const SYNC_TIMESTAMP_KEY = 'lifestats-sync-timestamp';

    const getUrl = () => localStorage.getItem(APPSCRIPT_KEY) || '';
    const setUrl = (url) => localStorage.setItem(APPSCRIPT_KEY, url);
    const getLastSync = () => localStorage.getItem(SYNC_TIMESTAMP_KEY);

    const formatRecord = (t) => {
        const cat = t.categoria;
        const catStr = (typeof cat === 'object' && cat.nombre)
            ? `{id=${cat.id}, nombre=${cat.nombre}, icono=${cat.icono}}`
            : String(cat || 'Otro');
        return {
            id: t.id,
            tipo: t.tipo,
            monto: t.monto,
            categoria: catStr,
            fecha: t.fecha,
            descripcion: t.descripcion || '',
            creado_en: t.creado_en,
            actualizado_en: t.actualizado_en
        };
    };

    const testConnection = async () => {
        const url = getUrl();
        if (!url) return { success: false, message: 'URL no configurada' };
        try {
            const res = await fetch(url, { method: 'GET' });
            return { success: res.ok, status: res.status };
        } catch (e) {
            return { success: false, message: e.message };
        }
    };

    const syncToSheet = async (record) => {
        const url = getUrl();
        if (!url) return { success: false, message: 'URL no configurada' };
        try {
            const payload = formatRecord(record);
            await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            localStorage.setItem(SYNC_TIMESTAMP_KEY, new Date().toISOString());
            return { success: true };
        } catch (e) {
            return { success: false, message: e.message };
        }
    };

    const syncIncremental = async (records, onProgress) => {
        const lastSync = localStorage.getItem(SYNC_TIMESTAMP_KEY);
        const newRecords = records.filter(t => {
            if (!t.creado_en && !t.actualizado_en) return true;
            const created = t.creado_en ? new Date(t.creado_en) : new Date(0);
            const updated = t.actualizado_en ? new Date(t.actualizado_en) : new Date(0);
            const latest = new Date(Math.max(created, updated));
            return !lastSync || latest > new Date(lastSync);
        });
        if (newRecords.length === 0) {
            return { success: true, message: 'No hay registros nuevos', synced: 0, total: 0 };
        }
        if (onProgress) onProgress({ stage: 'start', current: 0, total: newRecords.length, lastId: '' });
        let synced = 0;
        let failed = 0;
        for (let i = 0; i < newRecords.length; i++) {
            const result = await syncToSheet(newRecords[i]);
            if (result.success) synced++;
            else failed++;
            if (onProgress && (i === 0 || (i + 1) % 10 === 0 || i === newRecords.length - 1)) {
                const pct = Math.round(((i + 1) / newRecords.length) * 100);
                onProgress({ stage: 'syncing', current: i + 1, total: newRecords.length, pct, lastId: String(newRecords[i].id).slice(0, 8) });
            }
        }
        return { success: true, message: failed > 0 ? `${synced} sincronizados, ${failed} fallidos` : `${synced} registros sincronizados`, synced, failed, total: newRecords.length };
    };

    const importFromSheet = async () => {
        const url = getUrl();
        if (!url) return { success: false, message: 'URL no configurada' };
        try {
            const response = await fetch(url);
            const data = await response.json();
            return { success: true, data };
        } catch (e) {
            return { success: false, message: e.message };
        }
    };

    return { getUrl, setUrl, getLastSync, testConnection, syncToSheet, syncIncremental, importFromSheet, formatRecord };
})();

// Inicializar store
const savedState = DataService.load(initialState);
const store = createStore(savedState || initialState);
store.subscribe(DataService.save);