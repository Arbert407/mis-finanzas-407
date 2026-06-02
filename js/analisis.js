/**
 * Analisis - Módulo de análisis financiero
 *
 * Este archivo contiene funciones para analizar transacciones financieras
 * y generar insights accionables para el usuario.
 *
 * Genera párrafos comprehensivos con múltiples métricas y observaciones
 * adaptadas para que cualquier persona pueda entenderlas.
 *
 * Funciones llamadas:
 *   - formatCurrency() => js/utils.js, formatea números a moneda
 *   - store.getState() => js/state.js, obtiene transacciones
 *
 * Archivo requerido por: js/views.js (renderHomeView)
 */

/**
 * Selecciona una variante aleatoria de un array de textos.
 * Esto evita que el análisis se sienta repetitivo.
 *
 * @param {string[]} textos - Array de variantes de texto
 * @returns {string} Texto seleccionado aleatoriamente
 */
const seleccionarVariante = (textos) => {
    return textos[Math.floor(Math.random() * textos.length)];
};

/**
 * Genera un mensaje de balance positivo con variaciones.
 *
 * @param {number} balance - Monto del balance
 * @param {number} porcentajeAhorro - Porcentaje de ahorro
 * @returns {string} Mensaje formateado
 */
const generarMensajeBalancePositivo = (balance, porcentajeAhorro) => {
    const variants = [
        `¡Buenas noticias! Tu balance es positivo de <strong>${formatCurrency(balance)}</strong>.`,
        `Llegaste al final del mes con un superavit de <strong>${formatCurrency(balance)}</strong>.`,
        `Este mes terminaste <strong>${formatCurrency(balance)}</strong> arriba de donde empezaste.`,
        `Tu cuenta refleja un resultado favorable: ganaste <strong>${formatCurrency(balance)}</strong> más de lo que gastaste.`
    ];
    let msg = seleccionarVariante(variants);
    if (porcentajeAhorro > 0) {
        const pctVariants = [
            `Esto representa un <strong>${porcentajeAhorro.toFixed(1)}%</strong> de ahorro respecto a tus ingresos.`,
            `Has logrado guardar el <strong>${porcentajeAhorro.toFixed(1)}%</strong> de lo que ganaste.`,
            `Esa cantidad equivale al <strong>${porcentajeAhorro.toFixed(1)}%</strong> de tus ingresos totales.`,
            `Tu tasa de ahorro llega al <strong>${porcentajeAhorro.toFixed(1)}%</strong>, lo cual es un buen indicador.`
        ];
        msg += ' ' + seleccionarVariante(pctVariants);
    }
    return msg;
};

/**
 * Genera un mensaje de balance negativo con variaciones.
 *
 * @param {number} balance - Monto del balance (ya negativo)
 * @param {number} porcentajeAhorro - Porcentaje excedente
 * @returns {string} Mensaje formateado
 */
const generarMensajeBalanceNegativo = (balance, porcentajeAhorro) => {
    const variants = [
        `Tu balance es <strong>negativo de ${formatCurrency(Math.abs(balance))}</strong>.`,
        `Terminaste el mes <strong>${formatCurrency(Math.abs(balance))}</strong> por debajo de tus ingresos.`,
        `Este mes gastaste más de lo que ganaste: un déficit de <strong>${formatCurrency(Math.abs(balance))}</strong>.`,
        `Tu resultado final es un rojo de <strong>${formatCurrency(Math.abs(balance))}</strong>.`
    ];
    let msg = seleccionarVariante(variants);
    const pctVariants = [
        `En otras palabras, gastaste <strong>${Math.abs(porcentajeAhorro).toFixed(1)}%</strong> más de lo que ingresaste.`,
        `Usaste <strong>${Math.abs(porcentajeAhorro).toFixed(1)}%</strong> más de lo que ganaste este mes.`,
        `Este mes tu tasa de ahorro fue negativa: <strong>${Math.abs(porcentajeAhorro).toFixed(1)}%</strong> sobre tus gastos.`
    ];
    msg += ' ' + seleccionarVariante(pctVariants);
    return msg;
};

/**
 * Genera una observación sobre el porcentaje de gastos fijos.
 *
 * @param {number} pctGastosFijos - Porcentaje de gastos fijos
 * @param {number} totalIngresos - Total de ingresos
 * @param {number} gastosFijos - Monto de gastos fijos
 * @returns {string|null} Mensaje o null si no aplica
 */
const generarObservacionGastosFijos = (pctGastosFijos, totalIngresos, gastosFijos) => {
    if (pctGastosFijos > 50) {
        return `Más de la mitad de tus ingresos (<strong>${pctGastosFijos.toFixed(1)}%</strong>) se fueron a gastos fijos como servicios y suscripciones. Esto deja poco margen para otros gastos o ahorro.`;
    } else if (pctGastosFijos > 35) {
        return `Los gastos fijos representan un <strong>${pctGastosFijos.toFixed(1)}%</strong> de tus ingresos (<strong>${formatCurrency(gastosFijos)}</strong>). Es una proporción considerable pero manejable.`;
    } else if (pctGastosFijos > 20) {
        return `Tus gastos fijos son el <strong>${pctGastosFijos.toFixed(1)}%</strong> de tus ingresos, lo cual es saludable y te da flexibilidad para otros conceptos.`;
    } else if (pctGastosFijos > 0) {
        return `Tienes pocos gastos fijos (<strong>${pctGastosFijos.toFixed(1)}%</strong>), lo que te da mucha libertad financiera.`;
    }
    return null;
};

/**
 * Genera comentario sobre el ratio gastos/ingresos.
 *
 * @param {number} pctGastosTotal - Porcentaje de gastos respecto a ingresos
 * @returns {string} Mensaje formateado
 */
