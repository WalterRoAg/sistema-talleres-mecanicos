const express = require('express');
const router = express.Router();
const pool = require('../db');

// CU5: Registrar Vehículo
router.post('/vehiculos', async (req, res) => {
    const { id_usuario, placa, marca, modelo, color } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO vehiculos (id_usuario, placa, marca, modelo, color) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [id_usuario, placa, marca, modelo, color]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error al registrar vehículo" });
    }
});

// CU6: Listar Vehículos del Usuario
router.get('/vehiculos/:id_usuario', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM vehiculos WHERE id_usuario = $1 AND estado_registro = 'activo'",
            [req.params.id_usuario]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener vehículos" });
    }
});

module.exports = router;