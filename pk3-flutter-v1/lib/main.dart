import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:pk3_flutter_v1/app/routes/app_pages.dart';
import 'package:pk3_flutter_v1/app/routes/app_routes.dart';
import 'package:pk3_flutter_v1/app/style/theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await GetStorage.init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        return GetMaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'My App',
          initialRoute: Routes.home,
          getPages: AppPages.routes,
          theme: AppTheme.getThemeData(),
          home: child,
        );
      },
      child: const SizedBox(),
    );
  }
}
