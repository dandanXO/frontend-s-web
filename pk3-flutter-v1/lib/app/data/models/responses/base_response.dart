import 'package:get/get.dart';

class BaseResponse {
  final int code;
  final String message;

  BaseResponse({required this.code, required this.message});

  factory BaseResponse.fromJson(Map<String, dynamic> json) {
    final int code = json['code'] ?? -1;
    final bool success = code == 0;

    final String message =
        success ? 'msg.success'.tr : (json['message'] ?? 'unknown'.tr);

    return BaseResponse(code: code, message: message);
  }
}
