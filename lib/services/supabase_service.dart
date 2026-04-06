import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  static final _client = Supabase.instance.client;

  static User? get currentUser => _client.auth.currentUser;

  // AUTH
  static Future<void> signUp(String email, String password) async {
    await _client.auth.signUp(email: email, password: password);
  }

  static Future<void> signIn(String email, String password) async {
    await _client.auth.signInWithPassword(email: email, password: password);
  }

  static Future<void> signOut() async {
    await _client.auth.signOut();
  }

  // TRACKERS
  static Future<List<Map<String, dynamic>>> getUserTrackers() async {
    final data = await _client
        .from('trackers')
        .select()
        .order('created_at', ascending: true);
    return List<Map<String, dynamic>>.from(data);
  }

  static Future<void> createTracker(String name, String unit) async {
    await _client.from('trackers').insert({
      'user_id': currentUser!.id,
      'name': name,
      'unit': unit,
    });
  }

  // READINGS
  static Future<void> logReading(
      String trackerId, double value, String aiFeedback) async {
    await _client.from('readings').insert({
      'tracker_id': trackerId,
      'user_id': currentUser!.id,
      'value': value,
      'ai_feedback': aiFeedback,
    });
  }

  static Future<List<Map<String, dynamic>>> getRecentReadings(
      String trackerId, {int limit = 7}) async {
    final data = await _client
        .from('readings')
        .select()
        .eq('tracker_id', trackerId)
        .order('recorded_at', ascending: false)
        .limit(limit);
    return List<Map<String, dynamic>>.from(data);
  }
}