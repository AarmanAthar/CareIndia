import 'package:flutter_tts/flutter_tts.dart';

class TTSService {
  final FlutterTts _tts = FlutterTts();

  Future<void> init() async {
    await _tts.setLanguage("en-US");
    await _tts.setSpeechRate(0.8);
    await _tts.setPitch(0.9);
    await _tts.setVoice({"name": "Google US English", "locale": "en-US"});
  }

  Future<void> setLanguage(String lang) async {
    switch (lang) {
      case "hindi":
        await _tts.setLanguage("hi-IN");
        await _tts.setVoice({"name": "Google हिन्दी", "locale": "hi-IN"});
        break;
      case "tamil":
        await _tts.setLanguage("ta-IN");
        await _tts.setVoice({"name": "Vani", "locale": "ta-IN"});
        break;
      case "telugu":
        await _tts.setLanguage("te-IN");
        await _tts.setVoice({"name": "Geeta", "locale": "te-IN"});
        break;
      case "bengali":
        await _tts.setLanguage("bn-IN");
        await _tts.setVoice({"name": "Piya", "locale": "bn-IN"});
        break;
      default:
        await _tts.setLanguage("en-US");
        await _tts.setVoice({"name": "Google US English", "locale": "en-US"});
    }
  }

  Future<void> speak(String text) async {
    await _tts.stop();
    await _tts.speak(text);
  }

  Future<void> stop() async {
    await _tts.stop();
  }
}