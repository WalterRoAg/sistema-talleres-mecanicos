import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

// Importamos las pantallas necesarias
import 'registrar_vehiculo.dart';
import 'home_screen.dart'; // Tu panel principal con mapa
// import 'register_user.dart'; // Para el futuro botón de registro de cuenta

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;
  String _mensaje = "";

  Future<void> login() async {
    if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
      setState(() => _mensaje = "⚠️ Por favor, llena todos los campos");
      return;
    }

    setState(() {
      _isLoading = true;
      _mensaje = "";
    });

    try {
      final url = Uri.parse('http://10.0.2.2:3000/api/auth/login');

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'correo_electronico': _emailController.text.trim(),
          'contrasena': _passwordController.text,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        setState(() => _mensaje = "✅ ¡Bienvenido!");

        // Lógica de decisión profesional:
        // El backend debe devolver si el usuario ya tiene vehículo registrado
        bool tieneVehiculo = data['usuario']['tieneVehiculo'] ?? false;

        Future.delayed(const Duration(seconds: 1), () {
          if (!mounted) return;

          if (tieneVehiculo) {
            // SI YA TIENE VEHÍCULO: Va al panel principal (Mapa)
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const HomeScreen()),
            );
          } else {
            // SI NO TIENE: Debe registrar uno primero
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                  builder: (context) => const RegistrarVehiculoScreen()),
            );
          }
        });
      } else {
        // Manejo de errores dinámico según el backend
        setState(() =>
            _mensaje = "❌ ${data['mensaje'] ?? 'Credenciales incorrectas'}");
      }
    } catch (e) {
      setState(
          () => _mensaje = "📡 Error: No se pudo conectar con el servidor");
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Slate 900
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(30.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.car_repair, size: 80, color: Colors.cyanAccent),
              const SizedBox(height: 20),
              const Text(
                "AUXILIO VEHICULAR",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  fontStyle: FontStyle.italic,
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                "Inicia sesión para continuar",
                style: TextStyle(color: Colors.blueGrey),
              ),
              const SizedBox(height: 40),

              // Campo Correo
              _buildTextField(
                controller: _emailController,
                label: "Correo Electrónico",
                icon: Icons.email_outlined,
              ),
              const SizedBox(height: 20),

              // Campo Password
              _buildTextField(
                controller: _passwordController,
                label: "Contraseña",
                icon: Icons.lock_outline,
                isPassword: true,
              ),

              const SizedBox(height: 30),

              // Botón Ingresar
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : login,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.cyanAccent,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                              color: Colors.black, strokeWidth: 2),
                        )
                      : const Text("INGRESAR",
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ),

              const SizedBox(height: 20),

              // OPCIÓN: REGISTRARSE
              TextButton(
                onPressed: () {
                  // Navigator.push(context, MaterialPageRoute(builder: (context) => RegisterUserScreen()));
                },
                child: const Text(
                  "¿No tienes cuenta? Regístrate aquí",
                  style: TextStyle(color: Colors.cyanAccent, fontSize: 14),
                ),
              ),

              const SizedBox(height: 10),
              Text(_mensaje,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      color: _mensaje.contains('✅')
                          ? Colors.greenAccent
                          : Colors.redAccent,
                      fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }

  // Widget auxiliar para mantener el código limpio
  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool isPassword = false,
  }) {
    return TextField(
      controller: controller,
      obscureText: isPassword,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.cyanAccent),
        prefixIcon: Icon(icon, color: Colors.cyanAccent, size: 20),
        enabledBorder: const OutlineInputBorder(
            borderSide: BorderSide(color: Colors.blueGrey),
            borderRadius: BorderRadius.all(Radius.circular(12))),
        focusedBorder: const OutlineInputBorder(
            borderSide: BorderSide(color: Colors.cyanAccent),
            borderRadius: BorderRadius.all(Radius.circular(12))),
      ),
    );
  }
}
