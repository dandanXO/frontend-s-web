import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';

class MyFonts {
  MyFonts._();

  static double get size9 => 9.spMin;
  static double get size10 => 10.spMin;
  static double get size11 => 11.spMin;
  static double get size12 => 12.spMin;
  static double get size13 => 13.spMin;
  static double get size14 => 14.spMin;
  static double get size15 => 15.spMin;
  static double get size16 => 16.spMin;
  static double get size17 => 17.spMin;
  static double get size18 => 18.spMin;
  static double get size19 => 19.spMin;
  static double get size20 => 20.spMin;
  static double get size21 => 21.spMin;
  static double get size23 => 22.spMin;
  static double get size22 => 23.spMin;
  static double get size32 => 32.spMin;
  static double get size35 => 35.spMin;
  static double get size56 => 56.spMin;

  static double updateSize9(textSize) {
    return textSize == 'title.font_normal'.tr
        ? MyFonts.size9
        : textSize == 'title.font_big'.tr
        ? MyFonts.size13
        : textSize == 'title.font_extra_big'.tr
        ? MyFonts.size17
        : MyFonts.size9;
  }

  static double updateSize10(textSize) {
    return textSize == 'title.font_normal'.tr
        ? MyFonts.size10
        : textSize == 'title.font_big'.tr
        ? MyFonts.size14
        : textSize == 'title.font_extra_big'.tr
        ? MyFonts.size18
        : MyFonts.size10;
  }

  static double updateSize11(textSize) {
    return textSize == 'title.font_normal'.tr
        ? MyFonts.size11
        : textSize == 'title.font_big'.tr
        ? MyFonts.size15
        : textSize == 'title.font_extra_big'.tr
        ? MyFonts.size19
        : MyFonts.size11;
  }

  static double updateSize12(textSize) {
    return textSize == 'title.font_normal'.tr
        ? MyFonts.size12
        : textSize == 'title.font_big'.tr
        ? MyFonts.size16
        : textSize == 'title.font_extra_big'.tr
        ? MyFonts.size20
        : MyFonts.size12;
  }

  static double updateSize13(textSize) {
    return textSize == 'title.font_normal'.tr
        ? MyFonts.size13
        : textSize == 'title.font_big'.tr
        ? MyFonts.size17
        : textSize == 'title.font_extra_big'.tr
        ? MyFonts.size21
        : MyFonts.size13;
  }

  static double updateSize14(textSize) {
    return textSize == 'title.font_normal'.tr
        ? MyFonts.size14
        : textSize == 'title.font_big'.tr
        ? MyFonts.size18
        : textSize == 'title.font_extra_big'.tr
        ? MyFonts.size22
        : MyFonts.size14;
  }

  static double updateSize15(textSize) {
    return textSize == 'title.font_normal'.tr
        ? MyFonts.size15
        : textSize == 'title.font_big'.tr
        ? MyFonts.size19
        : textSize == 'title.font_extra_big'.tr
        ? MyFonts.size23
        : MyFonts.size15;
  }
}