const generarComentarioRatioGastos = (pctGastosTotal) => {
    if (pctGastosTotal < 50) {
        const variants = [
            `Estás usando solo el <strong>${pctGastosTotal.toFixed(1)}%</strong> de tus ingresos en gastos. ¡Excelente control financiero!`,
            `Solo el <strong>${pctGastosTotal.toFixed(1)}%</strong> de lo que ganaste se fue en gastos. Estás en muy buena posición.`,
            ` Destinas el <strong>${pctGastosTotal.toFixed(1)}%</strong> de tus ingresos a gastos, lo cual deja espacio considerable para el ahorro.`
        ];
        return seleccionarVariante(variants);
    } else if (pctGastosTotal < 70) {
        const variants = [
            `Estás usando el <strong>${pctGastosTotal.toFixed(1)}%</strong> de tus ingresos en gastos, lo cual es un rango saludable.`,
            `El <strong>${pctGastosTotal.toFixed(1)}%</strong> de tus ingresos se fue en gastos. Todavía hay margen para mejorar.`,
            `Gastas el <strong>${pctGastosTotal.toFixed(1)}%</strong> de lo que ganas, un nivel moderado que podrías optimizar.`
        ];
        return seleccionarVariante(variants);
    } else if (pctGastosTotal < 85) {
        const variants = [
            `Estás invirtiendo el <strong>${pctGastosTotal.toFixed(1)}%</strong> de tus ingresos en gastos. Considera revisar gastos discrecionales.`,
            `El <strong>${pctGastosTotal.toFixed(1)}%</strong> de tus ingresos se fue en gastos. Hay categorías que podrías reducir.`,
            `Gastas el <strong>${pctGastosTotal.toFixed(1)}%</strong> de lo que ganas. Analiza qué gastos podrías recortaría.`
        ];
        return seleccionarVariante(variants);
    } else if (pctGastosTotal < 100) {
        const variants = [
            `Estás usando el <strong>${pctGastosTotal.toFixed(1)}%</strong> de tus ingresos en gastos. Estás muy cerca del límite.`,
            `Casi todo lo que ganas (<strong>${pctGastosTotal.toFixed(1)}%</strong>) se va en gastos. Necesitas ajustar urgentemente.`,
            `El <strong>${pctGastosTotal.toFixed(1)}%</strong> de tus ingresos se fue en gastos. Te queda muy poco margen.`
        ];
        return seleccionarVariante(variants);
    } else {
        const variants = [
            `Gastaste más de lo que ganaste (<strong>${pctGastosTotal.toFixed(1)}%</strong>). Este mes hubo un desequilibrio importante.`,
            `Usaste el <strong>${pctGastosTotal.toFixed(1)}%</strong> de tus ingresos en gastos. Superaste tus ingresos este mes.`,
            `El <strong>${pctGastosTotal.toFixed(1)}%</strong> de tus ingresos se fue en gastos. Hay un déficit que necesitarás compensar.`
        ];
        return seleccionarVariante(variants);
    }
};

/**
 * Genera una evaluación de la tasa de ahorro con variaciones.
 *
 * @param {number} porcentajeAhorro - Porcentaje de ahorro
 * @param {number} totalIngresos - Total de ingresos
 * @returns {string|null} Mensaje o null si no aplica
 */
const evaluarTasaAhorro = (porcentajeAhorro, totalIngresos) => {
    if (totalIngresos === 0) return null;

    if (porcentajeAhorro < 0) {
        const variants = [
            `Tu tasa de ahorro es negativa, lo que significa que estás gastando más de lo que ganas. Es importante revisar tus gastos.`,
            `No lograste ahorrar este mes. Tus gastos superaron tus ingresos.`,
            `Este mes no hubo ahorro posible. Estuviste en números rojos.`
        ];
        return seleccionarVariante(variants);
    } else if (porcentajeAhorro < 5) {
        const variants = [
            `Tu tasa de ahorro es muy baja (<strong>${porcentajeAhorro.toFixed(1)}%</strong>). Considera reducir gastos en categorías no esenciales.`,
            `Solo guardaste el <strong>${porcentajeAhorro.toFixed(1)}%</strong> de tus ingresos. Hay espacio para mejorar tu ahorro.`,
            `Ahorraste apenas el <strong>${porcentajeAhorro.toFixed(1)}%</strong>. Piensa en ways para reducir gastos.`
        ];
        return seleccionarVariante(variants);
    } else if (porcentajeAhorro < 10) {
        const variants = [
            `Tu tasa de ahorro es baja (<strong>${porcentajeAhorro.toFixed(1)}%</strong>). Estás apenas empezando a construir tu reserva.`,
            `Ahorraste solo el <strong>${porcentajeAhorro.toFixed(1)}%</strong> de tus ingresos. Intenta incrementar este porcentaje.`,
            `Guardaste el <strong>${porcentajeAhorro.toFixed(1)}%</strong>. Aún hay oportunidad de mejorar.`
        ];
        return seleccionarVariante(variants);
    } else if (porcentajeAhorro < 20) {
        const variants = [
            `Tu tasa de ahorro del <strong>${porcentajeAhorro.toFixed(1)}%</strong> es un buen comienzo. ¡Sigue así!`,
            `Ahorraste el <strong>${porcentajeAhorro.toFixed(1)}%</strong> de tus ingresos. Es un nivel aceptable.`,
            `Has logrado guardar el <strong>${porcentajeAhorro.toFixed(1)}%</strong>. Continúa construyendo ese hábito.`
        ];
        return seleccionarVariante(variants);
    } else if (porcentajeAhorro < 30) {
        const variants = [
            `¡Muy bien! Estás ahorrando el <strong>${porcentajeAhorro.toFixed(1)}%</strong> de tus ingresos. Estás en el camino correcto.`,
            `Tu tasa de ahorro del <strong>${porcentajeAhorro.toFixed(1)}%</strong> es admirable. Sigue así.`,
            `Ahorraste el <strong>${porcentajeAhorro.toFixed(1)}%</strong>. ¡Excelente disciplina financiera!`
        ];
        return seleccionarVariante(variants);
    } else if (porcentajeAhorro < 50) {
        const variants = [
            `¡Increíble! Estás ahorrando más del <strong>${porcentajeAhorro.toFixed(1)}%</strong> de tus ingresos. Eres un modelo de disciplina.`,
            `Tu tasa de ahorro del <strong>${porcentajeAhorro.toFixed(1)}%</strong> es impresionante. Estás muy ahead.`,
            `Ahorraste el <strong>${porcentajeAhorro.toFixed(1)}%</strong>. ¡Eso es exceptional!`
        ];
        return seleccionarVariante(variants);
    } else {
        const variants = [
            `Estás ahorrando el <strong>${porcentajeAhorro.toFixed(1)}%</strong> de tus ingresos. ¡Asombroso! Pero recuerda vivir también.`,
            `Tu tasa de ahorro del <strong>${porcentajeAhorro.toFixed(1)}%</strong> es extraordinaria. Eres muy disciplinado.`,
            `Ahorraste el <strong>${porcentajeAhorro.toFixed(1)}%</strong>. ¡WOW! Pero no olvides disfrutar tu dinero.`
        ];
        return seleccionarVariante(variants);
    }
};

/**
 * Genera comentario sobre días sin actividad financiera.
 *
 * @param {number} diasSinMovimientos - Días sin movimientos
 * @param {number} daysInMonth - Días totales del mes
 * @returns {string|null} Mensaje o null si no aplica
 */
