import 'package:get/get.dart';
import 'base_response.dart';

class SingleResponse<T> extends BaseResponse {
  final T? data;

  SingleResponse({required super.code, required super.message, this.data});

  factory SingleResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? create,
  ) {
    final int code = json['code'] ?? -1;
    final bool success = code == 0;

    final String message =
        success ? 'msg.success'.tr : (json['message'] ?? 'unknown'.tr);

    T? parsedData;
    final dynamic rawData = json['data'];

    if (rawData != null && create != null) {
      try {
        parsedData = create(rawData);
      } catch (e) {
        print('[SingleResponse] Data parse error: $e');
      }
    }

    return SingleResponse<T>(code: code, message: message, data: parsedData);
  }
}
