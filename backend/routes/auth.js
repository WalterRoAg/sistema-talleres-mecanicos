const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simulación de base de datos (En producción usar el script SQL anterior)
let usuarios = []; 
const JWT_SECRET = "tu_clave_secreta_para_render"; // Usar variables de entorno en Render

// CU1: Registro de Usuario
router.post('/register', async (req, res) => {
    try {
        const { nombre_completo, correo_electronico, telefono, contrasena, rol_acceso } = req.body;

        // Cifrar contraseña por seguridad (Módulo de Seguridad)
        const salt = await bcrypt.genSalt(10);
        const hashedContrasena = await bcrypt.hash(contrasena, salt);

        const nuevoUsuario = {
            id: usuarios.length + 1,
            nombre_completo,
            correo_electronico,
            telefono,
            contrasena: hashedContrasena,
            rol_acceso // cliente, taller, etc. [cite: 215]
        };

        usuarios.push(nuevoUsuario);
        res.status(201).json({ mensaje: "Usuario registrado con éxito", id: nuevoUsuario.id });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario" });
    }
});

// CU2: Iniciar Sesión
router.post('/login', async (req, res) => {
    const { correo_electronico, contrasena } = req.body;
    const usuario = usuarios.find(u => u.correo_electronico === correo_electronico);

    if (!usuario) return res.status(400).json({ mensaje: "Usuario no encontrado" });

    const esValido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValido) return res.status(400).json({ mensaje: "Contraseña incorrecta" });

    // Generar Token JWT
    const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol_acceso },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    res.json({ token, usuario: { nombre: usuario.nombre_completo, rol: usuario.rol_acceso } });
});

module.exports = router;