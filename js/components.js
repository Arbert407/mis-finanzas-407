/**
 * Componentes UI - Gráficos, Calendario, DatePicker, Modal y Configuración
 * 
 * Este archivo contiene componentes visuales que requieren inicialización después
 * de que el DOM es renderizado: Chart.js charts, calendar heatmap, datepicker, modals.
 * 
 * Funciones llamadas:
 *   - store.getState() => js/state.js, obtiene el estado global
 *   - Chart => librería externa Chart.js para gráficos
 *   - formatCurrency() => js/utils.js, formatea números a moneda
 *   - showToast() => función globally definida para notificaciones
 *   - closeModal() => js/views.js, cierra modal activo
 *   - SyncService => js/state.js, sincronización con Google Sheets
 * 
 * Archivos involucrados:
 *   - js/state.js (estado global, servicios de datos)
 *   - js/views.js (closeModal, showToast)
 *   - js/utils.js (formatCurrency, generateId)
 */

// Referencias a instancias de Chart.js para poder destruirlas antes de recrear
let gastosChart = null;
let comparacionChart = null;
let boxplotChart = null;
let gastosHorarioChart = null;
let gastosDiaChart = null;
let polarChart = null;

// Calcula rangos de semanas para un mes específico.
// Útil para gráficos de boxplot y comparación semanal.
// Parámetros: year (number), month (0-11)
// Retorna: array de objetos { week, start, end, label }
const getMonthWeekRanges = (year, month) => {
    const ranges = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = new Date(year, month, 1).toLocaleString('es-ES', { month: 'short' });
    const monthCap = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    
    let currentDate = 1;
    let weekNum = 1;
    
    while (currentDate <= daysInMonth) {
        const date = new Date(year, month, currentDate);
        const dayOfWeek = date.getDay();
        
        let weekEnd;
        if (weekNum === 1 && dayOfWeek !== 1) {
            const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
            weekEnd = Math.min(currentDate + daysUntilMonday - 1, daysInMonth);
        } else {
            weekEnd = Math.min(currentDate + 6, daysInMonth);
        }
        
        ranges.push({
            week: weekNum,
            start: currentDate,
            end: weekEnd,
            label: currentDate + '-' + weekEnd + ' ' + monthCap
        });
        
        currentDate = weekEnd + 1;
        weekNum++;
        if (weekNum > 5) break;
    }
    
    return ranges;
};

