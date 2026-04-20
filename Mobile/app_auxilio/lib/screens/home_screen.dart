import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'espera_auxilio.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _detalleController = TextEditingController();
  LatLng _ubicacionActual =
      LatLng(-17.7833, -63.1821); // Santa Cruz por defecto

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      drawer: _buildDrawer(),
      body: Stack(
        children: [
          // MAPA PROFESIONAL (OpenStreetMap - Sin API KEY)
          FlutterMap(
            options: MapOptions(
              initialCenter: _ubicacionActual,
              initialZoom: 15,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              ),
              MarkerLayer(
                markers: [
                  Marker(
                    point: _ubicacionActual,
                    child: const Icon(Icons.location_on,
                        color: Colors.red, size: 40),
                  ),
                ],
              ),
            ],
          ),

          // BOTÓN MENÚ
          Positioned(
            top: 50,
            left: 20,
            child: Builder(
                builder: (context) => FloatingActionButton(
                      backgroundColor: const Color(0xFF0F172A),
                      child: const Icon(Icons.menu, color: Colors.cyanAccent),
                      onPressed: () => Scaffold.of(context).openDrawer(),
                    )),
          ),

          // PANEL DE EMERGENCIA (Automatización e IA)
          _buildEmergencySheet(),
        ],
      ),
    );
  }

  Widget _buildEmergencySheet() {
    return Align(
      alignment: Alignment.bottomCenter,
      child: Container(
        margin: const EdgeInsets.all(15),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(25),
          boxShadow: [BoxShadow(color: Colors.black54, blurRadius: 10)],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text("REPORTE DE AUXILIO IA",
                style: TextStyle(
                    color: Colors.cyanAccent,
                    fontWeight: FontWeight.bold,
                    fontSize: 16)),
            const SizedBox(height: 15),
            TextField(
              controller: _detalleController,
              maxLines: 2,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Describa el fallo técnico...",
                hintStyle: TextStyle(color: Colors.grey[500]),
                fillColor: const Color(0xFF0F172A),
                filled: true,
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(15)),
              ),
            ),
            const SizedBox(height: 15),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _mediaBtn(Icons.camera_alt, "FOTO", Colors.orange),
                _mediaBtn(Icons.mic, "AUDIO", Colors.red),
                _mediaBtn(Icons.history, "MIS AUTOS", Colors.blue),
              ],
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: _enviarEmergencia,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.cyanAccent,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15)),
                ),
                child: const Text("SOLICITAR AUXILIO AHORA",
                    style: TextStyle(
                        color: Colors.black, fontWeight: FontWeight.bold)),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const CrearEmergenciaScreen()),
                  );
                },
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _mediaBtn(IconData icon, String label, Color color) {
    return Column(
      children: [
        IconButton(onPressed: () {}, icon: Icon(icon, color: color, size: 30)),
        Text(label, style: const TextStyle(color: Colors.white, fontSize: 10)),
      ],
    );
  }

  Widget _buildDrawer() {
    return Drawer(
      backgroundColor: const Color(0xFF0F172A),
      child: Column(
        children: [
          const UserAccountsDrawerHeader(
            decoration: BoxDecoration(color: Color(0xFF1E293B)),
            accountName: Text("Walter Programador"),
            accountEmail: Text("perfil@verificado.com"),
            currentAccountPicture: CircleAvatar(
                backgroundColor: Colors.cyanAccent,
                child: Icon(Icons.person, size: 40)),
          ),
          _drawerItem(Icons.edit, "Editar Perfil"),
          _drawerItem(Icons.payment, "Métodos de Pago"),
          _drawerItem(Icons.help_outline, "Soporte Técnico"),
          const Spacer(),
          _drawerItem(Icons.logout, "Cerrar Sesión", color: Colors.redAccent),
        ],
      ),
    );
  }

  ListTile _drawerItem(IconData icon, String title,
      {Color color = Colors.cyanAccent}) {
    return ListTile(
      leading: Icon(icon, color: color),
      title: Text(title, style: const TextStyle(color: Colors.white)),
      onTap: () {},
    );
  }

  void _enviarEmergencia() {
    // Aquí iría el POST al backend para que la IA procese
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) =>
                const EsperaAuxilioScreen(idIncidente: "IA-99")));
  }
}
