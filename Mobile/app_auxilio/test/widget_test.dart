import 'package:flutter_test/flutter_test.dart';
import 'package:app_auxilio/main.dart'; // Importa tu archivo principal

void main() {
  testWidgets('Carga inicial de la app', (WidgetTester tester) async {
    // Cambiamos MyApp por el nombre real de tu clase: AuxilioVehicularApp
    // Cambia AuxilioVehicularApp() por MyApp() o como se llame la clase en tu main.dart
    await tester.pumpWidget(const MyApp());

    // Verificamos que al menos cargue el texto de bienvenida que pusimos en main.dart
    expect(find.text('Bienvenido al Sistema'), findsOneWidget);
  });
}