// Inicializa gráfico doughnut de Gastos por Categoría.
// Lee selectedMonth/selectedYear del state para filtrar transacciones.
// Usa Chart.js para renderizar. Destroy y recreate en cada llamada.
// Llama a: store.getState(), formatCurrency()
const initGastosChart = () => {
    const canvas = document.getElementById('gastos-chart');
    const canvasComparacion = document.getElementById('comparacion-chart');
    if (!canvas) return;

    const state = store.getState();
    const selectedYear = state.selectedYear ?? new Date().getFullYear();
    const selectedMonth = state.selectedMonth ?? new Date().getMonth();

    const isSelectedMonth = (dateStr) => {
        const date = new Date(dateStr);
        return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
    };

    const transactions = store.getState().transactions.filter(t => isSelectedMonth(t.fecha));

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
            maintainAspectRatio: false,
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

    const monthName = new Date(selectedYear, selectedMonth, 1).toLocaleDateString('es-ES', { month: 'short' });
    const monthCap = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const getWeekRanges = () => {
        const ranges = [];
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        
        let currentDate = 1;
        let weekNum = 1;
        
        while (currentDate <= daysInMonth) {
            const date = new Date(selectedYear, selectedMonth, currentDate);
            const dayOfWeek = date.getDay();
            
            let weekEnd;
            if (weekNum === 1 && dayOfWeek !== 1) {
                const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
                weekEnd = Math.min(currentDate + daysUntilMonday - 1, daysInMonth);
            } else {
                weekEnd = Math.min(currentDate + 6, daysInMonth);
            }
            
            ranges.push({
                week: weekNum,
                start: currentDate,
                end: weekEnd,
                label: currentDate + '-' + weekEnd + ' ' + monthCap
            });
            
            currentDate = weekEnd + 1;
            weekNum++;
            if (weekNum > 5) break;
        }
        
        return ranges;
    };

    const weekRanges = getWeekRanges();
    const labels = weekRanges.map(w => w.label);
    const gastosPorSemana = {};
    const ingresosPorSemana = {};
    weekRanges.forEach(w => {
        gastosPorSemana[w.week] = 0;
        ingresosPorSemana[w.week] = 0;
    });

    transactions.forEach(t => {
        const date = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        const day = date.getDate();
        const week = weekRanges.find(w => day >= w.start && day <= w.end);
        if (week) {
            if (t.tipo === 'Gasto') gastosPorSemana[week.week] += t.monto;
            else ingresosPorSemana[week.week] += t.monto;
        }
    });

    comparacionChart = new Chart(canvasComparacion, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'Ingresos', data: weekRanges.map(w => ingresosPorSemana[w.week]), backgroundColor: 'rgba(168, 85, 247, 0.85)', borderColor: '#A855F7', borderWidth: 2, borderRadius: 8 },
                { label: 'Gastos', data: weekRanges.map(w => gastosPorSemana[w.week]), backgroundColor: 'rgba(249, 115, 22, 0.85)', borderColor: '#F97316', borderWidth: 2, borderRadius: 8 }
            ]
        },
options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#9CA3AF' } }},
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: '#9CA3AF', callback: (v) => formatCurrency(v) } },
                x: { grid: { display: false }, ticks: { color: '#E5E7EB' } }
            }
        }
    });
};

// Inicializa gráfico boxplot de distribución de gastos por semana.
// Calcula estadísticas (min, q1, median, q3, max, avg) por semana.
// Útil para ver variabilidad de gastos en el mes.
// Llama a: store.getState(), getMonthWeekRanges()
const initBoxplotChart = () => {
    const canvas = document.getElementById('boxplot-chart');
    if (!canvas) return;
    if (boxplotChart) boxplotChart.destroy();

    const state = store.getState();
    const selectedYear = state.selectedYear ?? new Date().getFullYear();
    const selectedMonth = state.selectedMonth ?? new Date().getMonth();
    const weekRanges = getMonthWeekRanges(selectedYear, selectedMonth);
    const labels = weekRanges.map(w => w.label);
    const semanas = {};
    weekRanges.forEach(w => { semanas[w.week] = []; });

    store.getState().transactions.filter(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        return t.tipo === 'Gasto' && d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    }).forEach(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        const day = d.getDate();
        const week = weekRanges.find(w => day >= w.start && day <= w.end);
        if (week) semanas[week.week].push(t.monto);
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

    const statsData = [];
    const rangeData = [];
    
    weekRanges.forEach(w => {
        const stats = calculateStats(semanas[w.week]);
        statsData.push(stats);
        rangeData.push([stats.min, stats.max]);
    });

    boxplotChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Rango',
                data: rangeData,
                backgroundColor: 'rgba(76, 201, 240, 0.15)',
                borderColor: '#4CC9F0',
                borderWidth: 0,
                barPercentage: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
            id: 'boxplotElements',
            beforeDatasetsDraw: (chart) => {
                const ctx = chart.ctx;
                const xAxis = chart.scales.x;
                const yAxis = chart.scales.y;
                const dataset = chart.data.datasets[0];
                const numWeeks = weekRanges.length;
                
                ctx.save();
                
                statsData.forEach((stats, i) => {
                    const x = xAxis.getPixelForValue(i);
                    const barWidth = dataset.barPercentage * xAxis.width / numWeeks;
                    const xStart = x - barWidth / 2;
                    const xEnd = x + barWidth / 2;
                    
                    const minY = yAxis.getPixelForValue(stats.min);
                    const maxY = yAxis.getPixelForValue(stats.max);
                    const q1Y = yAxis.getPixelForValue(stats.q1);
                    const q3Y = yAxis.getPixelForValue(stats.q3);
                    const medianY = yAxis.getPixelForValue(stats.median);
                    
                    if (isNaN(minY) || isNaN(maxY)) return;
                    
                    ctx.fillStyle = 'rgba(76, 201, 240, 0.6)';
                    ctx.fillRect(xStart, q3Y, xEnd - xStart, q1Y - q3Y);
                    
                    ctx.strokeStyle = '#4CC9F0';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(xStart, q3Y, xEnd - xStart, q1Y - q3Y);
                    
                    ctx.strokeStyle = '#4CC9F0';
                    ctx.lineWidth = 2;
                    
                    ctx.beginPath();
                    ctx.moveTo(x, minY);
                    ctx.lineTo(x, q1Y);
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.moveTo(x, q3Y);
                    ctx.lineTo(x, maxY);
                    ctx.stroke();
                    
                    const whiskerWidth = barWidth * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(xStart + barWidth * 0.2, minY);
                    ctx.lineTo(xEnd - barWidth * 0.2, minY);
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.moveTo(xStart + barWidth * 0.2, maxY);
                    ctx.lineTo(xEnd - barWidth * 0.2, maxY);
                    ctx.stroke();
                    
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(xStart + barWidth * 0.15, medianY);
                    ctx.lineTo(xEnd - barWidth * 0.15, medianY);
                    ctx.stroke();
                });
                
                ctx.restore();
            }
        }]
    });
};

