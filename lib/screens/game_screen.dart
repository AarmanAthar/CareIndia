import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../widgets/background.dart';
import '../widgets/character.dart';
import '../widgets/top_box.dart';
import '../widgets/bottom_text_box.dart';
import '../services/tts_service.dart';
import '../widgets/language_menu.dart';
import 'reminder_screen.dart';

class GameScreen extends StatefulWidget {
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  final TTSService tts = TTSService();
  final SpeechToText speech = SpeechToText();

  String currentText = "How are you feeling today?";
  List<String> imageUrls = [];
  String currentKeyword = "";
  bool isListening = false;

  @override
  void initState() {
    super.initState();
    tts.init();
  }

  @override
  void dispose() {
    tts.stop();
    speech.stop();
    super.dispose();
  }

  Future<void> startListening() async {
    bool available = await speech.initialize();
    if (!available) return;

    setState(() {
      isListening = true;
      currentText = "Listening...";
    });

    speech.listen(
      onResult: (result) {
        if (result.finalResult) {
          stopListening();
          sendToBackend(result.recognizedWords);
        }
      },
    );
  }

  void stopListening() {
    speech.stop();
    setState(() => isListening = false);
  }

  void onNewResponse(String text) {
    speech.stop();
    setState(() => currentText = text);
    tts.speak(text);
  }

  Future<void> sendToBackend(String text) async {
    final url = Uri.parse(
      "https://ganglionate-unconvincedly-perla.ngrok-free.dev/process",
    );

    // Get JWT token from Supabase session
    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) {
      setState(() => currentText = "Not logged in");
      return;
    }
    final token = session.accessToken;

    try {
      setState(() {
        currentText = "Thinking...";
        imageUrls = [];
        currentKeyword = "";
      });

      final response = await http.post(
        url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode({"text": text}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        final reply = data["reply"];
        final images = List<String>.from(data["images"] ?? []);
        final keywords = List<String>.from(data["keywords"] ?? []);
        final trackerCreated = data["tracker_created"];

        setState(() {
          imageUrls = images;
          currentKeyword = keywords.isNotEmpty ? keywords[0] : (data["keyword"] ?? "");
        });

        // Show a snackbar if a tracker was just created
        if (trackerCreated != null && mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("✅ Now tracking: $trackerCreated"),
              backgroundColor: Colors.green,
            ),
          );
        }

        onNewResponse(reply);
      } else {
        setState(() => currentText = "Error getting response");
      }
    } catch (e) {
      setState(() => currentText = "Connection failed");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          const Background(),
          const Character(),

          TopBox(
            imageUrls: imageUrls,
            keyword: currentKeyword,
          ),

          LanguageMenu(
            onLanguageSelected: (lang) async {
              await tts.setLanguage(lang);
              tts.speak(currentText);
            },
          ),
        Positioned(
  top: 50,
  right: 70,
  child: IconButton(
    icon: const Icon(Icons.notifications, color: Colors.white, size: 30),
    onPressed: () => Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const ReminderScreen()),
    ),
  ),
),
          BottomTextBox(text: currentText),

          // Mic button
          Positioned(
            bottom: 160,
            left: 20,
            child: FloatingActionButton(
              backgroundColor: isListening ? Colors.red : Colors.blue,
              onPressed: isListening ? stopListening : startListening,
              child: Icon(isListening ? Icons.mic : Icons.mic_none),
            ),
          ),
        ],
      ),
    );
  }
}