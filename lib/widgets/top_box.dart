import 'dart:async';
import 'package:flutter/material.dart';

class TopBox extends StatefulWidget {
  final List<String> imageUrls;
  final String keyword;

  const TopBox({super.key, required this.imageUrls, required this.keyword});

  @override
  State<TopBox> createState() => _TopBoxState();
}

class _TopBoxState extends State<TopBox> {
  int currentIndex = 0;
  Timer? timer;

  @override
  void initState() {
    super.initState();
    timer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (widget.imageUrls.isEmpty) return;
      setState(() {
        currentIndex = (currentIndex + 1) % widget.imageUrls.length;
      });
    });
  }

  @override
  void didUpdateWidget(covariant TopBox oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.imageUrls != widget.imageUrls) {
      setState(() => currentIndex = 0);
    }
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 50,
      left: 50,
      child: Container(
        width: 400,
        height: 400,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: Colors.black,
        ),
        clipBehavior: Clip.hardEdge,
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 500),
          child: widget.imageUrls.isEmpty
              ? const Center(child: CircularProgressIndicator())
              : Image.network(
                  widget.imageUrls[currentIndex],
                  key: ValueKey(widget.imageUrls[currentIndex]),
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Center(
                      child: Text(
                        "Topic:\n${widget.keyword}",
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    );
                  },
                ),
        ),
      ),
    );
  }
}