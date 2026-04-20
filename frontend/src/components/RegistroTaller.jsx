import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistroTaller = () => {
    const navigate = useNavigate();
    const [especialidadesSeleccionadas, setEspecialidadesSeleccionadas] = useState([]);
    const [formData, setFormData] = useState({
        nombre_taller: '',
        direccion: '',
        telefono: '',
        correo_electronico: '',
        contrasena: ''
    });
    const [mensaje, setMensaje] = useState('');

    const categorias = [
        "Reparación de Motores", "Electricidad Automotriz", "Servicio de Gomería",
        "Suspensión Vehicular", "Grúa", "Frenos y Embrague", "Reparación de Caja"
    ];

    const handleCheckboxChange = (cat) => {
        if (especialidadesSeleccionadas.includes(cat)) {
            setEspecialidadesSeleccionadas(especialidadesSeleccionadas.filter(item => item !== cat));
        } else {
            setEspecialidadesSeleccionadas([...especialidadesSeleccionadas, cat]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validar que al menos seleccionó una categoría
    if (especialidadesSeleccionadas.length === 0) {
        setMensaje('❌ Selecciona al menos una especialidad');
        return;
    }

    const dataFinal = { 
        nombre_taller: formData.nombre_taller,
        correo_electronico: formData.correo_electronico,
        contrasena: formData.contrasena,
        telefono: formData.telefono,
        direccion: formData.direccion,
        especialidad: especialidadesSeleccionadas // Enviamos el Array
    };
        
        try {
            const response = await fetch('http://localhost:3000/api/auth/registro-taller', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataFinal)
            });

            if (response.ok) {
                setMensaje('✅ Registro exitoso');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setMensaje('❌ Error en el registro');
            }
        } catch (error) {
            setMensaje('❌ Error de conexión');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 p-6 flex justify-center items-center">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full flex overflow-hidden">
                {/* Panel Lateral Izquierdo */}
                <div className="hidden lg:block w-1/3 bg-blue-600 p-10 text-white">
                    <h2 className="text-4xl font-black uppercase italic mb-6">Módulo de Servicios</h2>
                    <p className="opacity-80">Selecciona todas las categorías que tu taller puede cubrir. Esto mejorará tu visibilidad en el mapa de auxilio.</p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="w-full lg:w-2/3 p-10 space-y-6">
                    <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-tighter">Registro Multicategoría</h1>
                    
                    {/* Sección de Checkboxes */}
                    <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200">
                        <label className="block text-sm font-bold text-blue-600 uppercase mb-4 underline">Especialidades del Taller:</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {categorias.map(cat => (
                                <label key={cat} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-white rounded transition">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 accent-blue-600"
                                        checked={especialidadesSeleccionadas.includes(cat)}
                                        onChange={() => handleCheckboxChange(cat)}
                                    />
                                    <span className="text-gray-700 font-medium">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="nombre_taller" placeholder="Nombre del Taller" onChange={handleChange} required className="border-b-2 p-2 outline-none focus:border-blue-600" />
                        <input name="telefono" placeholder="Teléfono" onChange={handleChange} required className="border-b-2 p-2 outline-none focus:border-blue-600" />
                        <input name="correo_electronico" type="email" placeholder="Correo" onChange={handleChange} required className="border-b-2 p-2 outline-none focus:border-blue-600 md:col-span-2" />
                        <input name="contrasena" type="password" placeholder="Contraseña" onChange={handleChange} required className="border-b-2 p-2 outline-none focus:border-blue-600 md:col-span-2" />
                    </div>

                    <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-black transition uppercase">
                        Finalizar Registro de Taller
                    </button>
                    {mensaje && <p className="text-center font-bold text-blue-600">{mensaje}</p>}
                </form>
            </div>
        </div>
    );
};

export default RegistroTaller;