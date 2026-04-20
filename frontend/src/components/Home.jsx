import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#e5e7eb] flex flex-col font-sans border-[16px] border-[#2563eb]">
            {/* Cabecera / Logos */}
            <header className="p-8 flex items-center gap-6">
                {/* LOGO DE LA UNIVERSIDAD */}
                <img src="/logo.png" alt="Logo UGRM" className="h-20 object-contain" />
                
                <div className="h-16 w-[2px] bg-gray-400"></div>
                
                <div>
                    <h2 className="text-2xl font-black text-gray-800 leading-none tracking-tighter">UNIVERSIDAD</h2>
                    <p className="text-lg font-bold text-gray-600">UGRM</p>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 items-center px-10 md:px-20 gap-10">
                
                {/* Lado Izquierdo: Texto y Botones */}
                <div className="space-y-10">
                    <h1 className="text-6xl md:text-[100px] font-black text-gray-900 leading-[0.9] tracking-tighter uppercase italic">
                        AUXILIO <br /> VEHICULAR
                    </h1>

                    <div className="flex flex-col gap-6 w-fit">
                        <button 
                            onClick={() => navigate("/login")}
                            className="px-12 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition shadow-2xl text-xl uppercase tracking-widest"
                        >
                            INICIAR SESIÓN
                        </button>

                        <button 
                            onClick={() => navigate("/registro-taller")}
                            className="max-w-xs text-left font-bold text-gray-800 text-lg hover:text-blue-700 transition leading-tight underline decoration-blue-500 decoration-2 underline-offset-4"
                        >
                            Regístrate con Nosotros para auxiliar emergencias vehiculares
                        </button>
                    </div>
                </div>

                {/* Lado Derecho: IMAGEN DE MECÁNICOS */}
                <div className="flex justify-center items-center">
                    <img 
                        src="/mecanico.png" 
                        alt="Mecánicos trabajando" 
                        className="w-full max-w-2xl drop-shadow-2xl"
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="p-10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {/* Marca de agua / Icono */}
                    <div className="text-5xl animate-spin-slow">⚙️</div>
                    <div className="text-sm border-l-2 border-gray-400 pl-4">
                        <p className="font-black uppercase text-gray-900">Desarrollo:</p>
                        <p className="font-medium text-gray-700 text-lg">Walter Rodriguez</p>
                        <p className="font-medium text-gray-700 text-lg">Alexander Acarapi</p>
                    </div>
                </div>
                <div className="text-xs opacity-40 font-bold tracking-[0.2em] uppercase text-right">
                    FACULTAD DE INGENIERÍA EN CIENCIAS DE LA COMPUTACIÓN Y TELECOMUNICACIONES <br />
                    SISTEMA DE INFORMACIÓN II - G23
                </div>
            </footer>
        </div>
    );
};

export default Home;