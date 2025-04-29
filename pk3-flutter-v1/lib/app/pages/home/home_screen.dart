import 'package:flutter/material.dart';
import 'package:pk3_flutter_v1/app/widgets/app_layout.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppLayout(
      title: 'Home',
      showAppBar: true,
      showBottomNav: true,
      child: const Center(child: Text('Welcome!')),
    );
  }
}
