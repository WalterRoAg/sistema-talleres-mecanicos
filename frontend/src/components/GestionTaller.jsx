import React, { useState, useEffect } from 'react';

const GestionTaller = () => {
    const [datos, setDatos] = useState({
        nombre_completo: '',
        telefono: '',
        direccion: '',
        especialidad: [] // Aquí se cargarán las de la BD
    });
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);

    const todasLasCategorias = [
        "Reparación de Motores", "Electricidad Automotriz", "Servicio de Gomería",
        "Suspensión Vehicular", "Grúa", "Frenos y Embrague", "Reparación de Caja"
    ];

    // 1. OBTENER EL ID DEL USUARIO LOGUEADO
    useEffect(() => {
    const cargarPerfil = async () => {
        try {
            // 1. Extraer ID del usuario logueado
            const storage = localStorage.getItem('usuario');
            if (!storage) {
                console.warn("No hay usuario en localStorage");
                return;
            }
            
            const usuarioObj = JSON.parse(storage);
            const idUsuario = usuarioObj.id; // El ID que viene del login

            // 2. Hacer la petición al backend
            const res = await fetch(`http://localhost:3000/api/auth/perfil-taller/${idUsuario}`);
            const data = await res.json();
            
            if (res.ok) {
                // 3. Mapear los datos a los estados de React
                setDatos({
                    nombre_completo: data.nombre_completo || '',
                    telefono: data.telefono || '',
                    direccion: data.direccion || '',
                    especialidad: Array.isArray(data.especialidad) ? data.especialidad : []
                });
                console.log("Datos cargados del taller:", data);
            }
        } catch (err) {
            console.error("Error en la conexión con el perfil:", err);
        } finally {
            setCargando(false);
        }
    };
    cargarPerfil();
}, []);
    // 2. FUNCIÓN PARA PERMITIR ESCRIBIR EN LOS INPUTS
    const handleInputChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    };

    // 3. FUNCIÓN PARA ACTIVAR/DESACTIVAR ESPECIALIDADES
    const toggleEspecialidad = (cat) => {
        const nuevas = datos.especialidad.includes(cat)
            ? datos.especialidad.filter(item => item !== cat)
            : [...datos.especialidad, cat];
        setDatos({ ...datos, especialidad: nuevas });
    };

    const handleSave = async () => {
        setMensaje("Guardando...");
        try {
            const usuarioStorage = JSON.parse(localStorage.getItem('usuario'));
            const idUsuario = usuarioStorage?.id || 1;

            const res = await fetch(`http://localhost:3000/api/auth/actualizar-taller/${idUsuario}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            if (res.ok) {
                setMensaje("✅ Configuración guardada exitosamente");
                setTimeout(() => setMensaje(''), 3000);
            }
        } catch (err) {
            setMensaje("❌ Error al guardar cambios");
        }
    };

    if (cargando) return <div className="p-10 text-white">Cargando datos del taller...</div>;

    return (
        <div className="p-4 md:p-8 bg-white rounded-3xl shadow-xl font-sans text-slate-800">
            <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">
                Gestionar Disponibilidad (CU20)
            </h1>
            <p className="text-slate-500 mb-8 border-l-4 border-cyan-500 pl-4">
                Administra los servicios activos de tu taller y actualiza tu información de contacto.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* SECCIÓN DATOS (Ahora permiten escribir) */}
                <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h2 className="font-bold text-slate-700 flex items-center gap-2 uppercase text-sm tracking-widest">
                        👤 Datos Generales
                    </h2>
                    
                    <div>
                        <label className="text-[10px] font-black text-cyan-600 uppercase tracking-tighter">Nombre Comercial</label>
                        <input 
                            name="nombre_completo"
                            value={datos.nombre_completo} 
                            onChange={handleInputChange}
                            className="w-full border-b-2 border-slate-200 p-2 outline-none focus:border-cyan-500 bg-transparent transition-colors font-semibold" 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-cyan-600 uppercase tracking-tighter">Teléfono de Contacto</label>
                        <input 
                            name="telefono"
                            value={datos.telefono} 
                            onChange={handleInputChange}
                            className="w-full border-b-2 border-slate-200 p-2 outline-none focus:border-cyan-500 bg-transparent transition-colors font-semibold" 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-cyan-600 uppercase tracking-tighter">Dirección</label>
                        <textarea 
                            name="direccion"
                            value={datos.direccion} 
                            onChange={handleInputChange}
                            className="w-full border-2 border-slate-200 rounded-xl p-3 mt-1 outline-none focus:border-cyan-500 bg-transparent transition-colors min-h-[100px]" 
                        />
                    </div>
                </div>

                {/* SECCIÓN ESPECIALIDADES (Switches) */}
                <div className="space-y-6">
                    <h2 className="font-bold text-slate-700 flex items-center gap-2 uppercase text-sm tracking-widest">
                        🛠️ Servicios y Especialidades
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-3">
                        {todasLasCategorias.map(cat => {
                            const estaActiva = datos.especialidad.includes(cat);
                            return (
                                <div 
                                    key={cat} 
                                    onClick={() => toggleEspecialidad(cat)}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                                        estaActiva ? 'border-cyan-500 bg-cyan-50/50' : 'border-slate-100 bg-slate-50'
                                    }`}
                                >
                                    <span className={`font-bold ${estaActiva ? 'text-cyan-700' : 'text-slate-400'}`}>
                                        {cat}
                                    </span>
                                    {/* El Switch visual */}
                                    <div className={`w-12 h-6 rounded-full relative transition-colors ${estaActiva ? 'bg-cyan-500' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${estaActiva ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <button 
                onClick={handleSave}
                className="mt-10 w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-cyan-600 transition-all shadow-xl uppercase tracking-[0.2em]"
            >
                Guardar Configuración
            </button>
            
            {mensaje && (
                <div className="mt-4 p-4 text-center font-bold text-cyan-600 animate-pulse">
                    {mensaje}
                </div>
            )}
        </div>
    );
};

export default GestionTaller;