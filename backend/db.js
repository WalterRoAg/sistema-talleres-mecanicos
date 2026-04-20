// Módulo 4: Backend y Base de Datos
// Responsable de la persistencia de datos y trazabilidad (CU26)

const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión usando la variable de entorno del .env
// Asegúrate de que tu .env tenga: DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/auxilio_vehicular
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Evento para detectar errores en clientes inactivos (evita que el servidor se caiga)
pool.on('error', (err, client) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1);
});

// Prueba de conexión inmediata al arrancar el sistema
const probarConexion = async () => {
  try {
    const res = await pool.query('SELECT NOW() as hora_servidor');
    console.log('---------------------------------------------------------');
    console.log('✅ CONEXIÓN EXITOSA A POSTGRESQL');
    console.log(`📍 Base de datos: auxilio_vehicular`);
    console.log(`⏰ Hora del servidor DB: ${res.rows[0].hora_servidor}`);
    console.log('---------------------------------------------------------');
  } catch (err) {
    console.error('---------------------------------------------------------');
    console.error('❌ ERROR DE CONEXIÓN A LA BASE DE DATOS');
    console.error('Verifica lo siguiente:');
    console.error('1. Que el servicio de PostgreSQL esté iniciado.');
    console.error('2. Que la contraseña en el archivo .env sea correcta.');
    console.error('3. Que la base de datos "auxilio_vehicular" exista en pgAdmin.');
    console.error('---------------------------------------------------------');
  }
};

probarConexion();

module.exports = pool;