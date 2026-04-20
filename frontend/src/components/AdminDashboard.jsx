import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GestionTaller from "./GestionTaller"; // Asegúrate de crear este archivo

const API_URL = "http://localhost:3000/api/admin/reporte-general";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // --- ESTADO PARA CONTROLAR LA VISTA ---
  const [vista, setVista] = useState("dashboard"); 

  const [data, setData] = useState({
    incidentes: [],
    resumen_financiero: {
      comisiones_acumuladas: 0,
      servicios_pagados: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("No se pudo obtener la información");
      const json = await res.json();

      setData({
        incidentes: json.incidentes || [],
        resumen_financiero: json.resumen_financiero || {
          comisiones_acumuladas: 0,
          servicios_pagados: 0,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const incidentesFiltrados = useMemo(() => {
    return data.incidentes.filter((item) => {
      const texto = `${item.id_incidente} ${item.cliente} ${item.nombre_taller} ${item.estado_servicio}`
        .toLowerCase()
        .trim();
      return texto.includes(search.toLowerCase());
    });
  }, [data.incidentes, search]);

  const totalIncidentes = data.incidentes.length;
  const pendientes = data.incidentes.filter(x => x.estado_servicio?.toLowerCase() === "pendiente").length;
  const completados = data.incidentes.filter(x => x.estado_servicio?.toLowerCase() === "atendido").length;

  const badgeColor = (estado) => {
    const e = estado?.toLowerCase();
    if (e === "pendiente") return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
    if (e === "en proceso") return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    if (e === "atendido") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    return "bg-slate-500/15 text-slate-300 border-slate-500/30";
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      {/* SIDEBAR */}
      <aside className="w-72 border-r border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 flex flex-col justify-between fixed h-full">
        <div>
          <div className="mb-10">
            <h1 className="text-2xl font-black tracking-tight">
              AUXILIO <span className="text-cyan-400">VEHICULAR</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">Panel Administrativo</p>
          </div>

          <nav className="space-y-3">
            <button 
              onClick={() => setVista("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${
                vista === "dashboard" 
                ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-300" 
                : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              📊 Dashboard
            </button>

            {/* BOTÓN TALLER ACTUALIZADO */}
            <button 
              onClick={() => setVista("taller")}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${
                vista === "taller" 
                ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-300" 
                : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              🛠️ Taller
            </button>

            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition text-slate-400">
              👨‍🔧 Técnicos
            </button>

            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition text-slate-400">
              🚨 Incidentes
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
        >
          🚪 Cerrar sesión
        </button>
      </aside>

      {/* CONTENT AREA */}
     {/* CONTENT AREA */}
<main className="flex-1 ml-72 p-8">
  
  {/* SALUDO PERSONALIZADO Y TÍTULO */}
  <div className="mb-8 flex justify-between items-end border-b border-slate-800 pb-6">
    <div>
      <h3 className="text-cyan-500 font-bold uppercase tracking-[0.3em] text-xs mb-2 italic">
        Sesión Iniciada: {JSON.parse(localStorage.getItem('usuario'))?.rol || 'Taller'}
      </h3>
      <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic">
        {JSON.parse(localStorage.getItem('usuario'))?.nombre_completo || 'Mi Taller'}
      </h2>
      <p className="text-slate-400 mt-2 font-medium">
        Bienvenido al Centro de Control de <span className="text-slate-200">Auxilio Vehicular</span>
      </p>
    </div>
    
    <div className="hidden lg:block text-right">
      <span className="text-slate-500 text-xs font-bold uppercase block">Estado del Sistema</span>
      <span className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        Servidor En Línea
      </span>
    </div>
  </div>

  {/* RENDERIZADO CONDICIONAL SEGÚN LA VISTA SELECCIONADA */}

        
        {/* RENDERIZADO CONDICIONAL SEGÚN LA VISTA SELECCIONADA */}
        {vista === "dashboard" ? (
          <>
            {/* CABECERA DASHBOARD */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
              <div>
                <h2 className="text-4xl font-black tracking-tight">Dashboard General</h2>
                <p className="text-slate-400 mt-1">Monitoreo financiero y operativo en tiempo real</p>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Buscar cliente, taller, estado..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl outline-none focus:border-cyan-400 w-80"
                />
                <button onClick={cargarDatos} className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition">
                  Actualizar
                </button>
              </div>
            </div>

            {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>}

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
              <Card title="Comisiones Totales" value={`Bs. ${data.resumen_financiero.comisiones_acumuladas}`} color="text-yellow-400" icon="💰" />
              <Card title="Servicios Pagados" value={data.resumen_financiero.servicios_pagados} color="text-cyan-400" icon="📈" />
              <Card title="Pendientes" value={pendientes} color="text-orange-400" icon="⏳" />
              <Card title="Atendidos" value={completados} color="text-emerald-400" icon="✅" />
            </div>

            {/* TABLA */}
            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg">Historial de Operaciones</h3>
                <span className="text-sm text-slate-400">Total registros: {totalIncidentes}</span>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                    <tr>
                      <th className="px-5 py-4 text-left">ID</th>
                      <th className="px-5 py-4 text-left">Cliente</th>
                      <th className="px-5 py-4 text-left">Taller</th>
                      <th className="px-5 py-4 text-left">Estado</th>
                      <th className="px-5 py-4 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="text-center py-10 text-slate-400">Cargando información...</td></tr>
                    ) : incidentesFiltrados.length > 0 ? (
                      incidentesFiltrados.map((i) => (
                        <tr key={i.id_incidente} className="border-t border-slate-800 hover:bg-slate-800/60 transition">
                          <td className="px-5 py-4 font-mono text-cyan-400">#{i.id_incidente}</td>
                          <td className="px-5 py-4 font-semibold">{i.cliente}</td>
                          <td className="px-5 py-4 text-slate-300">{i.nombre_taller || "---"}</td>
                          <td className="px-5 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs border font-bold ${badgeColor(i.estado_servicio)}`}>
                              {i.estado_servicio}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="font-bold text-white">Bs. {i.monto_total}</div>
                            <div className="text-xs text-rose-400">Com. Bs. {i.comision_plataforma}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" className="text-center py-10 text-slate-500">No se encontraron registros</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* VISTA DEL COMPONENTE GESTION TALLER */
          <GestionTaller />
        )}
      </main>
    </div>
  );
};

const Card = ({ title, value, icon, color }) => (
  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 hover:-translate-y-1 transition shadow-lg shadow-black/20">
    <div className="text-sm text-slate-400 mb-3 font-medium uppercase tracking-wider">{title}</div>
    <div className="flex items-center justify-between">
      <h3 className={`text-3xl font-black ${color}`}>{value}</h3>
      <span className="text-2xl p-2 bg-slate-800 rounded-lg">{icon}</span>
    </div>
  </div>
);

export default AdminDashboard;