// Inicializa gráfico lineal de Gastos por Día de la semana.
// Muestra promedio de gastos por cada día (Lunes-Domingo).
// Útil para identificar días de mayor gasto.
// Llama a: store.getState()
const initGastosDiaChart = () => {
    const canvas = document.getElementById('gastos-dia-chart');
    if (!canvas) return;
    if (gastosDiaChart) gastosDiaChart.destroy();

    const state = store.getState();
    const selectedYear = state.selectedYear ?? new Date().getFullYear();
    const selectedMonth = state.selectedMonth ?? new Date().getMonth();
    
    const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const gastosPorDia = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    store.getState().transactions.filter(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        return t.tipo === 'Gasto' && d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    }).forEach(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        gastosPorDia[d.getDay()] = (gastosPorDia[d.getDay()] || 0) + t.monto;
    });

    const data = [gastosPorDia[1], gastosPorDia[2], gastosPorDia[3], gastosPorDia[4], gastosPorDia[5], gastosPorDia[6], gastosPorDia[0]];

    gastosDiaChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: weekDays,
            datasets: [{
                data,
                borderColor: '#EF4444',
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return 'rgba(239, 68, 68, 0.1)';
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
                    gradient.addColorStop(1, 'rgba(239, 68, 68, 0.02)');
                    return gradient;
                },
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#EF4444',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 10,
                pointStyle: 'circle'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => formatCurrency(ctx.raw)
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
        }
    });
};

