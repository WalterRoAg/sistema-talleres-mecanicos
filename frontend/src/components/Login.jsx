import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

const Login = () => {

  const [formData, setFormData] = useState({
    correo_electronico: '',
    contrasena: ''
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(''); // Limpiar mensajes previos

    try {
        // Forzamos la URL directa para evitar errores de variables de entorno
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
localStorage.setItem('token', data.token);
localStorage.setItem('usuario', JSON.stringify(data.usuario)); // <--- ESTA ES LA CLAVE
        if (response.ok) {
            localStorage.setItem('token', data.token);
            // Guardamos el rol para saber a dónde redirigir
            localStorage.setItem('rol', data.usuario.rol);

            setMensaje(`¡Bienvenido, ${data.usuario.nombre_completo || 'Usuario'}!`);

            setTimeout(() => {
                // Si es admin va a /admin, si es taller podría ir a /perfil-taller
                if (data.usuario.rol === 'admin') {
                    navigate("/admin");
                } else {
                    // Por ahora mandémoslo al admin o a una ruta de taller si la tienes
                    navigate("/admin"); 
                }
            }, 1500);
        } else {
            setMensaje(data.mensaje || 'Credenciales incorrectas');
        }
    } catch (error) {
        console.error("Error en login:", error);
        setMensaje('❌ Error de conexión con el servidor. Revisa la terminal del Backend.');
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Auxilio Vehicular</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              name="correo_electronico"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Ingresar
          </button>
        </form>
        {mensaje && <p className="mt-4 text-center text-red-500">{mensaje}</p>}
      </div>
    </div>
  );
};

export default Login;