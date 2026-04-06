import 'package:flutter/material.dart';

class Character extends StatelessWidget {
  const Character({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SizedBox(
        height: MediaQuery.of(context).size.height * 0.9,
        child: Image.asset(
          "assets/images/Doctor.png",
          fit: BoxFit.contain,
        ),
      ),
    );
  }
}