const generarComentarioDiasInactivos = (diasSinMovimientos, daysInMonth) => {
    if (diasSinMovimientos === 0) {
        return `Tuviste actividad financiera todos los días del mes. ¡Completamente activo!`;
    } else if (diasSinMovimientos < 5) {
        return `Solo <strong>${diasSinMovimientos} días</strong> del mes no tuviste movimientos. ¡Muy buen ritmo!`;
    } else if (diasSinMovimientos < 10) {
        return `Hubo <strong>${diasSinMovimientos} días</strong> sin actividad financiera. Podrías haber aprovechado para ahorrar más esos días.`;
    } else if (diasSinMovimientos < 15) {
        return `<strong>${diasSinMovimientos} días</strong> no tuviste movimientos este mes. Es una buena cantidad de días sin gastos.`;
    } else if (diasSinMovimientos < 20) {
        return `Pasaste <strong>${diasSinMovimientos} días</strong> sin realizar ninguna transacción. Es un buen número de días de descanso financiero.`;
    } else {
        return `<strong>${diasSinMovimientos} días</strong> del mes no tuviste movimientos registrados. Hay mucho potencial de ahorro esos días.`;
    }
};

/**
 * Genera comentario sobre la consistencia de gastos semanales.
 *
 * @param {number} coefVariacionPromedio - Coeficiente de variación promedio
 * @returns {string} Mensaje formateado
 */
const generarComentarioConsistencia = (coefVariacionPromedio) => {
    if (coefVariacionPromedio < 0.15) {
        return `Tu coef. de variación promedio es de <strong>${(coefVariacionPromedio * 100).toFixed(0)}%</strong>, lo que indica que tus gastos semanales son <strong>extremadamente consistentes</strong>. Esto facilita mucho la planificación.`;
    } else if (coefVariacionPromedio < 0.3) {
        return `Tu coef. de variación promedio es de <strong>${(coefVariacionPromedio * 100).toFixed(0)}%</strong>, lo que indica que tus gastos semanales son <strong>bastante estables</strong> y predecibles. ¡Muy bien!`;
    } else if (coefVariacionPromedio < 0.5) {
        return `Tu coef. de variación promedio es de <strong>${(coefVariacionPromedio * 100).toFixed(0)}%</strong>, indicando una <strong>variabilidad moderada</strong> entre semanas. Hay espacio para ser más consistente.`;
    } else if (coefVariacionPromedio < 0.75) {
        return `Tu coef. de variación promedio es de <strong>${(coefVariacionPromedio * 100).toFixed(0)}%</strong>, lo que sugiere <strong>alta variabilidad</strong> en tus gastos semanales. Considera establecer un presupuesto semanal.`;
    } else {
        return `Tu coef. de variación promedio es de <strong>${(coefVariacionPromedio * 100).toFixed(0)}%</strong>, indicando <strong>fluctuaciones muy grandes</strong> entre semanas. Necesitas urgentemente un presupuesto semanal para regularizarte.`;
    }
};

/**
 * Genera observación sobre el patrón de fines de semana.
 *
 * @param {number} pctFinSemana - Porcentaje de gastos en fin de semana
 * @param {number} gastosFinSemana - Monto de gastos en fin de semana
 * @param {number} totalGastos - Total de gastos
 * @returns {string|null} Mensaje o null si no aplica
 */
const generarObservacionFinDeSemana = (pctFinSemana, gastosFinSemana, totalGastos) => {
    if (totalGastos === 0) return null;

    if (pctFinSemana > 60) {
        return `Los fines de semana representan una porción muy alta de tus gastos (<strong>${pctFinSemana.toFixed(1)}%</strong>, unos <strong>${formatCurrency(gastosFinSemana)}</strong>). Este es el principal momento donde se va tu dinero.`;
    } else if (pctFinSemana > 45) {
        return `Casi la mitad de tus gastos (<strong>${pctFinSemana.toFixed(1)}%</strong>) ocurren el fin de semana. Es un patrón importante a considerar.`;
    } else if (pctFinSemana > 30) {
        return `Los fines de semana acumulan el <strong>${pctFinSemana.toFixed(1)}%</strong> de tus gastos. Es un gasto significativo pero no mayoritario.`;
    } else if (pctFinSemana > 15) {
        return `Solo el <strong>${pctFinSemana.toFixed(1)}%</strong> de tus gastos ocurren el fin de semana. Tu comportamiento financiero está enfocado en días laborables.`;
    } else if (pctFinSemana > 5) {
        return `Los fines de semana tienen muy poco peso en tus finanzas (<strong>${pctFinSemana.toFixed(1)}%</strong>). Casi todo tu gasto es entre semana.`;
    } else {
        return `Prácticamente no hay gastos de fin de semana (<strong>${pctFinSemana.toFixed(1)}%</strong>). Tu actividad financiera se concentra entre semana.`;
    }
};

/**
 * Genera observación sobre días de alto gasto.
 *
 * @param {number} diasConGastos - Días con gastos
 * @param {number} promedioDiario - Gasto promedio diario
 * @param {string[]} topDiasGasto - Días con mayor gasto
 * @returns {string|null} Mensaje o null si no aplica
 */
const generarObservacionDiasAltoGasto = (diasConGastos, promedioDiario, topDiasGasto) => {
    if (topDiasGasto.length === 0) return null;

    if (topDiasGasto.length === 1) {
        return `El día <strong>${topDiasGasto[0]}</strong> fue el de mayor gasto. Ese día acumulaste más gastos que cualquier otro.`;
    } else if (topDiasGasto.length === 2) {
        return `Los días <strong>${topDiasGasto[0]}</strong> y <strong>${topDiasGasto[1]}</strong> fueron los de mayor gasto. Estos días concentraron la mayor parte de tus gastos.`;
    } else if (topDiasGasto.length >= 3) {
        const ultimosDias = topDiasGasto.slice(-2);
        return `Los días <strong>${topDiasGasto[0]}</strong>, <strong>${topDiasGasto[1]}</strong> y <strong>${topDiasGasto[2]}</strong> fueron los de mayor gasto. Los días ${ultimosDias.join(' y ')} también merecen atención especial.`;
    }
    return null;
};

/**
 * Genera comentario sobre la categoría principal de gasto.
 *
 * @param {Array} top3Categorias - Top 3 categorías con monto y porcentaje
 * @param {number} numCategoriasUsadas - Número de categorías usadas
 * @param {number} totalGastos - Total de gastos
 * @returns {string|null} Mensaje o null si no aplica
 */
