// Módulo 4 — Backend y Base de Datos (Actor Administrador)
const express = require('express');
const router = express.Router();
const pool = require('../db');

// CU26 y CU28: Consultar todos los incidentes y reportes generales
router.get('/reporte-general', async (req, res) => {
    try {
        const incidentes = await pool.query(`
            SELECT i.id_incidente, u.nombre_completo as cliente, t.nombre_taller, 
                   i.estado_servicio, i.fecha_reporte, p.monto_total, p.comision_plataforma
            FROM incidentes i
            LEFT JOIN usuarios u ON i.id_usuario = u.id_usuario
            LEFT JOIN talleres t ON i.id_taller = t.id_taller
            LEFT JOIN pagos p ON i.id_incidente = p.id_incidente
            ORDER BY i.fecha_reporte DESC
        `);

        // CU29: Calcular total de comisiones generadas
        const estadisticas = await pool.query(`
            SELECT SUM(monto_total) as ingresos_totales, 
                   SUM(comision_plataforma) as comisiones_acumuladas,
                   COUNT(id_pago) as servicios_pagados
            FROM pagos
        `);

        res.json({
            incidentes: incidentes.rows,
            resumen_financiero: estadisticas.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: "Error al generar reporte administrativo" });
    }
});

module.exports = router;