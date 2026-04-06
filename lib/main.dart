import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'screens/auth_screen.dart';
import 'screens/game_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'https://spiotoavhyppaixfyinh.supabase.co',
    anonKey: 'sb_publishable_Tl6o50dm6Dhire9eSLe46Q_LyejEXUP',
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final session = Supabase.instance.client.auth.currentSession;
    return MaterialApp(
      home: session != null ? GameScreen() : const AuthScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}