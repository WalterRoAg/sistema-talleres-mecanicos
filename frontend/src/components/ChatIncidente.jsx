import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const ChatIncidente = ({ idIncidente, idUsuario }) => {
    const [mensaje, setMensaje] = useState('');
    const [mensajes, setMensajes] = useState([]);

    useEffect(() => {
        // Unirse a la sala del incidente al cargar
        socket.emit('join_incident', idIncidente);

        // Escuchar mensajes nuevos
        socket.on('receive_message', (data) => {
            setMensajes((prev) => [...prev, data]);
        });

        return () => socket.off('receive_message');
    }, [idIncidente]);

    const enviarChat = () => {
        if (mensaje.trim()) {
            const data = { id_incidente: idIncidente, id_emisor: idUsuario, mensaje };
            socket.emit('send_message', data);
            setMensaje('');
        }
    };

    return (
        <div className="border rounded p-4 bg-white shadow">
            <h3 className="font-bold border-b mb-2 pb-2">Chat de Auxilio (CU30)</h3>
            <div className="h-64 overflow-y-auto mb-4 p-2 bg-gray-50">
                {mensajes.map((m, index) => (
                    <div key={index} className={`mb-2 ${m.id_emisor === idUsuario ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded ${m.id_emisor === idUsuario ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                            {m.mensaje}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input 
                    className="flex-1 border p-2 rounded" 
                    value={mensaje} 
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Escribe un mensaje..."
                />
                <button onClick={enviarChat} className="bg-green-600 text-white px-4 py-2 rounded">Enviar</button>
            </div>
        </div>
    );
};