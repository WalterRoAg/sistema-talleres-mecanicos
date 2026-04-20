import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

class EsperaAuxilioScreen extends StatefulWidget {
  final String idIncidente;

  // Recibimos el ID del incidente para rastrearlo mediante Sockets
  const EsperaAuxilioScreen({super.key, this.idIncidente = "0"});

  @override
  State<EsperaAuxilioScreen> createState() => _EsperaAuxilioScreenState();
}

class _EsperaAuxilioScreenState extends State<EsperaAuxilioScreen> {
  late io.Socket socket;
  String mensajeEstado = "Buscando talleres cercanos...";
  bool tallerEncontrado = false;

  @override
  void initState() {
    super.initState();
    conectarSocket();
  }

  void conectarSocket() {
    // Configuración del socket apuntando a tu servidor Node.js
    socket = io.io('http://10.0.2.2:3000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    socket.connect();

    socket.onConnect((_) {
      print('✅ Conectado al servidor de Sockets');
      // Nos unimos a la sala del incidente específico
      socket.emit('join_incident', widget.idIncidente);
    });

    // Escuchamos el evento cuando un taller acepta la solicitud (CU23)
    socket.on('receive_message', (data) {
      if (mounted) {
        setState(() {
          mensajeEstado = "¡Taller encontrado! El mecánico está en camino.";
          tallerEncontrado = true;
        });
      }
    });

    socket.onConnectError((data) => print('❌ Error de conexión: $data'));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Fondo Slate 900
      appBar: AppBar(
        title: const Text("Estado de Auxilio",
            style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 30),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Animación de carga: Si no ha encontrado taller, gira.
            // Si encontró, mostramos un check.
            tallerEncontrado
                ? const Icon(Icons.check_circle,
                    color: Colors.greenAccent, size: 100)
                : const CircularProgressIndicator(
                    color: Colors.cyanAccent,
                    strokeWidth: 6,
                  ),

            const SizedBox(height: 40),

            Text(
              mensajeEstado,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 15),

            Text(
              "ID de Emergencia: #${widget.idIncidente}",
              style: const TextStyle(color: Colors.blueGrey, fontSize: 16),
            ),

            const SizedBox(height: 60),

            // Botón de acción
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: () {
                  // Volvemos a la pantalla anterior o al inicio de forma segura
                  Navigator.of(context).pop();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor:
                      tallerEncontrado ? Colors.cyanAccent : Colors.redAccent,
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15)),
                ),
                child: Text(
                  tallerEncontrado ? "VER DETALLES" : "CANCELAR SOLICITUD",
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 16),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    // Es vital desconectar el socket al cerrar la pantalla para no gastar memoria
    socket.disconnect();
    socket.dispose();
    super.dispose();
  }
}