const generarComentarioCategorias = (top3Categorias, numCategoriasUsadas, totalGastos) => {
    if (top3Categorias.length === 0) return null;

    const [cat1, monto1] = top3Categorias[0];
    const pct1 = totalGastos > 0 ? (monto1 / totalGastos * 100) : 0;

    let msg = '';

    if (pct1 > 50) {
        msg += `La categoría <strong>${cat1}</strong> domina tus gastos con un <strong>${pct1.toFixed(1)}%</strong> del total (<strong>${formatCurrency(monto1)}</strong>). `;
    } else if (pct1 > 35) {
        msg += `<strong>${cat1}</strong> es tu mayor categoría de gasto con el <strong>${pct1.toFixed(1)}%</strong> (<strong>${formatCurrency(monto1)}</strong>). `;
    } else {
        msg += `Tu gasto principal fue en <strong>${cat1}</strong> con <strong>${formatCurrency(monto1)}</strong> (${pct1.toFixed(1)}%). `;
    }

    if (top3Categorias.length >= 2) {
        const [cat2, monto2] = top3Categorias[1];
        const pct2 = totalGastos > 0 ? (monto2 / totalGastos * 100) : 0;
        msg += `Le sigue <strong>${cat2}</strong> con el <strong>${pct2.toFixed(1)}%</strong> (<strong>${formatCurrency(monto2)}</strong>). `;
    }

    if (top3Categorias.length >= 3) {
        const [cat3, monto3] = top3Categorias[2];
        const pct3 = totalGastos > 0 ? (monto3 / totalGastos * 100) : 0;
        msg += `En tercer lugar está <strong>${cat3}</strong> con el <strong>${pct3.toFixed(1)}%</strong> (<strong>${formatCurrency(monto3)}</strong>). `;
    }

    if (numCategoriasUsadas === 1) {
        msg += `Usaste solo <strong>1 categoría</strong> para todos tus gastos. Podrías detallar más para mejor análisis.`;
    } else if (numCategoriasUsadas <= 3) {
        msg += `En total utilizaste <strong>${numCategoriasUsadas} categorías</strong>. Podrías beneficiarse de un análisis más detallado.`;
    } else if (numCategoriasUsadas <= 6) {
        msg += `Clasificaste tus gastos en <strong>${numCategoriasUsadas} categorías</strong>, lo cual es un buen nivel de detalle.`;
    } else {
        msg += `Usaste <strong>${numCategoriasUsadas} categorías</strong> diferentes para clasificar tus gastos. ¡Muy detallado!`;
    }

    return msg;
};

/**
 * Genera observación sobre el horario pico de gastos.
 *
 * @param {string} franjaMayorGasto - Franja horaria con más gasto
 * @param {number} montoFranjaMayor - Monto de la franja mayor
 * @param {Array} franjasBajas - Franjas con bajo gasto
 * @returns {string|null} Mensaje o null si no aplica
 */
const generarObservacionHoraria = (franjaMayorGasto, montoFranjaMayor, franjasBajas) => {
    if (!franjaMayorGasto) return null;

    const variants = [
        `El horario <strong>${franjaMayorGasto}</strong> es cuando realizas el mayor gasto, acumulando <strong>${formatCurrency(montoFranjaMayor)}</strong>.`,
        `La mayoría de tus gastos ocurren entre las <strong>${franjaMayorGasto}</strong>, con un total de <strong>${formatCurrency(montoFranjaMayor)}</strong>.`,
        `Tu momento de mayor actividad financiera es entre las <strong>${franjaMayorGasto}</strong>, con <strong>${formatCurrency(montoFranjaMayor)}</strong> en esa franja.`
    ];
    let msg = seleccionarVariante(variants);

    if (franjasBajas.length > 0) {
        const franjasBajasLabels = franjasBajas.map(f => {
            const idx = parseInt(f[0]);
            const labels = ['madrugada (00-04)', 'temprano (04-08)', 'mañana (08-12)', 'mediodía (12-16)', 'tarde (16-20)', 'noche (20-24)'];
            return labels[idx] || `(${f[0]})`;
        });
        msg += `Tus horarios de menor gasto son la <strong>${franjasBajasLabels.join('</strong> y la <strong>')}</strong>.`;
    }

    return msg;
};

/**
 * Genera comentario sobre transacción más alta.
 *
 * @param {Object} transaccionMasAlta - Transacción más alta
 * @returns {string|null} Mensaje o null si no aplica
 */
const generarComentarioGastoAlto = (transaccionMasAlta) => {
    if (!transaccionMasAlta || transaccionMasAlta.monto <= 0) return null;

    const cat = transaccionMasAlta.categoria?.nombre || 'Categoría no especificada';
    const desc = transaccionMasAlta.descripcion ? ` (${transaccionMasAlta.descripcion})` : '';

    const variants = [
        `Tu gasto más grande fue de <strong>${formatCurrency(transaccionMasAlta.monto)}</strong> en <strong>${cat}</strong>${desc}.`,
        `La transacción más elevada del mes fue de <strong>${formatCurrency(transaccionMasAlta.monto)}</strong> en <strong>${cat}</strong>${desc}.`,
        `Un gasto notable fue <strong>${formatCurrency(transaccionMasAlta.monto)}</strong> destinado a <strong>${cat}</strong>${desc}.`
    ];

    return seleccionarVariante(variants);
};

/**
 * Genera comentario sobre transacción más baja.
 *
 * @param {Object} transaccionMasBaja - Transacción más baja
 * @param {Object} transaccionMasAlta - Transacción más alta (para comparar)
 * @returns {string|null} Mensaje o null si no aplica
 */
const generarComentarioGastoBajo = (transaccionMasBaja, transaccionMasAlta) => {
    if (!transaccionMasBaja || transaccionMasBaja.monto <= 0) return null;
    if (transaccionMasAlta && transaccionMasBaja.monto === transaccionMasAlta.monto) return null;

    const cat = transaccionMasBaja.categoria?.nombre || 'Categoría no especificada';

    const variants = [
        `Tu gasto más pequeño fue de <strong>${formatCurrency(transaccionMasBaja.monto)}</strong> en <strong>${cat}</strong>.`,
        `En el otro extremo, tu gasto más bajo fue <strong>${formatCurrency(transaccionMasBaja.monto)}</strong> en <strong>${cat}</strong>.`,
        `El gasto más modesto del mes fue de <strong>${formatCurrency(transaccionMasBaja.monto)}</strong> en <strong>${cat}</strong>.`
    ];

    return seleccionarVariante(variants);
};

/**
 * Genera observación sobre rango de fechas de actividad.
 *
 * @param {Object} primerGasto - Primer gasto
 * @param {Object} ultimoGasto - Último gasto
 * @returns {string|null} Mensaje o null si no aplica
 */
