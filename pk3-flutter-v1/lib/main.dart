import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:pk3_flutter_v1/app/routes/app_pages.dart';
import 'package:pk3_flutter_v1/app/routes/app_routes.dart';
import 'package:pk3_flutter_v1/app/style/theme.dart';

Future<void> main() async {
  await GetStorage.init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'My App',
      initialRoute: Routes.home,
      getPages: AppPages.routes,
      theme: AppTheme.getThemeData(),
    );
  }
}
