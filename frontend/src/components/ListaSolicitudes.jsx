import React, { useEffect, useState } from 'react';

const ListaSolicitudes = ({ especialidadTaller }) => {
    const [solicitudes, setSolicitudes] = useState([]);

    useEffect(() => {
        // En producción: fetch('api/incidentes/disponibles')
        const datosSimulados = [
            { id: 1, tipo: 'gomeria', descripcion: 'Pinchazo en carretera', estado: 'pendiente' },
            { id: 2, tipo: 'mecanica_motores', descripcion: 'Humo blanco en el capó', estado: 'pendiente' }
        ];

        // Filtro lógico: Solo mostrar lo que el taller puede atender 
        const filtradas = datosSimulados.filter(s => s.tipo === especialidadTaller);
        setSolicitudes(filtradas);
    }, [especialidadTaller]);

    return (
        <div className="p-4">
            <h3 className="text-xl font-bold mb-4">Solicitudes de Auxilio Disponibles</h3>
            {solicitudes.length === 0 ? (
                <p>No hay solicitudes para tu especialidad: {especialidadTaller}</p>
            ) : (
                solicitudes.map(sol => (
                    <div key={sol.id} className="border p-4 mb-2 rounded shadow-sm bg-white">
                        <p><strong>Tipo:</strong> {sol.tipo.toUpperCase()}</p>
                        <p><strong>Problema:</strong> {sol.descripcion}</p>
                        <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
                            Aceptar Auxilio (CU23)
                        </button>
                    </div>
                ))
            )}
        </div> 
    );
};

export default ListaSolicitudes;