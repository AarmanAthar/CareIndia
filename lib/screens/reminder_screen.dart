import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../services/notification_service.dart';

class ReminderScreen extends StatefulWidget {
  const ReminderScreen({super.key});

  @override
  State<ReminderScreen> createState() => _ReminderScreenState();
}

class _ReminderScreenState extends State<ReminderScreen> {
  TimeOfDay selectedTime = const TimeOfDay(hour: 9, minute: 0);
  bool isSaving = false;
  bool reminderOn = true;

  @override
  void initState() {
    super.initState();
    loadSavedTime();
  }

  Future<void> loadSavedTime() async {
    final prefs = await SharedPreferences.getInstance();
    final hour = prefs.getInt('reminder_hour') ?? 9;
    final minute = prefs.getInt('reminder_minute') ?? 0;
    final on = prefs.getBool('reminder_on') ?? true;
    setState(() {
      selectedTime = TimeOfDay(hour: hour, minute: minute);
      reminderOn = on;
    });
  }

  Future<void> pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: selectedTime,
    );
    if (picked != null) setState(() => selectedTime = picked);
  }

  Future<void> saveReminder() async {
    setState(() => isSaving = true);

    // Save locally
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('reminder_hour', selectedTime.hour);
    await prefs.setInt('reminder_minute', selectedTime.minute);
    await prefs.setBool('reminder_on', reminderOn);

    // Save to Supabase so it persists across reinstalls
    final user = Supabase.instance.client.auth.currentUser;
    if (user != null) {
      await Supabase.instance.client.from('reminders').upsert({
        'user_id': user.id,
        'hour': selectedTime.hour,
        'minute': selectedTime.minute,
        'enabled': reminderOn,
      });
    }

    // Schedule or cancel
    if (reminderOn) {
      await NotificationService.scheduleDailyReminder(selectedTime);
    } else {
      await NotificationService.cancelReminder();
    }

    setState(() => isSaving = false);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(reminderOn
              ? "✅ Reminder set for ${selectedTime.format(context)} daily!"
              : "🔕 Reminder turned off"),
          backgroundColor: reminderOn ? Colors.green : Colors.grey,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: const Text("Daily Reminder",
            style: TextStyle(color: Colors.white)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                "When should I check in with you?",
                style: TextStyle(color: Colors.white, fontSize: 22),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              GestureDetector(
                onTap: reminderOn ? pickTime : null,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      vertical: 20, horizontal: 40),
                  decoration: BoxDecoration(
                    border: Border.all(
                        color: reminderOn ? Colors.blue : Colors.grey),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    selectedTime.format(context),
                    style: TextStyle(
                      color: reminderOn ? Colors.white : Colors.grey,
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                reminderOn ? "Tap to change time" : "Reminder is off",
                style: const TextStyle(color: Colors.white38),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Enable daily reminder",
                      style: TextStyle(color: Colors.white, fontSize: 16)),
                  Switch(
                    value: reminderOn,
                    onChanged: (val) => setState(() => reminderOn = val),
                    activeColor: Colors.blue,
                  ),
                ],
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: isSaving ? null : saveReminder,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: isSaving
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text("Save Reminder",
                          style: TextStyle(fontSize: 16, color: Colors.white)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}