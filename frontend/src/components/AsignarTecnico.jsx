// Módulo 2 — App Web (Taller)
// CU19: Gestionar Técnicos (Asignación)

import React, { useState, useEffect } from 'react';

const AsignarTecnico = ({ idIncidente, onFinalizar }) => {
    const [tecnicos, setTecnicos] = useState([]);

    useEffect(() => {
        // Simulamos obtener técnicos del taller que estén 'disponibles' (CU20)
        setTecnicos([
            { id: 101, nombre: "Juan Mecánico", especialidad: "Motores" },
            { id: 102, nombre: "Pedro Electricista", especialidad: "Electricidad" }
        ]);
    }, []);

    const manejarAsignacion = async (idTecnico) => {
        const res = await fetch(`http://localhost:3000/api/incidentes/asignar-tecnico/${idIncidente}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_tecnico: idTecnico })
        });

        if (res.ok) {
            alert("Mecánico asignado. Se ha notificado al cliente.");
            onFinalizar(); // Cierra el modal o refresca la lista
        }
    };

    return (
        <div className="p-4 bg-white shadow-inner rounded-lg mt-4">
            <h4 className="text-sm font-bold mb-3 text-gray-600">Seleccionar Técnico para el Auxilio:</h4>
            {tecnicos.map(t => (
                <div key={t.id} className="flex justify-between items-center mb-2 p-2 border rounded hover:bg-gray-50">
                    <div>
                        <p className="font-medium">{t.nombre}</p>
                        <p className="text-xs text-gray-500">{t.especialidad}</p>
                    </div>
                    <button 
                        onClick={() => manejarAsignacion(t.id)}
                        className="bg-blue-500 text-white text-xs px-3 py-1 rounded"
                    >
                        Asignar
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AsignarTecnico;