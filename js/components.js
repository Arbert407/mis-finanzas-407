/**
 * Componentes UI: Charts, Calendar, DatePicker, Modal, Settings
 */

let gastosChart = null;
let comparacionChart = null;
let boxplotChart = null;

// Charts
const initGastosChart = () => {
    const canvas = document.getElementById('gastos-chart');
    const canvasComparacion = document.getElementById('comparacion-chart');
    if (!canvas) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const isCurrentMonth = (dateStr) => {
        const date = new Date(dateStr);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    };

    const transactions = store.getState().transactions.filter(t => isCurrentMonth(t.fecha));

    if (gastosChart) gastosChart.destroy();

    const gastosPorCategoria = {};
    transactions.filter(t => t.tipo === 'Gasto').forEach(t => {
        const cat = t.categoria?.nombre || 'Otros';
        gastosPorCategoria[cat] = (gastosPorCategoria[cat] || 0) + t.monto;
    });

    const colors = ['#4CC9F0', '#F5C518', '#22C55E', '#EAB308', '#EF4444', '#60A5FA', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

    gastosChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: Object.keys(gastosPorCategoria),
            datasets: [{ data: Object.values(gastosPorCategoria), backgroundColor: colors, borderWidth: 0 }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#9CA3AF', padding: 16, usePointStyle: true } },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    callbacks: {
                        label: (ctx) => {
                            const val = ctx.parsed;
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            return `${formatCurrency(val)} (${((val / total) * 100).toFixed(1)}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });

    if (!canvasComparacion) return;
    if (comparacionChart) comparacionChart.destroy();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const firstSunday = firstDay === 0 ? 1 : 7 - firstDay + 1;
    const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('es-ES', { month: 'short' });
    const monthCap = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const labels = [`1-${firstSunday} ${monthCap}`, `${firstSunday + 1}-${Math.min(firstSunday + 7, daysInMonth)} ${monthCap}`, `${Math.min(firstSunday + 8, daysInMonth)}-${Math.min(firstSunday + 14, daysInMonth)} ${monthCap}`, `${Math.min(firstSunday + 15, daysInMonth)}-${daysInMonth} ${monthCap}`];

    const gastosPorSemana = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const ingresosPorSemana = { 1: 0, 2: 0, 3: 0, 4: 0 };

    transactions.forEach(t => {
        const date = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        const day = date.getDate();
        let week = day <= firstSunday ? 1 : Math.min(4, Math.floor((day - firstSunday - 1) / 7) + 2);
        if (t.tipo === 'Gasto') gastosPorSemana[week] = (gastosPorSemana[week] || 0) + t.monto;
        else ingresosPorSemana[week] = (ingresosPorSemana[week] || 0) + t.monto;
    });

    comparacionChart = new Chart(canvasComparacion, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'Ingresos', data: [ingresosPorSemana[1], ingresosPorSemana[2], ingresosPorSemana[3], ingresosPorSemana[4]], backgroundColor: 'rgba(34, 197, 94, 0.85)', borderColor: '#22C55E', borderWidth: 2, borderRadius: 8 },
                { label: 'Gastos', data: [gastosPorSemana[1], gastosPorSemana[2], gastosPorSemana[3], gastosPorSemana[4]], backgroundColor: 'rgba(239, 68, 68, 0.85)', borderColor: '#EF4444', borderWidth: 2, borderRadius: 8 }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom', labels: { color: '#9CA3AF' } } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: '#9CA3AF', callback: (v) => formatCurrency(v) } },
                x: { grid: { display: false }, ticks: { color: '#E5E7EB' } }
            }
        }
    });
};

const initBoxplotChart = () => {
    const canvas = document.getElementById('boxplot-chart');
    if (!canvas) return;
    if (boxplotChart) boxplotChart.destroy();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const firstSunday = firstDay === 0 ? 1 : 7 - firstDay + 1;
    const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('es-ES', { month: 'short' });
    const monthCap = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const labels = [`1-${firstSunday} ${monthCap}`, `${firstSunday + 1}-${Math.min(firstSunday + 7, daysInMonth)} ${monthCap}`, `${Math.min(firstSunday + 8, daysInMonth)}-${Math.min(firstSunday + 14, daysInMonth)} ${monthCap}`, `${Math.min(firstSunday + 15, daysInMonth)}-${daysInMonth} ${monthCap}`];

    const semanas = { 1: [], 2: [], 3: [], 4: [] };
    store.getState().transactions.filter(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        return t.tipo === 'Gasto' && d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    }).forEach(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        const day = d.getDate();
        const week = day <= firstSunday ? 1 : Math.min(4, Math.floor((day - firstSunday - 1) / 7) + 2);
        semanas[week].push(t.monto);
    });

    const calculateStats = (arr) => {
        if (!arr.length) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, avg: 0, std: 0 };
        const sorted = [...arr].sort((a, b) => a - b);
        const n = sorted.length;
        const sum = sorted.reduce((a, b) => a + b, 0);
        const avg = sum / n;
        const variance = sorted.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / n;
        const std = Math.sqrt(variance);
        
        const getPercentile = (p) => {
            const idx = (p / 100) * (n - 1);
            const lower = Math.floor(idx);
            const upper = Math.ceil(idx);
            if (lower === upper) return sorted[lower];
            return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
        };

        return {
            min: sorted[0],
            q1: getPercentile(25),
            median: getPercentile(50),
            q3: getPercentile(75),
            max: sorted[n - 1],
            avg,
            std
        };
    };

    const boxData = [];
    const medianLineData = [];
    const statsData = [];
    
    for (let w = 1; w <= 4; w++) {
        const stats = calculateStats(semanas[w]);
        statsData.push(stats);
        boxData.push([stats.q1, stats.q3]);
        medianLineData.push(stats.median);
    }

    boxplotChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Q1-Q3',
                data: boxData,
                backgroundColor: 'rgba(76, 201, 240, 0.5)',
                borderColor: '#4CC9F0',
                borderWidth: 2,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const stats = statsData[ctx.dataIndex];
                            return [
                                `Mín: ${formatCurrency(stats.min)}`,
                                `Q1: ${formatCurrency(stats.q1)}`,
                                `Mediana: ${formatCurrency(stats.median)}`,
                                `Q3: ${formatCurrency(stats.q3)}`,
                                `Máx: ${formatCurrency(stats.max)}`,
                                `Std: ${formatCurrency(stats.std)}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.08)' },
                    ticks: { color: '#9CA3AF', callback: (v) => formatCurrency(v) }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#E5E7EB' }
                }
            }
        },
        plugins: [{
            id: 'medianLine',
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                const xAxis = chart.scales.x;
                const yAxis = chart.scales.y;
                
                ctx.save();
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                
                medianLineData.forEach((median, i) => {
                    const x = xAxis.getPixelForValue(i);
                    const y = yAxis.getPixelForValue(median);
                    if (!isNaN(y)) {
                        const barWidth = chart.data.datasets[0].barPercentage * xAxis.width / 4;
                        const xStart = x - barWidth / 2;
                        const xEnd = x + barWidth / 2;
                        
                        ctx.beginPath();
                        ctx.moveTo(xStart, y);
                        ctx.lineTo(xEnd, y);
                        ctx.stroke();
                    }
                });
                ctx.restore();
            }
        }]
    });
};