// Inicializa gráfico de barras apiladas de Gastos por Horario.
// Muestra distribución de gastos por franjas horarias (00-04, 04-08, etc.).
// Cada barrera representa una categoría.
// Útil para identificar horarios de mayor consumo.
// Llama a: store.getState()
const initGastosHorarioChart = () => {
    const canvas = document.getElementById('gastos-horario-chart');
    if (!canvas) return;
    if (gastosHorarioChart) gastosHorarioChart.destroy();

    const state = store.getState();
    const selectedYear = state.selectedYear ?? new Date().getFullYear();
    const selectedMonth = state.selectedMonth ?? new Date().getMonth();
    
    const getFranja = (fecha) => {
        const hour = new Date(fecha).getHours();
        if (hour >= 0 && hour < 4) return 0;
        if (hour >= 4 && hour < 8) return 1;
        if (hour >= 8 && hour < 12) return 2;
        if (hour >= 12 && hour < 16) return 3;
        if (hour >= 16 && hour < 20) return 4;
        return 5;
    };

    const gastosPorFranjaCat = {
        0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}
    };

    store.getState().transactions.filter(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        return t.tipo === 'Gasto' && d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    }).forEach(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        const fr = getFranja(d);
        const cat = t.categoria?.nombre || 'Otros';
        if (!gastosPorFranjaCat[fr][cat]) gastosPorFranjaCat[fr][cat] = 0;
        gastosPorFranjaCat[fr][cat] += t.monto;
    });

    const allCategories = [...new Set(Object.values(gastosPorFranjaCat).flatMap(f => Object.keys(f)))];
    const labels = ['00:00-04:00', '04:00-08:00', '08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-24:00'];
    const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#06B6D4', '#F43F5E'];

    const datasets = allCategories.map((cat, i) => ({
        label: cat,
        data: [0, 1, 2, 3, 4, 5].map(f => gastosPorFranjaCat[f][cat] || 0),
        backgroundColor: colors[i % colors.length],
        borderWidth: 0,
        borderRadius: i === allCategories.length - 1 ? { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 } : 0
    }));

    if (gastosHorarioChart) gastosHorarioChart.destroy();

    gastosHorarioChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#9CA3AF', padding: 12, usePointStyle: true } },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true,
                    grid: { color: 'rgba(255,255,255,0.08)' },
                    ticks: { color: '#9CA3AF', callback: (v) => formatCurrency(v) }
                },
                x: {
                    stacked: true,
                    grid: { display: false },
                    ticks: { color: '#E5E7EB' }
                }
            }
        }
    });
};

// Inicializa gráfico radar de Perfil de Gastos por Categoría.
// Muestra las top 6 categorías de gasto del mes actual vs mes anterior.
// Útil para comparar patrones de gasto entre períodos.
// Llama a: store.getState(), formatCurrency()
const initPolarChart = () => {
    const canvas = document.getElementById('polar-chart');
    if (!canvas) return;
    if (polarChart) polarChart.destroy();

    const state = store.getState();
    const selectedYear = state.selectedYear ?? new Date().getFullYear();
    const selectedMonth = state.selectedMonth ?? new Date().getMonth();

    const isSelectedMonth = (dateStr, year, month) => {
        const date = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T12:00:00');
        return date.getFullYear() === year && date.getMonth() === month;
    };

    const currentMonthTx = store.getState().transactions.filter(t => 
        t.tipo === 'Gasto' && isSelectedMonth(t.fecha, selectedYear, selectedMonth)
    );

    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const prevMonthTx = store.getState().transactions.filter(t => 
        t.tipo === 'Gasto' && isSelectedMonth(t.fecha, prevYear, prevMonth)
    );

    const getGastosPorCategoria = (transactions) => {
        const result = {};
        transactions.forEach(t => {
            const cat = t.categoria?.nombre || 'Otros';
            result[cat] = (result[cat] || 0) + t.monto;
        });
        return result;
    };

    const currentData = getGastosPorCategoria(currentMonthTx);
    const prevData = getGastosPorCategoria(prevMonthTx);

    const allCategories = [...new Set([...Object.keys(currentData), ...Object.keys(prevData)])];
    
    const sorted = allCategories
        .map(cat => ({
            name: cat,
            total: (currentData[cat] || 0) + (prevData[cat] || 0)
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 6);

    const labels = sorted.map(c => c.name);
    const currentValues = sorted.map(c => currentData[c.name] || 0);
    const prevValues = sorted.map(c => prevData[c.name] || 0);

    polarChart = new Chart(canvas, {
        type: 'radar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Mes Anterior',
                    data: prevValues,
                    backgroundColor: 'rgba(139, 92, 246, 0.15)',
                    borderColor: '#8B5CF6',
                    borderWidth: 2,
                    pointBackgroundColor: '#8B5CF6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Mes Actual',
                    data: currentValues,
                    backgroundColor: 'rgba(76, 201, 240, 0.15)',
                    borderColor: '#4CC9F0',
                    borderWidth: 2,
                    pointBackgroundColor: '#4CC9F0',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#9CA3AF', padding: 16, usePointStyle: true }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    angleLines: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: {
                        color: '#E5E7EB',
                        font: { size: 12 }
                    },
                    ticks: {
                        display: false
                    }
                }
            }
        }
    });
};

