import 'package:flutter/material.dart';

class LanguageMenu extends StatelessWidget {
  final Function(String) onLanguageSelected;

  const LanguageMenu({super.key, required this.onLanguageSelected});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 50,
      right: 20,
      child: PopupMenuButton<String>(
        icon: const Icon(Icons.language, color: Colors.white, size: 30),
        onSelected: onLanguageSelected,
        itemBuilder: (context) => [
          const PopupMenuItem(value: "english", child: Text("English")),
          const PopupMenuItem(value: "hindi", child: Text("Hindi")),
          const PopupMenuItem(value: "tamil", child: Text("Tamil")),
          const PopupMenuItem(value: "telugu", child: Text("Telugu")),
          const PopupMenuItem(value: "bengali", child: Text("Bengali")),
        ],
      ),
    );
  }
}