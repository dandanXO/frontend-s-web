import 'package:dio/dio.dart';

enum HttpMethod { get, post }

class HttpRequest {
  late Dio _dio;

  HttpRequest() {
    BaseOptions options = BaseOptions(
      baseUrl:
          'https://ap74kfn.oeni3qou4f.com', // 🔁 replace with your base URL
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      contentType: Headers.formUrlEncodedContentType,
    );

    _dio = Dio(options);
  }

  Future<dynamic> request({
    required String path,
    required HttpMethod method,
    Object? data,
    Map<String, dynamic>? queryParameters,
    bool disableRetry = false,
    bool showLoading = false,
    bool showErrorMessage = true,
  }) async {
    try {
      if (showLoading) {
        // You can show loading overlay here (optional)
        print('[HttpRequest] Loading...');
      }

      final Options options = Options(headers: {'authorization': 'PK3'});

      late Response response;

      switch (method) {
        case HttpMethod.get:
          response = await _dio.get(path, queryParameters: queryParameters);
          break;
        case HttpMethod.post:
          response = await _dio.post(
            path,
            data: data,
            queryParameters: queryParameters,
            options: options,
          );
          break;
      }

      return response.data;
    } on DioException catch (e) {
      if (showErrorMessage) {
        print('[HttpRequest] Error: ${e.response?.data ?? e.message}');
      }
      // Optionally rethrow or handle retry here
      rethrow;
    } finally {
      if (showLoading) {
        // Hide loading overlay here (optional)
        print('[HttpRequest] Loading complete.');
      }
    }
  }
}