// Calendar Heatmap - Renderiza mapa de calor de gastos por día del mes.
// Muestra cada día del mes coloreado según monto gastado.
// Niveles: 0 (sin datos), 1-5 (intensidad creciente).
// Incluye tooltip con monto al hover.
// Llama a: store.getState(), formatCurrency()
const renderCalendarHeatmap = () => {
    const container = document.getElementById('calendar-heatmap-container');
    if (!container) return;

    const state = store.getState();
    const selectedYear = state.selectedYear ?? new Date().getFullYear();
    const selectedMonth = state.selectedMonth ?? new Date().getMonth();
    const now = new Date();
    const today = now.toDateString();
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const weekDaysShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    const gastosPorDia = {};
    store.getState().transactions.filter(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        return t.tipo === 'Gasto' && d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    }).forEach(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        gastosPorDia[d.getDate()] = (gastosPorDia[d.getDate()] || 0) + t.monto;
    });

    const maxGasto = Math.max(...Object.values(gastosPorDia), 0);
    const getLevel = (m) => m === 0 ? 0 : m / maxGasto <= 0.2 ? 1 : m / maxGasto <= 0.4 ? 2 : m / maxGasto <= 0.6 ? 3 : m / maxGasto <= 0.8 ? 4 : 5;

    let daysHtml = '';
    for (let i = daysInPrevMonth - adjustedFirstDay + 1; i <= daysInPrevMonth; i++) daysHtml += `<div class="calendar-day calendar-day--other">${i}</div>`;
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = new Date(selectedYear, selectedMonth, day).toDateString();
        const monto = gastosPorDia[day] || 0;
        daysHtml += `<div class="calendar-day calendar-day--level-${getLevel(monto)} ${dateStr === today ? 'calendar-day--today' : ''}">${day}<div class="calendar-tooltip"><strong>${day} de ${monthNames[selectedMonth]}</strong><br>${monto > 0 ? formatCurrency(monto) : 'Sin gastos'}</div></div>`;
    }
    for (let i = 1; i <= 42 - (adjustedFirstDay + daysInMonth); i++) daysHtml += `<div class="calendar-day calendar-day--other">${i}</div>`;

    container.innerHTML = `
        <div class="chart-card__title">Gastos por Día del Mes</div>
        <div class="calendar-weekday-header">${weekDaysShort.map(d => `<div class="calendar-weekday-header__day">${d}</div>`).join('')}</div>
        <div class="calendar-heatmap">${daysHtml}</div>
        <div class="calendar-legend"><span>Menos</span>${[0,1,2,3,4,5].map(l => `<div class="calendar-legend__box calendar-day--level-${l}"></div>`).join('')}<span>Más</span></div>
    `;
};

// DatePicker - Componente selector de fecha y hora
// Servicio IIFE que maneja la selección de fecha/hora en formularios.
// Soporta navegación por meses, años, y selección de hora.
// Métodos expose: init(input, dropdown), destroy()
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