const initGastosDiaChart = () => {
    const canvas = document.getElementById('gastos-dia-chart');
    if (!canvas) return;

    const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const gastosPorDia = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    const now = new Date();
    store.getState().transactions.filter(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        return t.tipo === 'Gasto' && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).forEach(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        gastosPorDia[d.getDay()] = (gastosPorDia[d.getDay()] || 0) + t.monto;
    });

    new Chart(canvas, {
        type: 'line',
        data: { labels: weekDays, datasets: [{ data: [gastosPorDia[1], gastosPorDia[2], gastosPorDia[3], gastosPorDia[4], gastosPorDia[5], gastosPorDia[6], gastosPorDia[0]], borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 3, fill: true, tension: 0.4, pointBackgroundColor: '#EF4444', pointRadius: 6 }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: (v) => formatCurrency(v) } }, x: { grid: { display: false } } } }
    });
};

// Calendar Heatmap
const renderCalendarHeatmap = () => {
    const container = document.getElementById('calendar-heatmap-container');
    if (!container) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const today = now.toDateString();
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const weekDaysShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    const gastosPorDia = {};
    store.getState().transactions.filter(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        return t.tipo === 'Gasto' && d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    }).forEach(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        gastosPorDia[d.getDate()] = (gastosPorDia[d.getDate()] || 0) + t.monto;
    });

    const maxGasto = Math.max(...Object.values(gastosPorDia), 0);
    const getLevel = (m) => m === 0 ? 0 : m / maxGasto <= 0.2 ? 1 : m / maxGasto <= 0.4 ? 2 : m / maxGasto <= 0.6 ? 3 : m / maxGasto <= 0.8 ? 4 : 5;

    let daysHtml = '';
    for (let i = daysInPrevMonth - adjustedFirstDay + 1; i <= daysInPrevMonth; i++) daysHtml += `<div class="calendar-day calendar-day--other">${i}</div>`;
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = new Date(currentYear, currentMonth, day).toDateString();
        const monto = gastosPorDia[day] || 0;
        daysHtml += `<div class="calendar-day calendar-day--level-${getLevel(monto)} ${dateStr === today ? 'calendar-day--today' : ''}">${day}<div class="calendar-tooltip"><strong>${day} de ${monthNames[currentMonth]}</strong><br>${monto > 0 ? formatCurrency(monto) : 'Sin gastos'}</div></div>`;
    }
    for (let i = 1; i <= 42 - (adjustedFirstDay + daysInMonth); i++) daysHtml += `<div class="calendar-day calendar-day--other">${i}</div>`;

    container.innerHTML = `
        <div class="chart-card__title">Gastos por Día del Mes</div>
        <div class="calendar-weekday-header">${weekDaysShort.map(d => `<div class="calendar-weekday-header__day">${d}</div>`).join('')}</div>
        <div class="calendar-heatmap">${daysHtml}</div>
        <div class="calendar-legend"><span>Menos</span>${[0,1,2,3,4,5].map(l => `<div class="calendar-legend__box calendar-day--level-${l}"></div>`).join('')}<span>Más</span></div>
    `;
};

