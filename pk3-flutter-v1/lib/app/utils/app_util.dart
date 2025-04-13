import 'package:get/get.dart';

class AppUtil {
  // Get platform name
  static String getPlatform() {
    if (GetPlatform.isMobile && GetPlatform.isWeb) {
      return 'H5';
    } else if (GetPlatform.isAndroid) {
      return 'ANDROID';
    } else if (GetPlatform.isIOS) {
      return 'IOS';
    } else if (GetPlatform.isWindows) {
      return 'WIN';
    } else if (GetPlatform.isMacOS) {
      return 'MAC';
    }

    return 'WEB';
  }
}
