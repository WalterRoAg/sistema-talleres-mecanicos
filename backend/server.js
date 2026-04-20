/**
 * Módulo 4: Backend y Base de Datos
 * Este archivo centraliza la lógica del servidor, seguridad y tiempo real.
 */

require('dotenv').config();
const express = require('express');
const http = require('http'); // Necesario para integrar Socket.io
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// 1. Importación de Conexión a DB y Rutas
const pool = require('./db'); 
const authRoutes = require('./routes/auth');
const incidentesRoutes = require('./routes/incidentes');
const iaRoutes = require('./routes/ia_engine');

const app = express();
const server = http.createServer(app); // Creamos el servidor HTTP

// 2. Configuración de Socket.io (CU30 - Chat en Tiempo Real)
const io = new Server(server, {
    cors: {
        origin: "*", // En producción, limita esto a la URL de tu app en Render
        methods: ["GET", "POST"]
    }
});

// 3. Middlewares Globales
app.use(cors());
app.use(express.json());
// Servir archivos estáticos para que el Frontend vea las fotos (CU9)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/admin', require('./routes/admin'));

// 4. Definición de Rutas de la API (Sincronizado con los 4 Módulos)
app.use('/api/auth', authRoutes);         // Módulo 4: Seguridad (CU1, CU2, CU3)
app.use('/api/incidentes', incidentesRoutes); // Módulo 4: Trazabilidad y Gestión (CU7, CU21, CU23, CU24)
app.use('/api/ia', iaRoutes);             // Módulo 3: Inteligencia Artificial (CU12, CU22)

// 5. Lógica de WebSockets para el Chat (CU30)
io.on('connection', (socket) => {
    console.log(`🔌 Nuevo dispositivo conectado al chat: ${socket.id}`);

    // Unirse a la sala de un incidente específico
    socket.on('join_incident', (id_incidente) => {
        socket.join(id_incidente);
        console.log(`id_incidente ${id_incidente}: Usuario unido a la sala.`);
    });

    // Escuchar y retransmitir mensajes
    socket.on('send_message', async (data) => {
        const { id_incidente, id_emisor, mensaje } = data;
        
        try {
            // Guardar en DB para Trazabilidad (CU26)
            await pool.query(
                "INSERT INTO mensajes_chat (id_incidente, id_emisor, mensaje) VALUES ($1, $2, $3)",
                [id_incidente, id_emisor, mensaje]
            );
            
            // Enviar el mensaje a todos los que estén en la sala de este incidente
            io.to(id_incidente).emit('receive_message', data);
        } catch (err) {
            console.error("Error al procesar mensaje de chat:", err);
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ Dispositivo desconectado del chat.');
    });
});

// 6. Inicio del Servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('=========================================================');
    console.log(`🚀 SERVIDOR ACTIVO EN: http://localhost:${PORT}`);
    console.log(`✅ Módulo 4 (Backend) y Módulo 3 (IA) en línea`);
    console.log(`💬 Chat en Tiempo Real (CU30) habilitado`);
    console.log('=========================================================');
});