const generarObservacionRangoFechas = (primerGasto, ultimoGasto) => {
    if (!primerGasto || !ultimoGasto) return null;

    const primerFecha = new Date(primerGasto.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const ultimoFecha = new Date(ultimoGasto.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

    if (primerGasto.fecha === ultimoGasto.fecha) {
        return `Solo registraste un día de actividad financiera: el <strong>${primerFecha}</strong>.`;
    }

    const diffDays = Math.ceil((new Date(ultimoGasto.fecha) - new Date(primerGasto.fecha)) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
        return `Tu actividad de este mes se concentró en una ventana de solo <strong>${diffDays} días</strong> (del <strong>${primerFecha}</strong> al <strong>${ultimoFecha}</strong>).`;
    } else if (diffDays <= 15) {
        return `Registraste actividad durante aproximadamente <strong>${diffDays} días</strong>, del <strong>${primerFecha}</strong> al <strong>${ultimoFecha}</strong>.`;
    } else {
        return `Tu actividad financiera abarco desde el <strong>${primerFecha}</strong> hasta el <strong>${ultimoFecha}</strong>, cubriendo prácticamente todo el mes.`;
    }
};

/**
 * Genera observación sobre fuentes de ingreso.
 *
 * @param {Object} ingresosPorCategoria - Ingresos por categoría
 * @param {number} totalIngresos - Total de ingresos
 * @returns {string|null} Mensaje o null si no aplica
 */
const generarObservacionIngresos = (ingresosPorCategoria, totalIngresos) => {
    if (Object.keys(ingresosPorCategoria).length === 0 || totalIngresos === 0) return null;

    const topIngreso = Object.entries(ingresosPorCategoria).sort((a, b) => b[1] - a[1])[0];
    const [catIngreso, montoIngreso] = topIngreso;
    const pctIngreso = (montoIngreso / totalIngresos) * 100;

    if (Object.keys(ingresosPorCategoria).length === 1) {
        return `Tu única fuente de ingresos fue <strong>${catIngreso}</strong> con <strong>${formatCurrency(montoIngreso)}</strong>.`;
    }

    if (pctIngreso > 80) {
        return `Tu ingreso se basa casi completamente en <strong>${catIngreso}</strong> (<strong>${pctIngreso.toFixed(0)}%</strong>, <strong>${formatCurrency(montoIngreso)}</strong>).`;
    } else if (pctIngreso > 50) {
        return `Tu fuente principal de ingresos es <strong>${catIngreso}</strong> con <strong>${formatCurrency(montoIngreso)}</strong> (<strong>${pctIngreso.toFixed(0)}%</strong> del total).`;
    } else {
        return `Tus ingresos principales vienen de <strong>${catIngreso}</strong> (<strong>${formatCurrency(montoIngreso)}</strong>, ${pctIngreso.toFixed(0)}%).`;
    }
};

/**
 * Genera una sección de recomendaciones personalizadas.
 *
 * @param {Object} params - Parámetros de análisis
 * @returns {string|null} Mensaje o null si no hay recomendaciones
 */
const generarSeccionRecomendaciones = ({
    pctFinSemana,
    diasSinMovimientos,
    porcentajeAhorro,
    coefVariacionPromedio,
    totalIngresos,
    numCategoriasUsadas,
    pctGastosFijos,
    semanasEstables,
    statsPorSemana,
    semanaMayorPromedio,
    promedioDiario
}) => {
    let recomendaciones = [];
    let tieneRecomendaciones = false;

    // Recomendación sobre fin de semana
    if (pctFinSemana > 50) {
        recomendaciones.push(`Tus gastos de fin de semana son muy altos (<strong>${pctFinSemana.toFixed(0)}%</strong> del total). Considera establecer un límite de gasto para sábado y domingo.`);
        tieneRecomendaciones = true;
    } else if (pctFinSemana > 35) {
        recomendaciones.push(`Los fines de semana tienen un peso significativo en tus finanzas. Revisa si hay gastos que podrías reducir esos días.`);
        tieneRecomendaciones = true;
    }

    // Recomendación sobre días inactivos
    if (diasSinMovimientos > 15) {
        recomendaciones.push(`Hubo <strong>${diasSinMovimientos} días</strong> sin ningún movimiento. ¡Aprovecha esos días para ahorrar más!`);
        tieneRecomendaciones = true;
    } else if (diasSinMovimientos < 3 && diasSinMovimientos > 0) {
        recomendaciones.push(`¡Estuviste activo casi todos los días! Considera si realmente necesitas gastar todos esos días.`);
        tieneRecomendaciones = true;
    }

    // Recomendación sobre tasa de ahorro
    if (porcentajeAhorro < 0 && totalIngresos > 0) {
        recomendaciones.push(`Tu tasa de ahorro es negativa. Es importante que analices qué gastos puedes reducir para equilibrar tus finanzas.`);
        tieneRecomendaciones = true;
    } else if (porcentajeAhorro < 10 && totalIngresos > 0) {
        recomendaciones.push(`Intenta incrementar tu tasa de ahorro. Aunque sea un pequeño aumento, con el tiempo hará diferencia.`);
        tieneRecomendaciones = true;
    }

    // Recomendación sobre variabilidad
    if (coefVariacionPromedio > 0.5) {
        recomendaciones.push(`Tu alta variabilidad semanal indica que sería beneficial establecer un <strong>presupuesto semanal fijo</strong> para regularizar tus gastos.`);
        tieneRecomendaciones = true;
    }

    // Recomendación sobre categorías
    if (numCategoriasUsadas <= 2 && totalIngresos > 0) {
        recomendaciones.push(`Usas pocas categorías para clasificar tus gastos. Detallar más te ayudará a entender mejor en qué se va tu dinero.`);
        tieneRecomendaciones = true;
    }

    // Recomendación sobre gastos fijos
    if (pctGastosFijos > 50) {
        recomendaciones.push(`Más de la mitad de tus ingresos se van en gastos fijos. Revisa cuáles podrías optimizar o reducir.`);
        tieneRecomendaciones = true;
    }

    // Recomendación sobre semana alta
    if (semanaMayorPromedio && promedioDiario > 0) {
        if (semanaMayorPromedio.stats.avg > promedioDiario * 7 * 0.4) {
            recomendaciones.push(`La semana <strong>${semanaMayorPromedio.label}</strong> tuvo gastos muy por encima de tu promedio. ¿Tuviste algún gasto especial esos días?`);
            tieneRecomendaciones = true;
        }
    }

    // Recomendación positiva
    if (porcentajeAhorro > 20 && pctFinSemana < 30 && coefVariacionPromedio < 0.4) {
        recomendaciones.push(`¡Excelente mes! Tienes buenos hábitos financieros: alto ahorro, gastos controlados entre semana y consistencia. ¡Sigue así!`);
        tieneRecomendaciones = true;
    }

    if (!tieneRecomendaciones) {
        return null;
    }

    let resultado = '<br><br><strong>💡 Recomendaciones:</strong> ';
    resultado += recomendaciones.slice(0, 3).join(' ');
    return resultado;
};

/**
 * Genera análisis de cuartiles con lenguaje natural.
 *
 * @param {Object} statsPorSemana - Estadísticas por semana
 * @param {number} medianaGeneral - Mediana general
 * @returns {string|null} Mensaje o null si no aplica
 */
const generarAnalisisCuartiles = (statsPorSemana, medianaGeneral) => {
    if (statsPorSemana.length === 0) return null;

    // Encontrar semana con mayor IQR
    const semanasConIQR = statsPorSemana.filter(s => (s.stats.q3 - s.stats.q1) > 0);
    if (semanasConIQR.length === 0) return null;

    const semanaMayorIQR = [...semanasConIQR].sort((a, b) =>
        (b.stats.q3 - b.stats.q1) - (a.stats.q3 - a.stats.q1)
    )[0];

    const iqrSemana = semanaMayorIQR.stats.q3 - semanaMayorIQR.stats.q1;

    if (iqrSemana > 0) {
        let msg = `<br><br><strong>📦 Comportamiento de gastos:</strong> `;
        msg += `La semana <strong>${semanaMayorIQR.label}</strong> mostró mayor variación en tus gastos. `;
        msg += `El rango entre tus gastos típicos fue de <strong>${formatCurrency(iqrSemana)}</strong> `;
        msg += `(desde <strong>${formatCurrency(semanaMayorIQR.stats.q1)}</strong> hasta <strong>${formatCurrency(semanaMayorIQR.stats.q3)}</strong>). `;

        // Analizar si hay semanas muy diferentes
        const semanasArribaMediana = statsPorSemana.filter(s => s.stats.median > medianaGeneral).length;
        const semanasDebajoMediana = statsPorSemana.filter(s => s.stats.median <= medianaGeneral).length;

        if (semanasArribaMediana > semanasDebajoMediana) {
            msg += `La mayoría de las semanas estuviste por encima de tu mediana de <strong>${formatCurrency(medianaGeneral)}</strong>, lo que indica que tus gastos fueron elevados la mayor parte del mes.`;
        } else if (semanasDebajoMediana > semanasArribaMediana) {
            msg += `Varias semanas estuviste por debajo de tu mediana de <strong>${formatCurrency(medianaGeneral)}</strong>, lo que es positivo para tu ahorro.`;
        }

        return msg;
    }

    return null;
};

/**
 * Genera evaluación de salud financiera general.
 *
 * @param {number} porcentajeAhorro - Porcentaje de ahorro
 * @param {number} pctGastosTotal - Porcentaje de gastos vs ingresos
 * @param {number} coefVariacionPromedio - Coeficiente de variación
 * @param {number} totalIngresos - Total de ingresos
 * @returns {string} Mensaje de evaluación
 */
const generarEvaluacionSaludFinanciera = (porcentajeAhorro, pctGastosTotal, coefVariacionPromedio, totalIngresos) => {
    if (totalIngresos === 0) {
        return 'No hay suficiente información sobre tus ingresos para evaluar tu salud financiera general.';
    }

    let score = 0;
    let reasons = [];

    // Puntos por ahorro
    if (porcentajeAhorro >= 20) {
        score += 3;
        reasons.push('alta tasa de ahorro');
    } else if (porcentajeAhorro >= 10) {
        score += 2;
        reasons.push('tasa de ahorro moderada');
    } else if (porcentajeAhorro >= 0) {
        score += 1;
        reasons.push('baja tasa de ahorro');
    } else {
        score -= 1;
        reasons.push('tasa de ahorro negativa');
    }

    // Puntos por ratio gastos/ingresos
    if (pctGastosTotal < 70) {
        score += 2;
        reasons.push('gastos controlados');
    } else if (pctGastosTotal < 90) {
        score += 1;
        reasons.push('gastos moderados');
    } else {
        score -= 1;
        reasons.push('gastos elevados');
    }

    // Puntos por consistencia
    if (coefVariacionPromedio < 0.3) {
        score += 2;
        reasons.push('gastos consistentes');
    } else if (coefVariacionPromedio < 0.6) {
        score += 1;
        reasons.push('variabilidad moderada');
    } else {
        score -= 1;
        reasons.push('alta variabilidad');
    }

    if (score >= 6) {
        return `<br><br><strong>🏆 Evaluación general:</strong> ¡Excelente! Tu salud financiera es muy buena. Tienes ${reasons.join(', ')}.`;
    } else if (score >= 4) {
        return `<br><br><strong>👍 Evaluación general:</strong> Tu salud financiera es buena. Tus puntos fuertes son ${reasons.join(', ')}.`;
    } else if (score >= 2) {
        return `<br><br><strong>⚠️ Evaluación general:</strong> Tu salud financiera es regular. Áreas de mejora: ${reasons.join(', ')}.`;
    } else {
        return `<br><br><strong>🚨 Evaluación general:</strong> Tu salud financiera necesita atención. Factores a mejorar: ${reasons.join(', ')}.`;
    }
};

/**
 * Genera un párrafo de análisis financiero completo para el mes seleccionado.
 * Incluye múltiples métricas con lenguaje natural y accesible.
 *
 * @param {Array} transactions - Transacciones del mes filtradas
 * @param {number} selectedMonth - Mes seleccionado (0-11)
 * @param {number} selectedYear - Año seleccionado
 * @returns {string} HTML con el párrafo de análisis
 */
const generarAnalisisCompleto = (transactions, selectedMonth, selectedYear) => {
    // Mensaje cuando no hay transacciones
    if (!transactions || transactions.length === 0) {
        return `
            <div class="card analisis-card">
                <p class="analisis-card__text">
                    No hay suficientes datos para generar un análisis este mes.
                    Agrega transacciones para recibir insights personalizados sobre tus hábitos financieros.
                </p>
            </div>
        `;
    }

    // Nombres de meses y días
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

    // Días del mes
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

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
    const top3Categorias = categoriasOrdenadas.slice(0, 3);

    // Gastos por día
    const gastosPorDia = {};
    const gastosPorDiaSemana = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    transactions.filter(t => t.tipo === 'Gasto').forEach(t => {
        const d = new Date(t.fecha.includes('T') ? t.fecha : t.fecha + 'T12:00:00');
        const dayOfMonth = d.getDate();
        const dayOfWeek = d.getDay();

        gastosPorDia[dayOfMonth] = (gastosPorDia[dayOfMonth] || 0) + t.monto;
        gastosPorDiaSemana[dayOfWeek] = (gastosPorDiaSemana[dayOfWeek] || 0) + t.monto;
    });

    // Días con y sin movimientos
    const diasConGastos = Object.keys(gastosPorDia).length;
    const diasSinMovimientos = daysInMonth - diasConGastos;

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

    // Franja horaria con más gasto
    const franjaConGastos = Object.entries(gastosPorFranja).filter(([k, v]) => v > 0);
    const franjaMayorGastoIdx = franjaConGastos.length > 0
        ? [...franjaConGastos].sort((a, b) => b[1] - a[1])[0]
        : null;
    const franjaMayorGasto = franjaMayorGastoIdx ? franjaLabels[parseInt(franjaMayorGastoIdx[0])] : null;

    // Transacciones más alta y baja
    const transaccionMasAlta = transactions
        .filter(t => t.tipo === 'Gasto')
        .sort((a, b) => b.monto - a.monto)[0];

    const transaccionMasBaja = transactions
        .filter(t => t.tipo === 'Gasto')
        .sort((a, b) => a.monto - b.monto)[0];

    // Promedio diario
    const promedioDiario = diasConGastos > 0 ? totalGastos / diasConGastos : 0;

    // Número de transacciones de gasto
    const numTransaccionesGasto = transactions.filter(t => t.tipo === 'Gasto').length;
    const promedioPorTransaccion = numTransaccionesGasto > 0 ? totalGastos / numTransaccionesGasto : 0;

    // Top días de gasto
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

    // Fin de semana vs laborables
    const gastosFinSemana = (gastosPorDiaSemana[0] || 0) + (gastosPorDiaSemana[6] || 0);
    const gastosLaborables = totalGastos - gastosFinSemana;
    const pctFinSemana = totalGastos > 0 ? (gastosFinSemana / totalGastos * 100) : 0;

    // Número de categorías
    const numCategoriasUsadas = Object.keys(gastosPorCategoria).length;

    // Gastos fijos
    const gastosFijos = (gastosPorCategoria['Servicios'] || 0) +
        (gastosPorCategoria['Suscripciones'] || 0) +
        (gastosPorCategoria['Banca'] || 0);
    const pctGastosFijos = totalIngresos > 0 ? (gastosFijos / totalIngresos * 100) : 0;

    // Primer y último gasto
    const sortedByDate = [...transactions].sort((a, b) =>
        new Date(a.fecha) - new Date(b.fecha)
    );
    const primerGasto = sortedByDate.find(t => t.tipo === 'Gasto');
    const ultimoGasto = [...sortedByDate].reverse().find(t => t.tipo === 'Gasto');

    // =====================
    // ANÁLISIS SEMANAL (BOXPLOT)
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

    // Métricas de boxplot
    let coefVariacionPromedio = 0;
    let medianaGeneral = 0;
    let semanaMayorPromedio = null;
    let semanaMenorPromedio = null;
    let iqrPromedio = 0;

    if (statsPorSemana.length > 0) {
        const coefsVariacion = statsPorSemana.map(s => s.stats.std / s.stats.avg).filter(c => !isNaN(c) && isFinite(c));
        coefVariacionPromedio = coefsVariacion.length > 0 ? coefsVariacion.reduce((a, b) => a + b, 0) / coefsVariacion.length : 0;

        const todasLasMedianas = statsPorSemana.map(s => s.stats.median);
        medianaGeneral = todasLasMedianas.sort((a, b) => a - b)[Math.floor(todasLasMedianas.length / 2)];

        semanaMayorPromedio = [...statsPorSemana].sort((a, b) => b.stats.avg - a.stats.avg)[0];
        semanaMenorPromedio = [...statsPorSemana].sort((a, b) => a.stats.avg - b.stats.avg)[0];

        const iqrs = statsPorSemana.map(s => s.stats.q3 - s.stats.q1).filter(v => v > 0);
        iqrPromedio = iqrs.length > 0 ? iqrs.reduce((a, b) => a + b, 0) / iqrs.length : 0;
    }

    // =====================
    // CONSTRUCCIÓN DEL PÁRRAFO
    // =====================

    let analisis = '';

    // Resumen introductorio
    analisis += `<strong>Resumen del mes</strong><br>`;
    analisis += `Durante <strong>${monthNames[selectedMonth]} ${selectedYear}</strong> registraste un total de <strong>${totalTransacciones} movimientos financieros</strong>. `;
    analisis += `De estos, <strong>${numTransaccionesGasto}</strong> fueron gastos y <strong>${totalTransacciones - numTransaccionesGasto}</strong> fueron ingresos. `;

    if (totalIngresos + totalGastos > 0) {
        analisis += `Manejaste un volumen total de <strong>${formatCurrency(totalIngresos + totalGastos)}</strong>. `;
    }

    // Balance
    if (balance >= 0) {
        analisis += generarMensajeBalancePositivo(balance, porcentajeAhorro) + ' ';
    } else {
        analisis += generarMensajeBalanceNegativo(balance, porcentajeAhorro) + ' ';
    }

    // Patrón semanal
    if (totalGastos > 0 && diaSemanaMayorGastoIdx) {
        const diaIdx = parseInt(diaSemanaMayorGastoIdx[0]);
        const diaNombre = weekDays[diaIdx];
        const gastoDiaMayor = diaSemanaMayorGastoIdx[1];

        analisis += '<br><br><strong>📅 Patrón semanal</strong><br>';

        const obsFinSemana = generarObservacionFinDeSemana(pctFinSemana, gastosFinSemana, totalGastos);
        if (obsFinSemana) analisis += obsFinSemana + ' ';

        analisis += `El día de mayor gasto fue <strong>${diaNombre}</strong> con <strong>${formatCurrency(gastoDiaMayor)}</strong>. `;

        // Segundo día con más gasto
        const diaSemanaConGastos = Object.entries(gastosPorDiaSemana).filter(([k, v]) => v > 0);
        if (diaSemanaConGastos.length > 1) {
            const segundoDia = [...diaSemanaConGastos].sort((a, b) => b[1] - a[1])[1];
            if (parseInt(segundoDia[0]) !== diaIdx) {
                const diaNombre2 = weekDays[parseInt(segundoDia[0])];
                analisis += `Le sigue <strong>${diaNombre2}</strong> con <strong>${formatCurrency(segundoDia[1])}</strong>. `;
            }
        }

        if (gastosLaborables > 0 && pctFinSemana > 0) {
            const pctLaborables = 100 - pctFinSemana;
            analisis += `Entre semana (lunes a viernes) acumulaste el <strong>${pctLaborables.toFixed(0)}%</strong> de tus gastos (<strong>${formatCurrency(gastosLaborables)}</strong>). `;
        }
    }

    // Categorías de gasto
    if (top3Categorias.length > 0 && totalGastos > 0) {
        analisis += '<br><br><strong>🏷️ Categorías de gasto</strong><br>';
        analisis += generarComentarioCategorias(top3Categorias, numCategoriasUsadas, totalGastos) + ' ';
    }

    // Horario de gastos
    if (franjaConGastos.length > 0 && franjaMayorGastoIdx) {
        analisis += '<br><br><strong>⏰ Horarios de gasto</strong><br>';
        analisis += generarObservacionHoraria(franjaMayorGasto, franjaMayorGastoIdx[1], franjaConGastos.filter(f => f[1] < franjaMayorGastoIdx[1] * 0.2)) + ' ';
    }

    // Comportamiento diario
    if (totalGastos > 0 && diasConGastos > 0) {
        analisis += '<br><br><strong>📈 Actividad diaria</strong><br>';
        analisis += `De los <strong>${daysInMonth} días</strong> del mes, tuviste <strong>${diasConGastos} días con movimientos</strong>. `;

        const obsDiasInactivos = generarComentarioDiasInactivos(diasSinMovimientos, daysInMonth);
        if (obsDiasInactivos) analisis += obsDiasInactivos + ' ';

        analisis += `Tu promedio de gasto por día activo fue de <strong>${formatCurrency(promedioDiario)}</strong>. `;

        if (topDiasGasto.length > 0) {
            analisis += generarObservacionDiasAltoGasto(diasConGastos, promedioDiario, topDiasGasto) + ' ';
        }

        if (numTransaccionesGasto > 0) {
            analisis += `En promedio, cada transacción de gasto fue de <strong>${formatCurrency(promedioPorTransaccion)}</strong>. `;
        }
    }

    // Transacciones notables
    if (transaccionMasAlta && transaccionMasAlta.monto > 0) {
        analisis += '<br><br><strong>💰 Gastos notables</strong><br>';
        analisis += generarComentarioGastoAlto(transaccionMasAlta) + ' ';
    }

    if (transaccionMasBaja && transaccionMasBaja.monto > 0 && transaccionMasBaja.monto !== transaccionMasAlta?.monto) {
        analisis += generarComentarioGastoBajo(transaccionMasBaja, transaccionMasAlta) + ' ';
    }

    // Rango de fechas
    if (primerGasto && ultimoGasto) {
        analisis += '<br><br><strong>📆 Tu actividad</strong><br>';
        analisis += generarObservacionRangoFechas(primerGasto, ultimoGasto) + ' ';
    }

    // Ingresos
    if (Object.keys(ingresosPorCategoria).length > 0 && totalIngresos > 0) {
        analisis += '<br><br><strong>💼 Tus ingresos</strong><br>';
        analisis += generarObservacionIngresos(ingresosPorCategoria, totalIngresos) + ' ';
    }

    // Gastos fijos
    if (pctGastosFijos > 0 && totalIngresos > 0) {
        const obsGastosFijos = generarObservacionGastosFijos(pctGastosFijos, totalIngresos, gastosFijos);
        if (obsGastosFijos) {
            analisis += '<br><br><strong>🏠 Gastos fijos</strong><br>';
            analisis += obsGastosFijos + ' ';
        }
    }

    // Ratio gastos/ingresos
    if (totalIngresos > 0) {
        const pctGastosTotal = (totalGastos / totalIngresos * 100);
        analisis += '<br><br><strong>⚖️ Relación gastos-ingresos</strong><br>';
        analisis += generarComentarioRatioGastos(pctGastosTotal) + ' ';
    }

    // Tasa de ahorro
    if (totalIngresos > 0) {
        const evalAhorro = evaluarTasaAhorro(porcentajeAhorro, totalIngresos);
        if (evalAhorro) {
            analisis += '<br><br><strong>🎯 Tu ahorro</strong><br>';
            analisis += evalAhorro + ' ';
        }
    }

    // Análisis semanal (boxplot)
    if (statsPorSemana.length > 0) {
        analisis += '<br><br><strong>📊 Análisis semanal</strong><br>';
        analisis += `Se identificaron <strong>${statsPorSemana.length} semanas</strong> con actividad de gastos. `;

        if (semanaMayorPromedio && semanaMenorPromedio) {
            analisis += `La semana de mayor gasto promedio fue <strong>${semanaMayorPromedio.label}</strong> con <strong>${formatCurrency(semanaMayorPromedio.stats.avg)}</strong>. `;
            analisis += `La de menor promedio fue <strong>${semanaMenorPromedio.label}</strong> con <strong>${formatCurrency(semanaMenorPromedio.stats.avg)}</strong>. `;
        }

        analisis += generarComentarioConsistencia(coefVariacionPromedio) + ' ';
    }

    // Análisis de cuartiles
    if (statsPorSemana.length > 0) {
        const analisisCuartiles = generarAnalisisCuartiles(statsPorSemana, medianaGeneral);
        if (analisisCuartiles) {
            analisis += analisisCuartiles;
        }
    }

    // Evaluación general de salud financiera
    if (totalIngresos > 0) {
        analisis += generarEvaluacionSaludFinanciera(porcentajeAhorro, (totalGastos / totalIngresos * 100), coefVariacionPromedio, totalIngresos);
    }

    // Recomendaciones
    const recomendaciones = generarSeccionRecomendaciones({
        pctFinSemana,
        diasSinMovimientos,
        porcentajeAhorro,
        coefVariacionPromedio,
        totalIngresos,
        numCategoriasUsadas,
        pctGastosFijos,
        semanasEstables: statsPorSemana.filter(s => s.stats.std / s.stats.avg < 0.3).length,
        statsPorSemana,
        semanaMayorPromedio,
        promedioDiario
    });

    if (recomendaciones) {
        analisis += recomendaciones;
    }

    // =====================
    // RETORNO HTML
    // =====================

    return `
        <h2 style="margin-top: 32px; margin-bottom: 16px; font-size: 20px;">Analisis Financiero</h2>
        <div class="card analisis-card">
            <p class="analisis-card__text">${analisis}</p>
        </div>
    `;
};