/**
 * Gestión de Estado
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

const initialState = {
    transactions: [],
    categoriesGasto: [
        { id: 'g1', nombre: 'Alimentación', icono: '🍔' },
        { id: 'g2', nombre: 'Transporte', icono: '🚗' },
        { id: 'g3', nombre: 'Entretenimiento', icono: '🎮' },
        { id: 'g4', nombre: 'Servicios', icono: '💡' },
        { id: 'g5', nombre: 'Salud', icono: '🏥' },
        { id: 'g6', nombre: 'Ropa', icono: '👕' },
        { id: 'g7', nombre: 'Hogar', icono: '🏠' },
        { id: 'g8', nombre: 'Educación', icono: '📚' },
        { id: 'g9', nombre: 'Mascotas', icono: '🐕' },
        { id: 'g10', nombre: 'Seguros', icono: '🛡️' },
        { id: 'g11', nombre: 'Impuestos', icono: '📋' },
        { id: 'g12', nombre: 'Restaurant', icono: '🍽️' },
        { id: 'g13', nombre: 'Suscripciones', icono: '📱' },
        { id: 'g14', nombre: 'Viajes', icono: '✈️' },
        { id: 'g15', nombre: 'Banca', icono: '🏦' },
        { id: 'g16', nombre: 'Telecom', icono: '📞' },
        { id: 'g17', nombre: 'Deportes', icono: '⚽' },
        { id: 'g18', nombre: 'Belleza', icono: '💅' },
        { id: 'g19', nombre: 'Juguetes', icono: '🎁' },
        { id: 'g20', nombre: 'Tecnología', icono: '💻' },
        { id: 'g21', nombre: 'Parking', icono: '🅿️' },
        { id: 'g22', nombre: 'Combustible', icono: '⛽' },
        { id: 'g23', nombre: 'Taxi', icono: '🚕' },
        { id: 'g24', nombre: 'Otros', icono: '📦' }
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
                if (parsed.categoriesIngreso && parsed.categoriesIngreso.length < defaults.categoriesIngreso.length) {
                    const existingIds = new Set(parsed.categoriesIngreso.map(c => c.id));
                    const newCats = defaults.categoriesIngreso.filter(c => !existingIds.has(c.id));
                    parsed.categoriesIngreso = [...parsed.categoriesIngreso, ...newCats];
                }
                if (!parsed.selectedType) parsed.selectedType = 'Gasto';
                if (!parsed.historyFilter) parsed.historyFilter = 'all';
                if (!parsed.appScriptUrl) parsed.appScriptUrl = '';
                if (!parsed.selectedMonth) parsed.selectedMonth = new Date().getMonth();
                if (!parsed.selectedYear) parsed.selectedYear = new Date().getFullYear();
                return parsed;
            }
            return null;
        },
        save: (data) => setStorage(data)
    };
})();

/**
 * SyncService - Sincronización con Google Sheets
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

    const syncIncremental = async (records) => {
        const lastSync = localStorage.getItem(SYNC_TIMESTAMP_KEY);
        const newRecords = records.filter(t => {
            if (!t.creado_en && !t.actualizado_en) return true;
            const created = t.creado_en ? new Date(t.creado_en) : new Date(0);
            const updated = t.actualizado_en ? new Date(t.actualizado_en) : new Date(0);
            const latest = new Date(Math.max(created, updated));
            return !lastSync || latest > new Date(lastSync);
        });
        if (newRecords.length === 0) {
            return { success: true, message: 'No hay registros nuevos', synced: 0 };
        }
        let synced = 0;
        for (const record of newRecords) {
            const result = await syncToSheet(record);
            if (result.success) synced++;
        }
        return { success: true, message: `${synced} registros sincronizados`, synced };
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