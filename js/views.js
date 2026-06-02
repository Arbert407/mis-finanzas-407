/**
 * Vistas
 */
const renderHomeView = () => {
    const transactions = store.getState().transactions;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const monthlyTransactions = transactions.filter(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T00:00');
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
    
    const totalIngresos = monthlyTransactions
        .filter(t => t.tipo === 'Ingreso')
        .reduce((sum, t) => sum + t.monto, 0);
    const totalGastos = monthlyTransactions
        .filter(t => t.tipo === 'Gasto')
        .reduce((sum, t) => sum + t.monto, 0);
    const balance = totalIngresos - totalGastos;

    const sortedAll = [...transactions].sort((a, b) => {
        const dateA = new Date(a.fecha.includes('T') ? a.fecha : a.fecha + 'T00:00');
        const dateB = new Date(b.fecha.includes('T') ? b.fecha : b.fecha + 'T00:00');
        return dateB - dateA;
    });
    const lastTransactions = sortedAll.slice(0, 5);

    return `
        <h1 class="page-title">Dashboard</h1>
        <div class="dashboard-grid">
            <div class="card balance-card">
                <div class="balance-card__icon ${balance >= 0 ? 'balance-card__icon--positive' : 'balance-card__icon--negative'}">
                    ${balance >= 0 ? '↑' : '↓'}
                </div>
                <div class="balance-card__label">Balance Total</div>
                <div class="balance-card__amount ${balance >= 0 ? 'balance-card__amount--positive' : 'balance-card__amount--negative'}">
                    ${formatCurrency(balance)}
                </div>
                <div class="balance-card__subtitle">del mes en curso</div>
            </div>
            <div class="card balance-card">
                <div class="balance-card__icon balance-card__icon--positive">+</div>
                <div class="balance-card__label">Ingresos</div>
                <div class="balance-card__amount balance-card__amount--positive">
                    ${formatCurrency(totalIngresos)}
                </div>
                <div class="balance-card__subtitle">del mes en curso</div>
            </div>
            <div class="card balance-card">
                <div class="balance-card__icon balance-card__icon--negative">−</div>
                <div class="balance-card__label">Gastos</div>
                <div class="balance-card__amount balance-card__amount--negative">
                    ${formatCurrency(totalGastos)}
                </div>
                <div class="balance-card__subtitle">del mes en curso</div>
            </div>
        </div>

        <h2 style="margin-top: 32px; margin-bottom: 16px; font-size: 20px;">Resumen Financiero</h2>
        <div class="dashboard-grid">
            <div class="card chart-card">
                <div class="chart-card__title">Gastos por Categoría</div>
                <div class="chart-container">
                    <canvas id="gastos-chart"></canvas>
                </div>
            </div>
            <div class="card chart-card">
                <div class="chart-card__title">Gastos por Horario</div>
                <div class="chart-container chart-container--bar" style="height: 280px;">
                    <canvas id="gastos-horario-chart"></canvas>
                </div>
            </div>
            <div class="card chart-card">
                <div class="chart-card__title">Movimientos por Semana</div>
                <div class="chart-container chart-container--bar">
                    <canvas id="comparacion-chart"></canvas>
                </div>
            </div>
            <div class="card chart-card">
                <div class="chart-card__title">Distribución de Gastos</div>
                <div class="chart-container chart-container--bar">
                    <canvas id="boxplot-chart"></canvas>
                </div>
            </div>
            <div class="card chart-card">
                <div class="chart-card__title">Gastos por Día</div>
                <div class="chart-container chart-container--bar" style="height: 300px;">
                    <canvas id="gastos-dia-chart"></canvas>
                </div>
            </div>
        </div>

        <h2 style="margin-top: 32px; margin-bottom: 16px; font-size: 20px;">Gastos del Mes</h2>
        <div class="dashboard-grid">
            <div class="card" style="grid-column: 1 / -1;">
                <div id="calendar-heatmap-container"></div>
            </div>
        </div>

        <h2 style="margin-top: 32px; margin-bottom: 16px; font-size: 20px;">Últimos Movimientos</h2>
        ${lastTransactions.length > 0 ? `
            <div class="transaction-list">
                ${lastTransactions.map(t => `
                    <div class="transaction-item">
                        <div class="transaction-item__info">
                            <div class="transaction-item__amount transaction-item__amount--${t.tipo.toLowerCase()}">
                                ${t.tipo === 'Gasto' ? '-' : '+'}${formatCurrency(t.monto)}
                            </div>
                            <div class="transaction-item__desc">${escapeHtml(t.descripcion) || 'Sin descripción'}</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="transaction-item__category">${t.categoria?.icono || ''} ${t.categoria?.nombre || ''}</div>
                            <div class="transaction-item__date">${formatDate(t.fecha)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : `
            <div class="empty-state">
                <div class="empty-state__icon">📊</div>
                <div class="empty-state__text">No hay movimientos aún</div>
            </div>
        `}
    `;
};

const renderAddTransactionView = () => {
    const state = store.getState();
    const selectedType = state.selectedType || 'Gasto';
    const categories = selectedType === 'Gasto' ? state.categoriesGasto : state.categoriesIngreso;
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const today = now.toISOString().slice(0, 16);

    return `
        <h1 class="page-title">Agregar Movimiento</h1>
        <div class="card card--form">
            <h2 class="card__title">Nuevo Registro</h2>
            <form id="transaction-form">
                <div class="type-selector">
                    <button type="button" class="type-btn type-btn--gasto ${selectedType === 'Gasto' ? 'type-btn--active' : ''}" data-type="Gasto" onclick="selectType('Gasto')">
                        <span class="type-btn__icon">💸</span>
                        <span class="type-btn__label">Gasto</span>
                    </button>
                    <button type="button" class="type-btn type-btn--ingreso ${selectedType === 'Ingreso' ? 'type-btn--active' : ''}" data-type="Ingreso" onclick="selectType('Ingreso')">
                        <span class="type-btn__icon">💰</span>
                        <span class="type-btn__label">Ingreso</span>
                    </button>
                </div>

                <input type="hidden" id="tipo" value="${selectedType}">

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="monto">Monto *</label>
                        <input type="number" id="monto" class="form-input" placeholder="0.00" step="0.01" min="0.01" required>
                        <div id="monto-error" class="form-error"></div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="categoria">Categoría *</label>
                        <select id="categoria" class="form-select" required>
                            <option value="">Selecciona una categoría</option>
                            ${categories.map(c => `
                                <option value="${c.id}">${c.icono} ${c.nombre}</option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="fecha">Fecha y Hora *</label>
                        <div class="date-picker-wrapper">
                            <input type="text" id="fecha" class="date-picker-input" placeholder="Seleccionar fecha y hora" value="${today}" readonly>
                            <span class="date-picker-icon">📅</span>
                            <div class="date-picker-dropdown" id="fecha-dropdown"></div>
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group form-row--full">
                        <label class="form-label" for="descripcion">Descripción</label>
                        <textarea id="descripcion" class="form-textarea" placeholder="Ej: Cena en restaurante..."></textarea>
                    </div>
                </div>

                <button type="submit" class="btn btn--primary btn--full">Guardar Movimiento</button>
            </form>
            <div id="form-message"></div>
        </div>
    `;
};

const renderEditTransactionView = () => {
    const state = store.getState();
    const transaction = state.transactions.find(t => t.id === state.editingId);

    if (!transaction) {
        return `
            <h1 class="page-title">Editar Movimiento</h1>
            <div class="card">
                <div class="alert alert--error">Transacción no encontrada</div>
                <a href="#/historial" class="btn btn--secondary">Volver al Historial</a>
            </div>
        `;
    }

    const categories = transaction.tipo === 'Gasto' ? state.categoriesGasto : state.categoriesIngreso;

    return `
        <h1 class="page-title">Editar Movimiento</h1>
        <div class="card card--form">
            <h2 class="card__title">Modificar Registro</h2>
            <form id="transaction-form">
                <div class="type-selector">
                    <button type="button" class="type-btn type-btn--gasto ${transaction.tipo === 'Gasto' ? 'type-btn--active' : ''}" data-type="Gasto" onclick="selectType('Gasto')">
                        <span class="type-btn__icon">💸</span>
                        <span class="type-btn__label">Gasto</span>
                    </button>
                    <button type="button" class="type-btn type-btn--ingreso ${transaction.tipo === 'Ingreso' ? 'type-btn--active' : ''}" data-type="Ingreso" onclick="selectType('Ingreso')">
                        <span class="type-btn__icon">💰</span>
                        <span class="type-btn__label">Ingreso</span>
                    </button>
                </div>

                <input type="hidden" id="tipo" value="${transaction.tipo}">

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="monto">Monto *</label>
                        <input type="number" id="monto" class="form-input" placeholder="0.00" step="0.01" min="0.01" value="${transaction.monto}" required>
                        <div id="monto-error" class="form-error"></div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="categoria">Categoría *</label>
                        <select id="categoria" class="form-select" required>
                            <option value="">Selecciona una categoría</option>
                            ${categories.map(c => `
                                <option value="${c.id}" ${transaction.categoria?.id === c.id ? 'selected' : ''}>${c.icono} ${c.nombre}</option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="fecha">Fecha y Hora *</label>
                        <div class="date-picker-wrapper">
                            <input type="text" id="fecha" class="date-picker-input" placeholder="Seleccionar fecha y hora" value="${transaction.fecha.includes('T') ? transaction.fecha : transaction.fecha + 'T10:00'}" readonly>
                            <span class="date-picker-icon">📅</span>
                            <div class="date-picker-dropdown" id="fecha-dropdown"></div>
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group form-row--full">
                        <label class="form-label" for="descripcion">Descripción</label>
                        <textarea id="descripcion" class="form-textarea" placeholder="Ej: Cena en restaurante...">${transaction.descripcion || ''}</textarea>
                    </div>
                </div>

                <button type="submit" class="btn btn--primary btn--full">Guardar Cambios</button>
                <a href="#/historial" class="btn btn--secondary btn--full" style="margin-top: 8px;">Cancelar</a>
            </form>
            <div id="form-message"></div>
        </div>
    `;
};

const renderHistoryView = () => {
    const transactions = store.getState().transactions;
    const sorted = [...transactions].sort((a, b) => {
        const dateA = new Date(a.fecha.includes('T') ? a.fecha : a.fecha + 'T00:00');
        const dateB = new Date(b.fecha.includes('T') ? b.fecha : b.fecha + 'T00:00');
        return dateB - dateA;
    });

    return `
        <h1 class="page-title">Historial de Movimientos</h1>
        <div class="filter-bar">
            <button class="filter-btn filter-btn--active" onclick="filterByType('all')" id="filter-all">Todos</button>
            <button class="filter-btn filter-btn--ingreso" onclick="filterByType('Ingreso')" id="filter-Ingreso">Ingresos</button>
            <button class="filter-btn filter-btn--gasto" onclick="filterByType('Gasto')" id="filter-Gasto">Gastos</button>
        </div>
        <div id="filtered-transactions">
        ${transactions.length > 0 ? `
            <div class="card">
                <table class="transactions-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Descripción</th>
                            <th>Categoría</th>
                            <th>Tipo</th>
                            <th>Monto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sorted.map(t => `
                            <tr>
                                <td data-label="Fecha">${formatDate(t.fecha)}</td>
                                <td data-label="Descripción">${escapeHtml(t.descripcion) || '-'}</td>
                                <td data-label="Categoría"><span class="category-badge">${t.categoria?.icono || ''}<span class="category-name"> ${t.categoria?.nombre || '-'}</span></span></td>
                                <td data-label="Tipo"><span class="transaction-item__type transaction-item__type--${t.tipo.toLowerCase()}">${t.tipo}</span></td>
                                <td data-label="Monto" class="transaction-item__amount transaction-item__amount--${t.tipo.toLowerCase()}">${t.tipo === 'Gasto' ? '-' : '+'}${formatCurrency(t.monto)}</td>
                                <td class="transaction-item__actions" data-label="Acciones">
                                    <button class="btn--edit" onclick="editTransaction('${t.id}')">Editar</button>
                                    <button class="btn--delete" onclick="confirmDeleteTransaction('${t.id}')">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        ` : `
            <div class="card">
                <div class="empty-state">
                    <div class="empty-state__icon">📋</div>
                    <div class="empty-state__text">No hay movimientos registrados</div>
                </div>
            </div>
        `}
        </div>
    `;
};

// Handlers de interacción
window.filterByType = (type) => {
    const state = store.getState();
    store.setState({ ...state, historyFilter: type });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('filter-btn--active');
    });
    document.getElementById(`filter-${type}`).classList.add('filter-btn--active');

    const container = document.getElementById('filtered-transactions');
    const transactions = state.transactions;
    const sorted = [...transactions].sort((a, b) => {
        const dateA = new Date(a.fecha.includes('T') ? a.fecha : a.fecha + 'T00:00');
        const dateB = new Date(b.fecha.includes('T') ? b.fecha : b.fecha + 'T00:00');
        return dateB - dateA;
    });
    const filtered = type === 'all' ? sorted : sorted.filter(t => t.tipo === type);

    if (filtered.length > 0) {
        container.innerHTML = `
            <div class="card">
                <table class="transactions-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Descripción</th>
                            <th>Categoría</th>
                            <th>Tipo</th>
                            <th>Monto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filtered.map(t => `
                            <tr>
                                <td data-label="Fecha">${formatDate(t.fecha)}</td>
                                <td data-label="Descripción">${escapeHtml(t.descripcion) || '-'}</td>
                                <td data-label="Categoría"><span class="category-badge">${t.categoria?.icono || ''}<span class="category-name"> ${t.categoria?.nombre || '-'}</span></span></td>
                                <td data-label="Tipo"><span class="transaction-item__type transaction-item__type--${t.tipo.toLowerCase()}">${t.tipo}</span></td>
                                <td data-label="Monto" class="transaction-item__amount transaction-item__amount--${t.tipo.toLowerCase()}">${t.tipo === 'Gasto' ? '-' : '+'}${formatCurrency(t.monto)}</td>
                                <td class="transaction-item__actions" data-label="Acciones">
                                    <button class="btn--edit" onclick="editTransaction('${t.id}')">Editar</button>
                                    <button class="btn--delete" onclick="confirmDeleteTransaction('${t.id}')">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="card">
                <div class="empty-state">
                    <div class="empty-state__icon">📋</div>
                    <div class="empty-state__text">No hay movimientos ${type === 'all' ? '' : `de tipo ${type}`}</div>
                </div>
            </div>
        `;
    }
};

window.selectType = (type) => {
    document.getElementById('tipo').value = type;
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('type-btn--active');
        if (btn.dataset.type === type) btn.classList.add('type-btn--active');
    });
    store.setState({ ...store.getState(), selectedType: type });
    updateCategorySelect(type);
};

const updateCategorySelect = (type) => {
    const state = store.getState();
    const categories = type === 'Gasto' ? state.categoriesGasto : state.categoriesIngreso;
    const select = document.getElementById('categoria');
    if (select) {
        select.innerHTML = `
            <option value="">Selecciona una categoría</option>
            ${categories.map(c => `<option value="${c.id}">${c.icono} ${c.nombre}</option>`).join('')}
        `;
    }
};

window.editTransaction = (id) => navigate(`/editar/${id}`);

window.confirmDeleteTransaction = (id) => {
    const overlay = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    const cancelBtn = document.getElementById('modal-cancel');
    const confirmBtn = document.getElementById('modal-confirm');
    const importBtn = document.getElementById('modal-import');

    title.textContent = 'Eliminar Movimiento';
    content.textContent = '¿Estás seguro de que deseas eliminar este movimiento? Esta acción no se puede deshacer.';
    cancelBtn.style.display = '';
    confirmBtn.style.display = '';
    importBtn.style.display = 'none';
    overlay.classList.add('modal-overlay--active');

    confirmBtn.onclick = () => {
        const state = store.getState();
        store.setState({
            ...state,
            transactions: state.transactions.filter(t => t.id !== id)
        });
        closeModal();
        render();
    };
    cancelBtn.onclick = closeModal;
};

const closeModal = () => {
    document.getElementById('modal-overlay').classList.remove('modal-overlay--active');
};

const showToast = (message, type = 'info') => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast toast--' + type;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 5000);
};

// Handlers de formularios
const handleFormSubmit = (e) => {
    e.preventDefault();
    const montoInput = document.getElementById('monto');
    const montoError = document.getElementById('monto-error');
    const validation = validateMonto(montoInput.value);

    if (!validation.valid) {
        montoInput.classList.add('form-input--error');
        montoError.textContent = validation.error;
        return;
    }
    montoInput.classList.remove('form-input--error');
    montoError.textContent = '';

    const tipo = document.getElementById('tipo').value;
    const monto = parseFloat(montoInput.value);
    const fecha = document.getElementById('fecha').value;
    const categoriaId = document.getElementById('categoria').value;
    const descripcion = document.getElementById('descripcion').value;

    const state = store.getState();
    const categories = tipo === 'Gasto' ? state.categoriesGasto : state.categoriesIngreso;
    const categoria = categories.find(c => c.id === categoriaId);

    const newTransaction = {
        id: generateId(),
        tipo,
        monto,
        fecha,
        descripcion,
        categoria,
        creado_en: new Date().toISOString()
    };

    store.setState({
        ...store.getState(),
        transactions: [...store.getState().transactions, newTransaction]
    });

    document.getElementById('form-message').innerHTML = '<div class="alert alert--success">Movimiento guardado correctamente</div>';
    setTimeout(() => navigate('/'), 1500);
};

const handleEditFormSubmit = (e, id) => {
    e.preventDefault();
    const montoInput = document.getElementById('monto');
    const montoError = document.getElementById('monto-error');
    const validation = validateMonto(montoInput.value);

    if (!validation.valid) {
        montoInput.classList.add('form-input--error');
        montoError.textContent = validation.error;
        return;
    }
    montoInput.classList.remove('form-input--error');
    montoError.textContent = '';

    const tipo = document.getElementById('tipo').value;
    const monto = parseFloat(montoInput.value);
    const fecha = document.getElementById('fecha').value;
    const categoriaId = document.getElementById('categoria').value;
    const descripcion = document.getElementById('descripcion').value;

    const state = store.getState();
    const categories = tipo === 'Gasto' ? state.categoriesGasto : state.categoriesIngreso;
    const categoria = categories.find(c => c.id === categoriaId);

    const updatedTransactions = state.transactions.map(t => {
        if (t.id === id) {
            return { ...t, tipo, monto, fecha, descripcion, categoria, actualizado_en: new Date().toISOString() };
        }
        return t;
    });

    store.setState({ ...state, transactions: updatedTransactions });
    document.getElementById('form-message').innerHTML = '<div class="alert alert--success">Movimiento actualizado correctamente</div>';
    setTimeout(() => navigate('/'), 1500);
};

// Render principal
const render = () => {
    const main = document.getElementById('main-content');
    const state = store.getState();

    renderNav();

    switch (state.currentView) {
        case 'home':
            main.innerHTML = renderHomeView();
            const fabHome = document.querySelector('.fab');
            if (fabHome) fabHome.classList.remove('fab--hidden');
            setTimeout(() => { initGastosChart(); }, 100);
            setTimeout(() => { initGastosHorarioChart(); }, 150);
            setTimeout(() => { initGastosDiaChart(); }, 200);
            setTimeout(() => { initBoxplotChart(); }, 250);
            setTimeout(() => { renderCalendarHeatmap(); }, 300);
            break;
        case 'add-transaction':
            main.innerHTML = renderAddTransactionView();
            document.querySelector('.fab')?.classList.add('fab--hidden');
            document.getElementById('transaction-form').addEventListener('submit', handleFormSubmit);
            setTimeout(() => {
                DatePicker.init(document.getElementById('fecha'), document.getElementById('fecha-dropdown'));
            }, 100);
            break;
        case 'history':
            main.innerHTML = renderHistoryView();
            document.querySelector('.fab')?.classList.remove('fab--hidden');
            break;
        case 'edit-transaction':
            main.innerHTML = renderEditTransactionView();
            document.querySelector('.fab')?.classList.add('fab--hidden');
            if (state.editingId) {
                document.getElementById('transaction-form').addEventListener('submit', (e) => handleEditFormSubmit(e, state.editingId));
                setTimeout(() => {
                    DatePicker.init(document.getElementById('fecha'), document.getElementById('fecha-dropdown'));
                }, 100);
            }
            break;
        default:
            main.innerHTML = renderHomeView();
    }
};

window.addEventListener('charts:update', () => {
    if (document.getElementById('gastos-chart')) {
        setTimeout(() => { initGastosChart(); }, 50);
        setTimeout(() => { initGastosHorarioChart(); }, 100);
        setTimeout(() => { initGastosDiaChart(); }, 150);
        setTimeout(() => { initBoxplotChart(); }, 200);
        setTimeout(() => { renderCalendarHeatmap(); }, 250);
    }
});