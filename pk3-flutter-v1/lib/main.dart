import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:pk3_flutter_v1/app/routes/app_pages.dart';
import 'package:pk3_flutter_v1/app/routes/app_routes.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'My App',
      initialRoute: Routes.login,
      getPages: AppPages.routes,
    );
  }
}