// DatePicker
const DatePicker = (() => {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDate = null;
    let selectedHour = 10;
    let selectedMinute = 0;
    let inputElement = null, dropdownElement = null, onSelectCallback = null;
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const formatDateForInput = (date, hour, minute) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    const render = () => {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        const today = new Date();
        let daysHtml = '';

        for (let i = firstDay - 1; i >= 0; i--) daysHtml += `<div class="date-picker-day date-picker-day--other">${daysInPrevMonth - i}</div>`;
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            daysHtml += `<div class="date-picker-day ${date.toDateString() === today.toDateString() ? 'date-picker-day--today' : ''} ${selectedDate && date.toDateString() === selectedDate.toDateString() ? 'date-picker-day--selected' : ''}" data-day="${day}">${day}</div>`;
        }
        for (let i = 1; i <= 42 - (firstDay + daysInMonth); i++) daysHtml += `<div class="date-picker-day date-picker-day--other">${i}</div>`;

        dropdownElement.innerHTML = `
            <div class="date-picker-header">
                <button type="button" class="date-picker-nav-btn" id="prev-month">‹</button>
                <span class="date-picker-month">${monthNames[currentMonth]} ${currentYear}</span>
                <button type="button" class="date-picker-nav-btn" id="next-month">›</button>
            </div>
            <div class="date-picker-weekdays">${weekDays.map(d => `<div class="date-picker-weekday">${d}</div>`).join('')}</div>
            <div class="date-picker-days">${daysHtml}</div>
            <div class="date-picker-time">
                <span class="date-picker-time-label">Hora:</span>
                <input type="number" class="date-picker-time-input" id="picker-hour" value="${String(selectedHour).padStart(2, '0')}" min="0" max="23">
                <span style="color: var(--text-muted);">:</span>
                <input type="number" class="date-picker-time-input" id="picker-minute" value="${String(selectedMinute).padStart(2, '0')}" min="0" max="59">
            </div>
        `;

        dropdownElement.onclick = (e) => {
            if (e.target.id === 'prev-month') { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } render(); }
            else if (e.target.id === 'next-month') { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } render(); }
            else if (e.target.classList.contains('date-picker-day') && !e.target.classList.contains('date-picker-day--other')) { selectedDate = new Date(currentYear, currentMonth, parseInt(e.target.dataset.day)); render(); updateInputValue(); }
        };

        dropdownElement.onchange = (e) => {
            if (e.target.id === 'picker-hour') { selectedHour = Math.max(0, Math.min(23, parseInt(e.target.value) || 0)); e.target.value = String(selectedHour).padStart(2, '0'); updateInputValue(); }
            else if (e.target.id === 'picker-minute') { selectedMinute = Math.max(0, Math.min(59, parseInt(e.target.value) || 0)); e.target.value = String(selectedMinute).padStart(2, '0'); updateInputValue(); }
        };
    };

    const updateInputValue = () => {
        if (inputElement && selectedDate) {
            inputElement.value = formatDateForInput(selectedDate, selectedHour, selectedMinute);
            if (onSelectCallback) onSelectCallback(inputElement.value);
        }
    };

    return {
        init: (inputEl, dropdownEl, onSelect) => {
            inputElement = inputEl;
            dropdownElement = dropdownEl;
            onSelectCallback = onSelect;
            const initialValue = inputElement.value;
            if (initialValue && initialValue.includes('T')) {
                const [datePart, timePart] = initialValue.split('T');
                const [y, m, d] = datePart.split('-').map(Number);
                selectedDate = new Date(y, m - 1, d);
                currentMonth = selectedDate.getMonth();
                currentYear = selectedDate.getFullYear();
                const [h, min] = timePart.split(':').map(Number);
                selectedHour = h;
                selectedMinute = min;
            }
            inputElement.addEventListener('click', () => {
                document.querySelectorAll('.date-picker-dropdown').forEach(d => d.classList.remove('date-picker-dropdown--active'));
                dropdownElement.classList.add('date-picker-dropdown--active');
                render();
            });
            document.addEventListener('click', (e) => {
                if (!inputElement.contains(e.target) && !dropdownElement.contains(e.target)) dropdownElement.classList.remove('date-picker-dropdown--active');
            });
        }
    };
})();

