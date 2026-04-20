const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db'); // Conexión a PostgreSQL (Módulo 4)

// Configuración de almacenamiento (CU9 y CU10)
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// CU7: Registrar Emergencia Vehicular
router.post('/reportar', upload.fields([{ name: 'imagen' }, { name: 'audio' }]), async (req, res) => {
    try {
        const { id_usuario, id_vehiculo, lat, lng, descripcion } = req.body;
        const imagen_url = req.files['imagen'] ? req.files['imagen'][0].path : null;
        const audio_url = req.files['audio'] ? req.files['audio'][0].path : null;

        // 1. Guardar en DB con estado inicial (Módulo 4 + Trazabilidad)
        const nuevoIncidente = await pool.query(
            `INSERT INTO incidentes (id_usuario, id_vehiculo, ubicacion_lat, ubicacion_lng, imagen_url, audio_url, descripcion_texto, estado_servicio) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [id_usuario, id_vehiculo, lat, lng, imagen_url, audio_url, descripcion, 'analizando evidencia']
        );

        // 2. Simular llamada al Módulo 3 (IA) para Prechequeo (CU12)
        // Aquí podrías hacer un fetch interno a tu propia ruta de IA
        let requierePrechequeo = false;
        let preguntaIA = null;

        if (!imagen_url) {
            requierePrechequeo = true;
            preguntaIA = "La IA sugiere adjuntar una imagen para un diagnóstico más preciso.";
        }

        res.status(201).json({
            mensaje: "Incidente registrado",
            incidente: nuevoIncidente.rows[0],
            requiere_prechequeo: requierePrechequeo,
            pregunta_ia: preguntaIA
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al registrar la emergencia" });
    }
});
// Módulo 4: Backend
// CU21: Listar incidentes listos para talleres
router.get('/pendientes', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM incidentes WHERE estado_servicio = 'pendiente' ORDER BY fecha_reporte DESC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener solicitudes" });
    }
});

// CU19 y CU24: Asignar técnico y actualizar estado
router.patch('/asignar-tecnico/:id_incidente', async (req, res) => {
    const { id_incidente } = req.params;
    const { id_tecnico } = req.body; // El técnico elegido en la Web

    try {
        // Actualizamos el incidente: asignamos técnico y pasamos a estado 'asignado'
        const result = await pool.query(
            `UPDATE incidentes 
             SET id_tecnico = $1, estado_servicio = 'asignado' 
             WHERE id_incidente = $2 RETURNING *`,
            [id_tecnico, id_incidente]
        );

        res.json({
            mensaje: "Técnico asignado exitosamente",
            incidente: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: "Error al asignar técnico" });
    }
});

// Módulo 4: Backend y Base de Datos
// CU17: Realizar Pago y CU29: Gestionar Comisión

router.post('/pagar/:id_incidente', async (req, res) => {
    const { id_incidente } = req.params;
    const { monto_total, metodo_pago } = req.body;

    try {
        // Cálculo del 10% de comisión (Requerimiento 1.4.9)
        const comision = monto_total * 0.10;

        // 1. Registrar el pago en la tabla pagos
        await pool.query(
            `INSERT INTO pagos (id_incidente, monto_total, comision_plataforma, metodo_pago, estado_pago) 
             VALUES ($1, $2, $3, $4, $5)`,
            [id_incidente, monto_total, comision, metodo_pago, 'completado']
        );

        // 2. Actualizar el estado del incidente a 'finalizado'
        await pool.query(
            "UPDATE incidentes SET estado_servicio = 'finalizado' WHERE id_incidente = $1",
            [id_incidente]
        );

        res.json({
            mensaje: "Pago procesado exitosamente",
            detalle: {
                total: monto_total,
                comision_app: comision,
                estado: 'finalizado'
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al procesar el pago" });
    }
});
module.exports = router;