// Genera opciones de mes/año para dropdown en modal de settings.
// Lee transactions del state, extrae meses únicos, toma los últimos 24 meses.
// Formato: "Marzo 2025", "Abril 2025", etc.
// Retorna: string HTML con opciones <option>
// Llama a: store.getState()
const getMonthOptions = () => {
    const state = store.getState();
    const transactions = state.transactions || [];
    
    const monthsSet = new Set();
    transactions.forEach(t => {
        if (t.fecha) {
            const d = new Date(t.fecha);
            if (!isNaN(d.getTime())) {
                monthsSet.add(`${d.getFullYear()}-${d.getMonth()}`);
            }
        }
    });
    
    const months = Array.from(monthsSet).sort().reverse().slice(0, 24);
    
    const currentMonth = state.selectedMonth ?? new Date().getMonth();
    const currentYear = state.selectedYear ?? new Date().getFullYear();
    const currentSelected = `${currentYear}-${currentMonth}`;
    
    return months.map(m => {
        const [year, month] = m.split('-');
        const date = new Date(year, parseInt(month), 1);
        const label = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
        const selected = m === currentSelected ? 'selected' : '';
        return `<option value="${m}" ${selected}>${label.charAt(0).toUpperCase() + label.slice(1)}</option>`;
    }).join('');
};

// Settings Modal - Abre modal de configuración/apoyo.
// Muestra opciones de sincronización con Google Sheets, import/export JSON.
// Incluye dropdown de selección de mes/año si hay transacciones.
// Llama a: SyncService (state.js), getMonthOptions()
window.openSettings = () => {
    const titleEl = document.getElementById('modal-title');
    const contentEl = document.getElementById('modal-content');
    const cancelBtn = document.getElementById('modal-cancel');
    const confirmBtn = document.getElementById('modal-confirm');
    const importBtn = document.getElementById('modal-import');
    const currentUrl = SyncService.getUrl();
    const lastSync = SyncService.getLastSync();
    const hasTransactions = store.getState().transactions.length > 0;
    const monthOptions = getMonthOptions();

    titleEl.textContent = 'Ajustes';
    contentEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            ${hasTransactions ? `
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <label style="font-size: 12px; color: var(--text-secondary);">Ver gráficos del mes</label>
                <select id="selected-month" class="form-select" onchange="handleMonthChange(this.value)">
                    ${monthOptions || '<option value="">Sin datos</option>'}
                </select>
            </div>
            <hr style="border: none; border-top: 1px solid var(--border); width: 100%;">
            ` : ''}
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
            <hr style="border: none; border-top: 1px solid var(--border); width: 100%;">
            <button class="btn btn--secondary" style="width: 100%;" onclick="loadDummyData()">Descargar Datos Dummy</button>
            ${lastSync ? `<div style="font-size: 11px; color: var(--text-secondary); text-align: center;">Última sincronización: ${new Date(lastSync).toLocaleString()}</div>` : ''}
        </div>`;
    cancelBtn.textContent = 'Cerrar';
    cancelBtn.onclick = closeModal;
    confirmBtn.style.display = 'none';
    importBtn.style.display = '';
    document.getElementById('modal-overlay').classList.add('modal-overlay--active');
};

// Maneja cambio de mes/año en dropdown del modal de settings.
// Actualiza selectedMonth/selectedYear en state.
// Cierra modal y dispara evento 'charts:update' para rerenderizar gráficos.
// Llama a: store.setState(), closeModal()
window.handleMonthChange = (value) => {
    if (!value) return;
    const [year, month] = value.split('-');
    const state = store.getState();
    store.setState({
        ...state,
        selectedMonth: parseInt(month),
        selectedYear: parseInt(year)
    });
    closeModal();
    const event = new CustomEvent('charts:update');
    window.dispatchEvent(event);
    render();
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

window.loadDummyData = async () => {
    closeModal();
    showToast('Descargando datos dummy...', 'info');
    try {
        const response = await fetch('js/seed-may2026.json');
        const data = await response.json();
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'seed-may2026.json';
        a.click();
        URL.revokeObjectURL(url);
        
        showToast('Datos dummy descargados', 'success');
    } catch (err) {
        showToast('Error al descargar datos dummy', 'error');
    }
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