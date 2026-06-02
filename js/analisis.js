/**
 * Analisis - Módulo de análisis financiero
 *
 * Este archivo contiene funciones para analizar transacciones financieras
 * y generar insights accionables para el usuario.
 *
 * Genera un párrafo comprehensivo con múltiples métricas y observaciones.
 *
 * Funciones llamadas:
 *   - formatCurrency() => js/utils.js, formatea números a moneda
 *   - store.getState() => js/state.js, obtiene transacciones
 *
 * Archivo requerido por: js/views.js (renderHomeView)
 */

/**
 * Genera un párrafo de análisis financiero completo para el mes seleccionado.
 * Incluye múltiples métricas: balance, categorías, horarios, días, tendencias.
 *
 * Parámetros:
 *   - transactions (array): transacciones del mes filtradas
 *   - selectedMonth (number): mes seleccionado (0-11)
 *   - selectedYear (number): año seleccionado
 *
 * Retorna: string HTML con el párrafo de análisis
 */
const generarAnalisisCompleto = (transactions, selectedMonth, selectedYear) => {
    if (!transactions || transactions.length === 0) {
        return `
            <div class="card analisis-card">
                <h3 class="analisis-card__title">📊 Análisis Financiero</h3>
                <p class="analisis-card__text">
                    No hay suficientes datos para generar un análisis este mes. 
                    Agrega transacciones para recibir insights personalizados sobre tus hábitos financieros.
                </p>
            </div>
        `;
    }

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // =====================
    // CÁLCULOS DE MÉTRICAS
    // =====================

    // Totales básicos
    const totalIngresos = transactions
        .filter(t => t.tipo === 'Ingreso')
        .reduce((sum, t) => sum + t.monto, 0);
    
    const totalGastos = transactions
        .filter(t => t.tipo === 'Gasto')
        .reduce((sum, t) => sum + t.monto, 0);
    
    const balance = totalIngresos - totalGastos;
    const totalTransacciones = transactions.length;
    
    // Porcentaje de ahorro
    const porcentajeAhorro = totalIngresos > 0 ? ((balance / totalIngresos) * 100) : 0;
    
    // Días del mes y días con actividad
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    
    // Gastos por categoría
    const gastosPorCategoria = {};
    transactions.filter(t => t.tipo === 'Gasto').forEach(t => {
        const cat = t.categoria?.nombre || 'Otros';
        if (!gastosPorCategoria[cat]) gastosPorCategoria[cat] = 0;
        gastosPorCategoria[cat] += t.monto;
    });
    
    // Ordenar categorías por monto
    const categoriasOrdenadas = Object.entries(gastosPorCategoria)
        .sort((a, b) => b[1] - a[1]);
    
    // Gastos por día del mes
    const gastosPorDia = {};
    const gastosPorDiaSemana = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const transaccionesPorDia = {};
    
    transactions.filter(t => t.tipo === 'Gasto').forEach(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        const dayOfMonth = d.getDate();
        const dayOfWeek = d.getDay();
        
        gastosPorDia[dayOfMonth] = (gastosPorDia[dayOfMonth] || 0) + t.monto;
        gastosPorDiaSemana[dayOfWeek] = (gastosPorDiaSemana[dayOfWeek] || 0) + t.monto;
        transaccionesPorDia[dayOfMonth] = (transaccionesPorDia[dayOfMonth] || 0) + 1;
    });
    
    // Días sin movimientos
    const diasConGastos = Object.keys(gastosPorDia).length;
    const diasSinMovimientos = daysInMonth - diasConGastos;
    
    // Día de mayor gasto
    const diaMayorGasto = Object.entries(gastosPorDia)
        .sort((a, b) => b[1] - a[1])[0];
    
    // Día de semana con mayor gasto
    const diaSemanaMayorGastoIdx = Object.entries(gastosPorDiaSemana)
        .sort((a, b) => b[1] - a[1])[0];
    const diaSemanaMayorGasto = weekDays[parseInt(diaSemanaMayorGastoIdx[0])];
    
    // Horarios (franjas de 4 horas)
    const gastosPorFranja = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const franjaLabels = ['00:00-04:00', '04:00-08:00', '08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-24:00'];
    
    transactions.filter(t => t.tipo === 'Gasto').forEach(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T00:00');
        const hour = d.getHours();
        let franjaindex;
        if (hour >= 0 && hour < 4) franjaindex = 0;
        else if (hour >= 4 && hour < 8) franjaindex = 1;
        else if (hour >= 8 && hour < 12) franjaindex = 2;
        else if (hour >= 12 && hour < 16) franjaindex = 3;
        else if (hour >= 16 && hour < 20) franjaindex = 4;
        else franjaindex = 5;
        gastosPorFranja[franjaindex] += t.monto;
    });
    
    // Franaja horaria con más gasto
    const franjaMayorGastoIdx = Object.entries(gastosPorFranja)
        .sort((a, b) => b[1] - a[1])[0];
    const franjaMayorGasto = franjaLabels[parseInt(franjaMayorGastoIdx[0])];
    
    // Transacción más alta
    const transaccionMasAlta = transactions
        .filter(t => t.tipo === 'Gasto')
        .sort((a, b) => b.monto - a.monto)[0];
    
    // Transacción más baja
    const transaccionMasBaja = transactions
        .filter(t => t.tipo === 'Gasto')
        .sort((a, b) => a.monto - b.monto)[0];
    
    // Promedio diario de gasto
    const promedioDiario = diasConGastos > 0 ? totalGastos / diasConGastos : 0;
    
    // Promedio por día de la semana
    const diasConGastoEnSemana = Object.entries(gastosPorDiaSemana)
        .filter(([k, v]) => v > 0).length;
    
    // Primer y último gasto
    const sortedByDate = [...transactions].sort((a, b) => 
        new Date(a.fecha) - new Date(b.fecha)
    );
    const primerGasto = sortedByDate.find(t => t.tipo === 'Gasto');
    const ultimoGasto = [...sortedByDate].reverse().find(t => t.tipo === 'Gasto');
    
    // Fin de semana vs días laborables
    const gastosFinSemana = (gastosPorDiaSemana[0] || 0) + (gastosPorDiaSemana[6] || 0);
    const gastosLaborables = totalGastos - gastosFinSemana;
    const pctFinSemana = totalGastos > 0 ? (gastosFinSemana / totalGastos * 100) : 0;
    
    // Top 3 categorías
    const top3Categorias = categoriasOrdenadas.slice(0, 3);
    
    // Número de categorías usadas
    const numCategoriasUsadas = Object.keys(gastosPorCategoria).length;
    
    // Promedio por transacción
    const numTransaccionesGasto = transactions.filter(t => t.tipo === 'Gasto').length;
    const promedioPorTransaccion = numTransaccionesGasto > 0 ? totalGastos / numTransaccionesGasto : 0;
    
    // Días de mayor gasto (top 3)
    const topDiasGasto = Object.entries(gastosPorDia)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([dia]) => parseInt(dia));
    
    // Ingresos por categoría
    const ingresosPorCategoria = {};
    transactions.filter(t => t.tipo === 'Ingreso').forEach(t => {
        const cat = t.categoria?.nombre || 'Otros';
        if (!ingresosPorCategoria[cat]) ingresosPorCategoria[cat] = 0;
        ingresosPorCategoria[cat] += t.monto;
    });
    
    // =====================
    // CONSTRUCCIÓN DEL PÁRRAFO
    // =====================
    
    let analisis = '';
    
    // Título del análisis
    analisis += `<strong>📊 Análisis Financiero de ${monthNames[selectedMonth]} ${selectedYear}</strong><br><br>`;
    
    // Resumen general
    analisis += `Durante este mes registraste un total de <strong>${totalTransacciones} movimientos financieros</strong>, `;
    analisis += `consistentes en <strong>${numTransaccionesGasto} gastos</strong> y <strong>${totalTransacciones - numTransaccionesGasto} ingresos</strong>. `;
    analisis += `El volumen total de dinero manejado fue de <strong>${formatCurrency(totalIngresos + totalGastos)}</strong>, `;
    analisis += `de los cuales <strong>${formatCurrency(totalIngresos)}</strong> correspondieron a ingresos y <strong>${formatCurrency(totalGastos)}</strong> a gastos. `;
    
    // Balance y ahorro
    if (balance >= 0) {
        analisis += `Tu balance es <strong>positivo de ${formatCurrency(balance)}</strong>, `;
        if (porcentajeAhorro > 0) {
            analisis += `lo que representa un <strong>${porcentajeAhorro.toFixed(1)}% de ahorro</strong> respecto a tus ingresos. `;
        }
    } else {
        analisis += `Tu balance es <strong>negativo de ${formatCurrency(Math.abs(balance))}</strong>, `;
        analisis += `es decir, gastaste <strong>${Math.abs(porcentajeAhorro).toFixed(1)}%</strong> más de lo que ganaste. `;
    }
    
    // Distribución semanal - solo mostrar si hay gastos
    if (totalGastos > 0) {
        // Encontrar día de mayor gasto
        const diaSemanaConGastos = Object.entries(gastosPorDiaSemana).filter(([k, v]) => v > 0);
        const diaMayorGastoSemana = diaSemanaConGastos.length > 0 
            ? [...diaSemanaConGastos].sort((a, b) => b[1] - a[1])[0] 
            : null;
        
        if (diaMayorGastoSemana) {
            const diaIdx = parseInt(diaMayorGastoSemana[0]);
            const diaNombre = weekDays[diaIdx];
            const gastoDiaMayor = diaMayorGastoSemana[1];
            
            analisis += `<br><br><strong>📅 Patrón semanal:</strong> `;
            
            if (gastosFinSemana > 0 && pctFinSemana > 0) {
                analisis += `Los fines de semana (sábado y domingo) representan el <strong>${pctFinSemana.toFixed(1)}%</strong> de tus gastos totales, `;
                analisis += `con un acumulado de <strong>${formatCurrency(gastosFinSemana)}</strong>. `;
            } else {
                analisis += `Los gastos durante fines de semana fueron mínimos o inexistentes. `;
            }
            
            analisis += `El día de la semana con mayor gasto fue <strong>${diaNombre}</strong> con <strong>${formatCurrency(gastoDiaMayor)}</strong>. `;
            
            // Encontrar segundo mejor día (para contraste)
            if (diaSemanaConGastos.length > 1) {
                const segundoDia = [...diaSemanaConGastos].sort((a, b) => b[1] - a[1])[1];
                const diaIdx2 = parseInt(segundoDia[0]);
                const diaNombre2 = weekDays[diaIdx2];
                analisis += `Le sigue <strong>${diaNombre2}</strong> con <strong>${formatCurrency(segundoDia[1])}</strong>. `;
            }
            
            // Comparar laborables vs fin de semana
            if (gastosLaborables > 0) {
                const pctLaborables = 100 - pctFinSemana;
                analisis += `Los días laborables (lunes a viernes) acumulan el <strong>${pctLaborables.toFixed(1)}%</strong> de tus gastos (<strong>${formatCurrency(gastosLaborables)}</strong>). `;
            }
        }
    }
    
    // Top categorías de gasto - solo mostrar si hay gastos
    if (top3Categorias.length > 0 && totalGastos > 0) {
        analisis += `<br><br><strong>🏷️ Top categorías de gasto:</strong> `;
        top3Categorias.forEach(([cat, monto], idx) => {
            const pctCat = totalGastos > 0 ? (monto / totalGastos * 100) : 0;
            const emoji = transactions.find(t => t.categoria?.nombre === cat)?.categoria?.icono || '📦';
            analisis += `${emoji} <strong>${cat}</strong> con <strong>${formatCurrency(monto)}</strong> (${pctCat.toFixed(1)}%)`;
            if (idx < top3Categorias.length - 1) analisis += ', ';
        });
        analisis += `. En total utilizaste <strong>${numCategoriasUsadas} categorías</strong> diferentes para clasificar tus gastos. `;
    }
    
    // Horario pico - solo mostrar si hay gastos
    const franjaConGastos = Object.entries(gastosPorFranja).filter(([k, v]) => v > 0);
    if (franjaConGastos.length > 0) {
        const mayorFranja = [...franjaConGastos].sort((a, b) => b[1] - a[1])[0];
        analisis += `<br><br><strong>⏰ Horario de mayor actividad:</strong> `;
        analisis += `El rango <strong>${franjaLabels[parseInt(mayorFranja[0])]}</strong> es cuando realizas el mayor gasto, `;
        analisis += `acumulando <strong>${formatCurrency(mayorFranja[1])}</strong>. `;
        
        // Mencionar horarios con pocos gastos
        const franjasBajas = franjaConGastos.filter(([k, v]) => v > 0 && v < mayorFranja[1] * 0.2);
        if (franjasBajas.length > 0) {
            analisis += `Tus horarios de menor gasto son <strong>${franjasBajas.map(f => franjaLabels[parseInt(f[0])]).join(', ')}</strong>. `;
        }
    }
    
    // Transacción más alta - solo mostrar si existe
    if (transaccionMasAlta && transaccionMasAlta.monto > 0) {
        analisis += `<br><br><strong>💰 Transacción más alta:</strong> `;
        analisis += `Fuiste de <strong>${formatCurrency(transaccionMasAlta.monto)}</strong> en <strong>${transaccionMasAlta.categoria?.nombre || 'Categoría no especificada'}</strong>`;
        if (transaccionMasAlta.descripcion) {
            analisis += ` (${transaccionMasAlta.descripcion})`;
        }
        analisis += `. `;
    }
    
    // Transacción más baja - solo mostrar si existe y es diferente
    if (transaccionMasBaja && transaccionMasBaja.monto > 0 && transaccionMasBaja.monto !== transaccionMasAlta?.monto) {
        analisis += `Tu gasto más pequeño fue de <strong>${formatCurrency(transaccionMasBaja.monto)}</strong> en <strong>${transaccionMasBaja.categoria?.nombre || 'Categoría no especificada'}</strong>. `;
    }
    
    // Promedio diario - solo mostrar si hay gastos
    if (totalGastos > 0 && diasConGastos > 0) {
        analisis += `<br><br><strong>📈 Comportamiento diario:</strong> `;
        analisis += `De los <strong>${daysInMonth} días</strong> del mes, tuviste <strong>${diasConGastos} días con movimientos</strong> `;
        analisis += `y <strong>${diasSinMovimientos} días sin actividad financiera</strong>. `;
        analisis += `Tu promedio de gasto por día activo fue de <strong>${formatCurrency(promedioDiario)}</strong>. `;
    }
    
    // Días de mayor gasto - solo mostrar si hay datos
    if (topDiasGasto.length > 0 && totalGastos > 0) {
        analisis += `Los días <strong>${topDiasGasto.join(', ')}</strong> fueron los de mayor gasto. `;
    }
    
    // Promedio por transacción
    if (numTransaccionesGasto > 0 && totalGastos > 0) {
        analisis += `En promedio, cada transacción de gasto fue de <strong>${formatCurrency(promedioPorTransaccion)}</strong>. `;
    }

    // Primer y último gasto
    if (primerGasto && ultimoGasto) {
        const primerFecha = new Date(primerGasto.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        const ultimoFecha = new Date(ultimoGasto.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        analisis += `<br><br><strong>📆 Rango de actividad:</strong> `;
        analisis += `Tu primer gasto registrado fue el <strong>${primerFecha}</strong> `;
        analisis += `y el último el <strong>${ultimoFecha}</strong>. `;
    }
    
    // Ingresos principales
    if (Object.keys(ingresosPorCategoria).length > 0) {
        const topIngreso = Object.entries(ingresosPorCategoria).sort((a, b) => b[1] - a[1])[0];
        analisis += `<br><br><strong>💼 Fuente principal de ingresos:</strong> `;
        analisis += `<strong>${topIngreso[0]}</strong> con <strong>${formatCurrency(topIngreso[1])}</strong>. `;
    }
    
    // Ratio gastos/ingresos por categoría
    if (Object.keys(gastosPorCategoria).length > 0 && totalIngresos > 0) {
        const gastosFijos = (gastosPorCategoria['Servicios'] || 0) + (gastosPorCategoria['Suscripciones'] || 0) + (gastosPorCategoria['Banca'] || 0);
        if (gastosFijos > 0) {
            const pctGastosFijos = (gastosFijos / totalIngresos * 100);
            analisis += `Los gastos fijos (Servicios, Suscripciones, Banca) representan el <strong>${pctGastosFijos.toFixed(1)}%</strong> de tus ingresos. `;
        }
    }
    
    // Recomendación basada en patrones
    analisis += `<br><br><strong>💡 Observación:</strong> `;
    if (pctFinSemana > 50) {
        analisis += `Considera revisar tus gastos de fin de semana, ya que representan más de la mitad de tu spending. `;
    } else if (pctFinSemana > 35) {
        analisis += `Los fines de semana tienen un peso significativo en tus finanzas. `;
    }
    
    if (diasSinMovimientos > 15) {
        analisis += `Hay <strong>${diasSinMovimientos} días</strong> sin movimientos registrados, podrías aprovechar para ahorrar más. `;
    }
    
    if (porcentajeAhorro < 10 && totalIngresos > 0) {
        analisis += `Tu tasa de ahorro es baja (<strong>${porcentajeAhorro.toFixed(1)}%</strong>), considera reducir gastos en categorías no esenciales. `;
    } else if (porcentajeAhorro > 30) {
        analisis += `¡Excelente! Estás ahorrando más del <strong>30%</strong> de tus ingresos. `;
    }
    
    // Comparación con categorías de ingreso (gastos como % del ingreso)
    if (totalIngresos > 0) {
        const pctGastosTotal = (totalGastos / totalIngresos * 100);
        if (pctGastosTotal < 70) {
            analisis += `<br><br><strong>✅ Saludable:</strong> Estás usando el <strong>${pctGastosTotal.toFixed(1)}%</strong> de tus ingresos en gastos, lo cual deja espacio para ahorro. `;
        } else if (pctGastosTotal < 90) {
            analisis += `<br><br><strong>⚡ Precaución:</strong> Estás usando el <strong>${pctGastosTotal.toFixed(1)}%</strong> de tus ingresos en gastos. `;
        }
    }
    
    // =====================
    // ANÁLISIS DE BOXPLOT (Distribución semanal)
    // =====================
    
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
    
    const calculateStats = (arr) => {
        if (!arr.length) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, avg: 0, std: 0 };
        const sorted = [...arr].sort((a, b) => a - b);
        const n = sorted.length;
        if (n === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, avg: 0, std: 0 };
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
    
    const weekRanges = getMonthWeekRanges(selectedYear, selectedMonth);
    const semanas = {};
    weekRanges.forEach(w => { semanas[w.week] = []; });
    
    transactions.filter(t => t.tipo === 'Gasto').forEach(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        const day = d.getDate();
        const week = weekRanges.find(w => day >= w.start && day <= w.end);
        if (week) semanas[week.week].push(t.monto);
    });
    
    const statsPorSemana = weekRanges.map(w => ({
        label: w.label,
        stats: calculateStats(semanas[w.week])
    })).filter(s => s.stats.avg > 0);
    
    if (statsPorSemana.length > 0) {
        // Semana con mayor y menor gasto promedio
        const semanaMayorPromedio = [...statsPorSemana].sort((a, b) => b.stats.avg - a.stats.avg)[0];
        const semanaMenorPromedio = [...statsPorSemana].sort((a, b) => a.stats.avg - b.stats.avg)[0];
        
        // Semana más consistente (menor std)
        const semanaMasConsistente = [...statsPorSemana].sort((a, b) => a.stats.std - b.stats.std)[0];
        
        // Semana más variable (mayor std)
        const semanaMasVariable = [...statsPorSemana].sort((a, b) => b.stats.std - a.stats.std)[0];
        
        // Mediana general de todas las semanas
        const todasLasMedianas = statsPorSemana.map(s => s.stats.median);
        const medianaGeneral = todasLasMedianas.sort((a, b) => a - b)[Math.floor(todasLasMedianas.length / 2)];
        
        // Semana con mediana más alta
        const semanaMayorMediana = [...statsPorSemana].sort((a, b) => b.stats.median - a.stats.median)[0];
        
        // Calcular coef de variación promedio
        const coefsVariacion = statsPorSemana.map(s => s.stats.std / s.stats.avg).filter(c => !isNaN(c) && isFinite(c));
        const coefVariacionPromedio = coefsVariacion.length > 0 ? coefsVariacion.reduce((a, b) => a + b, 0) / coefsVariacion.length : 0;
        
        analisis += `<br><br><strong>📊 Análisis de Distribución Semanal:</strong> `;
        analisis += `Durante el mes se identificaron <strong>${statsPorSemana.length} semanas</strong> con actividad de gastos. `;
        
        analisis += `La semana con mayor gasto promedio fue <strong>${semanaMayorPromedio.label}</strong> con un promedio de <strong>${formatCurrency(semanaMayorPromedio.stats.avg)}</strong>`;
        if (semanaMayorPromedio.stats.std > 0) {
            analisis += ` (desviación estándar: ${formatCurrency(semanaMayorPromedio.stats.std)}, coef. de variación: ${(semanaMayorPromedio.stats.std / semanaMayorPromedio.stats.avg * 100).toFixed(0)}%)`;
        }
        analisis += `. `;
        
        analisis += `Por otro lado, <strong>${semanaMenorPromedio.label}</strong> fue la semana con menor promedio de gasto (<strong>${formatCurrency(semanaMenorPromedio.stats.avg)}</strong>`;
        if (semanaMenorPromedio.stats.std > 0) {
            analisis += `, desviación: ${formatCurrency(semanaMenorPromedio.stats.std)}`;
        }
        analisis += `). `;
        
        analisis += `<br><br>La mediana general de gastos semanales es de <strong>${formatCurrency(medianaGeneral)}</strong>, lo que significa que la mitad de las semanas tuvo gastos superiores a este monto. `;
        
        if (semanaMayorMediana.label !== semanaMayorPromedio.label) {
            analisis += `La semana <strong>${semanaMayorMediana.label}</strong> tuvo la mediana más alta (<strong>${formatCurrency(semanaMayorMediana.stats.median)}</strong>), indicando gastos más consistentes alrededor del valor central. `;
        }
        
        analisis += `<br><br><strong>📈 Consistencia de gastos:</strong> `;
        if (coefVariacionPromedio < 0.3) {
            analisis += `Tu coef. de variación promedio es de <strong>${(coefVariacionPromedio * 100).toFixed(0)}%</strong>, lo que indica que tus gastos semanales son <strong>bastante consistentes</strong> y predecibles. `;
        } else if (coefVariacionPromedio < 0.6) {
            analisis += `Tu coef. de variación promedio es de <strong>${(coefVariacionPromedio * 100).toFixed(0)}%</strong>, indicando una <strong>variabilidad moderada</strong> entre semanas. `;
        } else {
            analisis += `Tu coef. de variación promedio es de <strong>${(coefVariacionPromedio * 100).toFixed(0)}%</strong>, lo que sugiere <strong>alta variabilidad</strong> en tus gastos semanales. Considera establecer un presupuesto semanal para regularizar tus gastos. `;
        }
        
        if (semanaMasConsistente.stats.std < semanaMasVariable.stats.std && semanaMasConsistente.stats.avg > 0) {
            analisis += `La semana <strong>${semanaMasConsistente.label}</strong> fue la más consistente en gastos, mientras que <strong>${semanaMasVariable.label}</strong> mostró mayor variabilidad. `;
        }
        
        // Rango intercuartil (IQR) analysis
        const iqrs = statsPorSemana.map(s => s.stats.q3 - s.stats.q1).filter(v => v > 0);
        let iqrPromedio = 0;
        if (iqrs.length > 0) {
            iqrPromedio = iqrs.reduce((a, b) => a + b, 0) / iqrs.length;
            analisis += `<br><br><strong>📉 Variabilidad semanal:</strong> `;
            analisis += `En una semana típica, la diferencia entre tus gastos más altos y más bajos fue de <strong>${formatCurrency(iqrPromedio)}</strong>. `;
            if (iqrPromedio < promedioDiario * 3) {
                analisis += `Esto significa que tus gastos se mantienen fairly constantes, lo cual facilita la planificación. `;
            } else {
                analisis += `Hay semanas donde tus gastos variaron considerablemente, lo que podría indicar gastos irregulares. `;
            }
        }
        
        // Boxes (cuartiles) analysis
        const semanaMayorIQR = [...statsPorSemana].filter(s => s.stats.q3 - s.stats.q1 > 0).sort((a, b) => (b.stats.q3 - b.stats.q1) - (a.stats.q3 - a.stats.q1))[0];
        if (semanaMayorIQR) {
            analisis += `<br><br><strong>📦 Análisis de Cuartiles:</strong> `;
            analisis += `La semana <strong>${semanaMayorIQR.label}</strong> tuvo el mayor rango intercuartil `;
            analisis += `(Q1: ${formatCurrency(semanaMayorIQR.stats.q1)}, Mediana: ${formatCurrency(semanaMayorIQR.stats.median)}, Q3: ${formatCurrency(semanaMayorIQR.stats.q3)}). `;
            analisis += `Esto sugiere que hubo días tanto de muy bajo como de muy alto gasto esa semana. `;
        }
        
        // Recomendaciones basadas en boxplot
        let tieneRecomendaciones = false;
        let recomendacionesTexto = '';
        
        if (semanaMayorPromedio.stats.avg > promedioDiario * 7 * 0.4) {
            recomendacionesTexto += `La semana <strong>${semanaMayorPromedio.label}</strong> supera significativamente tu promedio diario, considera revisar qué gastos especiales tuviste esos días. `;
            tieneRecomendaciones = true;
        }
        
        if (coefVariacionPromedio > 0.5) {
            recomendacionesTexto += `Tu alta variabilidad semanal sugiere que sería beneficial establecer un <strong>presupuesto semanal fijo</strong> para regularizar tus gastos. `;
            tieneRecomendaciones = true;
        }
        
        if (iqrs.length > 0 && iqrPromedio > 0) {
            const semanasConIQRGrande = statsPorSemana.filter(s => (s.stats.q3 - s.stats.q1) > iqrPromedio * 1.5).length;
            if (semanasConIQRGrande > 1) {
                recomendacionesTexto += `Hay <strong>${semanasConIQRGrande} semanas</strong> con alta dispersión de gastos, lo que podría indicar gastos irregulares. `;
                tieneRecomendaciones = true;
            }
        }
        
        const semanasEstables = statsPorSemana.filter(s => s.stats.std / s.stats.avg < 0.3).length;
        if (semanasEstables > statsPorSemana.length / 2) {
            recomendacionesTexto += `Más de la mitad de tus semanas (<strong>${semanasEstables}</strong>) muestran gastos consistentes, lo cual es excelente para la planificación. `;
            tieneRecomendaciones = true;
        }
        
        if (tieneRecomendaciones) {
            analisis += `<br><br><strong>💡 Recomendaciones basadas en distribución semanal:</strong> ${recomendacionesTexto}`;
        }
    }
    
return `
        <h2 style="margin-top: 32px; margin-bottom: 16px; font-size: 20px;">Analisis Financiero</h2>
        <div class="card analisis-card">
            <p class="analisis-card__text">${analisis}</p>
        </div>
    `;
};