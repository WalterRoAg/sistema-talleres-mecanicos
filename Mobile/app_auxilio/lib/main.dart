import 'package:flutter/material.dart';
import 'screens/login.dart';
import 'screens/registrar_vehiculo.dart';
import 'screens/home_screen.dart';
import 'screens/espera_auxilio.dart';

void main() => runApp(const AuxilioApp());

class AuxilioApp extends StatelessWidget {
  const AuxilioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Auxilio Vehicular IA',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: Colors.cyanAccent,
        scaffoldBackgroundColor: const Color(0xFF0F172A),
      ),
      // Definimos las rutas para que el Navigator sepa a dónde ir
      initialRoute: '/',
      routes: {
        '/': (context) => LoginScreen(),
        '/registro_auto': (context) => const RegistrarVehiculoScreen(),
        '/home': (context) => const HomeScreen(),
      },
    );
  }
}
