import 'package:flutter/material.dart';
import 'package:pk3_flutter_v1/app/style/style.dart';

class AppTheme {
  static getThemeData() {
    return ThemeData(appBarTheme: CustomStyle.getAppBarTheme());
  }
}
