// import 'package:amico/app/middleware/index.dart';
import 'package:pk3_flutter_v1/app/pages/index.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'index.dart';

class AppPages {
  static final RouteObserver<Route> observer = RouteObservers();
  static List<String> history = [];

  static _pageBuilder({
    required String name,
    required GetPageBuilder page,
    Bindings? binding,
    Transition? transition,
    List<GetMiddleware>? middlewares,
    bool preventDuplicates = true,
  }) => GetPage(
    name: name,
    page: page,
    popGesture: true,
    binding: binding,
    transition: transition ?? Transition.cupertino,
    middlewares: middlewares,
    preventDuplicates: preventDuplicates,
  );

  static final List<GetPage> routes = [
    _pageBuilder(
      name: Routes.login,
      page: () => const LoginScreen(),
      binding: LoginBinding(),
    ),
  ];
}