// Settings Modal
window.openSettings = () => {
    const titleEl = document.getElementById('modal-title');
    const contentEl = document.getElementById('modal-content');
    const cancelBtn = document.getElementById('modal-cancel');
    const confirmBtn = document.getElementById('modal-confirm');
    const importBtn = document.getElementById('modal-import');
    const currentUrl = SyncService.getUrl();
    const lastSync = SyncService.getLastSync();

    titleEl.textContent = 'Ajustes';
    contentEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <label style="font-size: 12px; color: var(--text-secondary);">URL de Apps Script</label>
                <input type="text" id="appscript-url" class="input" placeholder="https://script.google.com/..." value="${currentUrl}">
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="btn btn--secondary" style="flex: 1;" onclick="testAppscriptConnection()">Probar conexión</button>
                <button class="btn btn--primary" style="flex: 1;" onclick="saveAppscriptUrl()">Guardar URL</button>
            </div>
            <hr style="border: none; border-top: 1px solid var(--border); width: 100%;">
            <button class="btn btn--primary" style="width: 100%;" onclick="syncAllToSheet()">Sincronizar todo</button>
            <button class="btn btn--secondary" style="width: 100%;" onclick="importFromSheet()">Importar desde hoja</button>
            <hr style="border: none; border-top: 1px solid var(--border); width: 100%;">
            <button class="btn btn--secondary" style="width: 100%;" onclick="exportData()">Exportar JSON</button>
            <button class="btn btn--secondary" style="width: 100%;" onclick="importData()">Importar JSON</button>
            ${lastSync ? `<div style="font-size: 11px; color: var(--text-secondary); text-align: center;">Última sincronización: ${new Date(lastSync).toLocaleString()}</div>` : ''}
        </div>`;
    cancelBtn.textContent = 'Cerrar';
    cancelBtn.onclick = closeModal;
    confirmBtn.style.display = 'none';
    importBtn.style.display = '';
    document.getElementById('modal-overlay').classList.add('modal-overlay--active');
};

window.saveAppscriptUrl = () => { SyncService.setUrl(document.getElementById('appscript-url').value.trim()); showToast('URL guardada correctamente', 'success'); };

window.testAppscriptConnection = async () => {
    const url = document.getElementById('appscript-url').value.trim();
    if (!url) { showToast('Ingresa una URL primero', 'error'); return; }
    showToast('Probando conexión...', 'info');
    try { await fetch(url, { method: 'GET', mode: 'no-cors' }); showToast('Conexión exitosa', 'success'); } catch (e) { showToast(`Error: ${e.message}`, 'error'); }
};

window.syncAllToSheet = async () => {
    const state = store.getState();
    if (state.transactions.length === 0) { showToast('No hay datos para sincronizar', 'warning'); return; }
    showToast('Sincronizando...', 'info');
    const result = await SyncService.syncIncremental(state.transactions);
    showToast(result.success ? result.message : `Error: ${result.message}`, result.success ? 'success' : 'error');
};

window.importFromSheet = async () => {
    showToast('Importando...', 'info');
    const result = await SyncService.importFromSheet();
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const state = store.getState();
        const rows = result.data;
        let records = [];
        if (rows[0] && Array.isArray(rows[0]) && rows[0][0] === 'id') {
            const headers = rows[0];
            records = rows.slice(1).map(row => { const obj = {}; headers.forEach((h, i) => { obj[h] = row[i]; }); return obj; }).filter(r => r.id && String(r.id) !== 'id');
        } else if (rows[0] && rows[0].id) {
            records = rows.filter(r => r.id && String(r.id) !== 'id');
        }
        const incoming = records.map(r => {
            const monto = parseFloat(r.monto);
            const catRaw = r.categoria ? String(r.categoria) : 'Otro';
            let catName = 'Otro';
            if (catRaw.includes('nombre=')) { const match = catRaw.match(/nombre=([^,}]+)/); catName = match ? match[1] : 'Otro'; }
            else if (catRaw !== '[object Object]') catName = catRaw;
            const tipo = String(r.tipo || 'Gasto').toLowerCase().includes('ingreso') ? 'Ingreso' : 'Gasto';
            const catList = tipo === 'Ingreso' ? state.categoriesIngreso : state.categoriesGasto;
            let catObj = catList.find(c => c.nombre.toLowerCase() === catName.toLowerCase());
            if (!catObj) catObj = catList.find(c => c.nombre.toLowerCase().includes(catName.toLowerCase()));
            if (!catObj) catObj = { id: 'otro', nombre: 'Otro', icono: '📦' };
            let fechaStr = r.fecha ? String(r.fecha) : '';
            if (fechaStr && fechaStr.length > 0) fechaStr = fechaStr.length <= 10 ? fechaStr + 'T12:00:00' : !fechaStr.includes('T') ? fechaStr + ':00' : fechaStr;
            return { id: r.id || crypto.randomUUID(), tipo, monto: isNaN(monto) ? 0 : monto, categoria: catObj, fecha: fechaStr || new Date().toISOString(), descripcion: r.descripcion ? String(r.descripcion) : '', creado_en: r.creado_en || new Date().toISOString(), actualizado_en: r.actualizado_en || new Date().toISOString() };
        }).filter(t => t.monto > 0);
        const merged = [...state.transactions, ...incoming];
        const unique = merged.filter((t, i, arr) => arr.findIndex(x => x.id === t.id) === i);
        store.setState({ ...state, transactions: unique });
        render();
        closeModal();
        showToast(`Importados ${incoming.length} registros`, 'success');
    } else {
        showToast('No hay datos para importar', 'error');
    }
};

window.exportData = () => {
    const state = store.getState();
    const data = { transactions: state.transactions, categoriesGasto: state.categoriesGasto, categoriesIngreso: state.categoriesIngreso, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mis-finanzas-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

window.importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                const state = store.getState();
                if (data.transactions) {
                    const mergedTransactions = [...state.transactions, ...data.transactions];
                    const uniqueTransactions = mergedTransactions.filter((t, i, arr) => arr.findIndex(x => x.id === t.id) === i);
                    store.setState({ ...state, transactions: uniqueTransactions, categoriesGasto: data.categoriesGasto || state.categoriesGasto, categoriesIngreso: data.categoriesIngreso || state.categoriesIngreso });
                    render();
                    closeModal();
                    showToast('Datos importados correctamente', 'success');
                } else {
                    showToast('Archivo no válido', 'error');
                }
            } catch (err) { showToast('Error al leer el archivo', 'error'); }
        };
        reader.readAsText(file);
    };
    input.click();
};