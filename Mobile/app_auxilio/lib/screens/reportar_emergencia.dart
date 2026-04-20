import 'package:http/http.dart' as http; // Asegúrate de tener este import
import 'package:flutter/material.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';

import '../services/location_service.dart';
//import 'dart:io';

class ReportarEmergencia extends StatefulWidget {
  const ReportarEmergencia({super.key});
  @override
  State<ReportarEmergencia> createState() => _ReportarEmergenciaState();
}

class _ReportarEmergenciaState extends State<ReportarEmergencia> {
  final AudioRecorder audioRecorder = AudioRecorder();
  final TextEditingController _descripcionController = TextEditingController();
  String? audioPath;
  bool isRecording = false;
  String _coordenadas = "Obteniendo ubicación...";
  double? _lat, _lng;

  @override
  void initState() {
    super.initState();
    _cargarUbicacion();
  }

  _cargarUbicacion() async {
    try {
      final position = await LocationService().determinarPosicion();
      setState(() {
        _lat = position.latitude;
        _lng = position.longitude;
        _coordenadas = "Lat: $_lat, Lng: $_lng";
      });
    } catch (e) {
      setState(() => _coordenadas = "Error de GPS");
    }
  }

  Future<void> _toggleRecording() async {
    if (isRecording) {
      final path = await audioRecorder.stop();
      setState(() {
        isRecording = false;
        audioPath = path;
      });
    } else {
      if (await audioRecorder.hasPermission()) {
        final directory = await getApplicationDocumentsDirectory();
        final path =
            '${directory.path}/evidencia_${DateTime.now().millisecondsSinceEpoch}.m4a';
        const config = RecordConfig();
        await audioRecorder.start(config, path: path);
        setState(() {
          isRecording = true;
          audioPath = null;
        });
      }
    }
  }

  // Función para enviar datos al Backend (Módulo 4)
  Future<void> enviarReporte() async {
    if (_lat == null || _lng == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Esperando ubicación GPS...")),
      );
      return;
    }

    try {
      var uri = Uri.parse('http://10.0.2.2:3000/api/incidentes/reportar');
      var request = http.MultipartRequest('POST', uri);

      request.fields['id_usuario'] = '1';
      request.fields['id_vehiculo'] = '1';
      request.fields['lat'] = _lat.toString();
      request.fields['lng'] = _lng.toString();
      request.fields['descripcion'] = _descripcionController.text;

      if (audioPath != null) {
        request.files
            .add(await http.MultipartFile.fromPath('audio', audioPath!));
      }

      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("✅ Auxilio solicitado. Esperando IA...")),
        );
      } else {
        print("Error del servidor: ${response.body}");
      }
    } catch (e) {
      print("Error de red: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Reportar Emergencia')),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            Card(
              child: ListTile(
                leading: const Icon(Icons.location_on, color: Colors.red),
                title: Text("Ubicación Detectada (CU8)"),
                subtitle: Text(_coordenadas),
              ),
            ),
            SizedBox(height: 20),
            Container(
              padding: EdgeInsets.all(15),
              decoration: BoxDecoration(
                  border:
                      Border.all(color: isRecording ? Colors.red : Colors.grey),
                  borderRadius: BorderRadius.circular(10)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(isRecording
                      ? "Grabando ruido..."
                      : (audioPath != null
                          ? "Audio capturado ✅"
                          : "Grabar audio (CU10)")),
                  IconButton(
                    icon: Icon(isRecording ? Icons.stop : Icons.mic,
                        color: isRecording ? Colors.red : Colors.blue),
                    onPressed: _toggleRecording,
                  )
                ],
              ),
            ),
            SizedBox(height: 20),
            TextField(
              controller: _descripcionController,
              decoration: InputDecoration(
                  labelText: "Descripción (CU11)",
                  border: OutlineInputBorder()),
              maxLines: 2,
            ),
            Spacer(),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  minimumSize: Size(double.infinity, 60)),
              onPressed: enviarReporte, // Llamamos a la función de arriba
              child: Text("ENVIAR AUXILIO INMEDIATO",
                  style: TextStyle(
                      color: Colors.white, fontWeight: FontWeight.bold)),
            )
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    audioRecorder.dispose();
    _descripcionController.dispose();
    super.dispose();
  }
}
