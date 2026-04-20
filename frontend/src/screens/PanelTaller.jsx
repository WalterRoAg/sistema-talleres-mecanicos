// Módulo 2 — App Web (Taller)
// CU21: Visualizar solicitudes de asistencia
// CU22: Consultar información del incidente (Resumen IA)

import React, { useEffect, useState } from 'react';

const PanelTaller = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtenemos incidentes que ya pasaron el prechequeo de la IA
        fetch('http://localhost:3000/api/incidentes/pendientes')
            .then(res => res.json())
            .then(data => {
                setSolicitudes(data);
                setLoading(false);
            })
            .catch(err => console.error("Error al cargar solicitudes:", err));
    }, []);

    const aceptarSolicitud = async (id) => {
        // CU23: Aceptar o Rechazar Solicitud
        const response = await fetch(`http://localhost:3000/api/incidentes/aceptar/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            alert("Solicitud aceptada. El estado cambió a 'asignado'.");
            // Actualizar lista local
            setSolicitudes(solicitudes.filter(s => s.id_incidente !== id));
        }
    };

    if (loading) return <p>Cargando emergencias cercanas...</p>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Solicitudes de Auxilio Disponibles</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solicitudes.map(sol => (
                    <div key={sol.id_incidente} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase">
                                Prioridad: {sol.prioridad_ia || 'Alta'}
                            </span>
                            <span className="text-gray-400 text-xs">{new Date(sol.fecha_reporte).toLocaleTimeString()}</span>
                        </div>

                        {/* CU22: Resumen de IA */}
                        <div className="bg-blue-50 p-3 rounded mb-4 border border-blue-100">
                            <p className="text-sm font-semibold text-blue-800">🤖 Diagnóstico IA:</p>
                            <p className="text-sm italic text-blue-700">{sol.resumen_ia || "Analizando daños visibles..."}</p>
                        </div>

                        <p className="text-gray-700 mb-4"><strong>Problema:</strong> {sol.descripcion_texto}</p>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => aceptarSolicitud(sol.id_incidente)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition"
                            >
                                Aceptar
                            </button>
                            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded transition">
                                Ver Mapa
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {solicitudes.length === 0 && <p className="text-center text-gray-500 mt-10">No hay emergencias pendientes en tu zona.</p>}
        </div>
    );
};

export default PanelTaller;