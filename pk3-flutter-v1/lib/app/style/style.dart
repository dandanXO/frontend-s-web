import 'package:flutter/material.dart';
import 'package:pk3_flutter_v1/app/style/dark_theme_colors.dart';
import 'package:pk3_flutter_v1/app/style/my_fonts.dart';

class CustomStyle {
  static AppBarTheme getAppBarTheme() => AppBarTheme(
    elevation: 0,
    backgroundColor: DarkThemeColors.themeColor,
    titleTextStyle: TextStyle(
      color: DarkThemeColors.primaryText,
      fontSize: MyFonts.size18,
      fontWeight: FontWeight.bold,
    ),
    // iconTheme: getPrimaryIconTheme(),
  );
}
