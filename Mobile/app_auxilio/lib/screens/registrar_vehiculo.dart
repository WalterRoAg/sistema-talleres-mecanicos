import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'espera_auxilio.dart';

class RegistrarVehiculoScreen extends StatefulWidget {
  const RegistrarVehiculoScreen({super.key});

  @override
  State<RegistrarVehiculoScreen> createState() =>
      _RegistrarVehiculoScreenState();
}

class _RegistrarVehiculoScreenState extends State<RegistrarVehiculoScreen> {
  File? _image; // Para guardar la foto seleccionada
  final _picker = ImagePicker();

  // Controladores para los textos
  final _placaController = TextEditingController();
  final _modeloController = TextEditingController();

  // Función para tomar o elegir foto
  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(
        source: ImageSource.gallery); // Puedes cambiar a .camera
    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: const Text("Registro de Vehículo",
            style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(25.0),
        child: Column(
          children: [
            const Text(
              "Completa los datos de tu vehículo para poder solicitar auxilio.",
              style: TextStyle(color: Colors.blueGrey, fontSize: 16),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 30),

            // Sección de la Foto (Opcional)
            // Sección de la Foto (Opcional) - CORREGIDA
            GestureDetector(
              onTap: _pickImage,
              child: Container(
                width: double.infinity,
                height: 180,
                decoration: BoxDecoration(
                  color: Colors.blueGrey
                      .withOpacity(0.1), // Cambiado 'slate' por 'blueGrey'
                  borderRadius: BorderRadius.circular(15),
                  border: Border.all(
                    color: Colors.cyanAccent.withOpacity(0.5),
                    width: 1,
                  ),
                ),
                child: _image == null
                    ? const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.add_a_photo,
                              color: Colors.cyanAccent, size: 50),
                          SizedBox(height: 10),
                          Text("Agregar foto (Opcional)",
                              style: TextStyle(color: Colors.cyanAccent)),
                        ],
                      )
                    : ClipRRect(
                        borderRadius: BorderRadius.circular(15),
                        child: Image.file(_image!, fit: BoxFit.cover),
                      ),
              ),
            ),

            const SizedBox(height: 30),

            // Campos de texto
            _buildTextField(
                _placaController, "Placa del Vehículo", Icons.vpn_key),
            const SizedBox(height: 20),
            _buildTextField(
                _modeloController, "Marca / Modelo", Icons.directions_car),

            const SizedBox(height: 40),

            // Botón Guardar
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: () {
                  // Simulación de guardado
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('✅ Vehículo registrado correctamente')),
                  );

                  // 2. Navegar a la pantalla de espera después de guardar
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const EsperaAuxilioScreen(
                          idIncidente: "101"), // ID de prueba
                    ),
                  );
                },
                child: const Text("GUARDAR VEHÍCULO",
                    style:
                        TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(
      TextEditingController controller, String label, IconData icon) {
    return TextField(
      controller: controller,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.blueGrey),
        prefixIcon: Icon(icon, color: Colors.cyanAccent),
        enabledBorder: OutlineInputBorder(
          borderSide: const BorderSide(color: Colors.blueGrey),
          borderRadius: BorderRadius.circular(12),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: const BorderSide(color: Colors.cyanAccent),
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}
