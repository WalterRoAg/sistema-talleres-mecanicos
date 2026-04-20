import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'espera_auxilio.dart';

class CrearEmergenciaScreen extends StatefulWidget {
  const CrearEmergenciaScreen({super.key});

  @override
  State<CrearEmergenciaScreen> createState() => _CrearEmergenciaScreenState();
}

class _CrearEmergenciaScreenState extends State<CrearEmergenciaScreen> {
  final TextEditingController _descController = TextEditingController();
  bool _hizoPrechequeo = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Reportar Incidente")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("1. Descripción del problema",
                style: TextStyle(
                    fontWeight: FontWeight.bold, color: Colors.cyanAccent)),
            TextField(
                controller: _descController,
                decoration: const InputDecoration(
                    hintText: "Ej: El motor calienta y sale humo")),
            const SizedBox(height: 25),
            const Text("2. Prechequeo Guiado (IA)",
                style: TextStyle(
                    fontWeight: FontWeight.bold, color: Colors.cyanAccent)),
            CheckboxListTile(
              title: const Text("¿El motor intenta arrancar?"),
              value: _hizoPrechequeo,
              onChanged: (val) => setState(() => _hizoPrechequeo = val!),
            ),
            const SizedBox(height: 25),
            const Text("3. Evidencia Multimedia",
                style: TextStyle(
                    fontWeight: FontWeight.bold, color: Colors.cyanAccent)),
            Row(
              children: [
                ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.camera_alt),
                    label: const Text("Foto")),
                const SizedBox(width: 10),
                ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.mic),
                    label: const Text("Audio")),
              ],
            ),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.cyanAccent),
                onPressed: () {
                  // RECIÉN AQUÍ, después de llenar datos, vamos a la espera
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const EsperaAuxilioScreen(
                              idIncidente: "INC-505")));
                },
                child: const Text("ENVIAR SOLICITUD A TALLERES",
                    style: TextStyle(color: Colors.black)),
              ),
            )
          ],
        ),
      ),
    );
  }
}
