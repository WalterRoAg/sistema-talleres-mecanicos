const express = require('express');
const router = express.Router();
const pool = require('../db');

// ==========================================
// 1. RUTA DE LOGIN (CU2)
// ==========================================
router.post('/login', async (req, res) => {
    const { correo_electronico, contrasena } = req.body;
    
    try {
        // Buscamos al usuario por correo
        const userResult = await pool.query(
            'SELECT * FROM usuarios WHERE correo_electronico = $1', 
            [correo_electronico]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuario = userResult.rows[0];

        // Verificamos contraseña (directa para el examen)
        if (usuario.contrasena === contrasena) {
            res.json({
                mensaje: 'Login exitoso',
                token: 'TOKEN_PRUEBA_G23', 
                usuario: {
                    id: usuario.id_usuario,
                    nombre_completo: usuario.nombre_completo,
                    rol: usuario.rol_acceso
                }
            });
        } else {
            res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }
    } catch (err) {
        console.error("❌ Error en Login:", err.message);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// ==========================================
// 2. RUTA DE REGISTRO DE TALLER (CU1)
// ==========================================

router.post('/registro-taller', async (req, res) => {
    console.log("--- INTENTO DE REGISTRO ---");
    const { 
        nombre_taller, 
        correo_electronico, 
        contrasena, 
        especialidad, // Se recibe como Array de JS
        telefono, 
        direccion 
    } = req.body;

    try {
        if (!pool) {
            throw new Error("La conexión a la base de datos (pool) no está definida.");
        }

        // Insertamos en la BD. Postgres entiende el Array de JS si la columna es TEXT[]
        const nuevoTaller = await pool.query(
            `INSERT INTO usuarios (nombre_completo, correo_electronico, contrasena, rol_acceso, especialidad, telefono, direccion) 
             VALUES ($1, $2, $3, 'taller', $4, $5, $6) RETURNING *`,
            [nombre_taller, correo_electronico, contrasena, especialidad, telefono, direccion]
        );

        console.log("✅ Taller registrado con éxito:", nuevoTaller.rows[0].nombre_completo);
        res.status(201).json({ mensaje: 'Taller registrado exitosamente' });

    } catch (err) {
        console.error("❌ ERROR REAL EN BD:", err.message);
        // Si el error es por correo duplicado
        if (err.code === '23505') {
            return res.status(400).json({ mensaje: 'Este correo ya está registrado' });
        }
        res.status(500).json({ mensaje: 'Error: ' + err.message });
    }
});
// OBTENER PERFIL DEL TALLER
// backend/routes/auth.js
router.get('/perfil-taller/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT nombre_completo, telefono, direccion, especialidad FROM usuarios WHERE id_usuario = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

// ACTUALIZAR DISPONIBILIDAD Y DATOS (CU20)
router.put('/actualizar-taller/:id', async (req, res) => {
    const { nombre_completo, especialidad, telefono, direccion } = req.body;
    try {
        await pool.query(
            `UPDATE usuarios 
             SET nombre_completo = $1, especialidad = $2, telefono = $3, direccion = $4 
             WHERE id_usuario = $5`,
            [nombre_completo, especialidad, telefono, direccion, req.params.id]
        );
        res.json({ mensaje: "Información y disponibilidad actualizadas correctamente" });
    } catch (err) {
        res.status(500).json({ mensaje: "Error al actualizar" });
    }
});

module.exports = router;