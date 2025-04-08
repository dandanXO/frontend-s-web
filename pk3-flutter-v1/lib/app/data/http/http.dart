import 'dart:async';
import 'package:dio/dio.dart';

import 'request.dart';

class HttpUtil {
  static HttpRequest httpRequest = HttpRequest();

  /// restful get 操作
  static Future get(
    String path, {
    Map<String, dynamic>? queryParameters,
    bool disableRetry = false,
    bool showLoading = false,
    bool showErrorMessage = true,
  }) async {
    return httpRequest.request(
      path: path,
      method: HttpMethod.get,
      queryParameters: queryParameters,
      disableRetry: disableRetry,
      showLoading: showLoading,
      showErrorMessage: showErrorMessage,
    );
  }

  /// restful post 操作
  Future post(
    String path, {
    Object? data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    bool disableRetry = false,
    bool showLoading = false,
    bool showErrorMessage = true,
  }) async {
    return httpRequest.request(
      path: path,
      method: HttpMethod.post,
      data: data,
      queryParameters: queryParameters,
      disableRetry: disableRetry,
      showLoading: showLoading,
      showErrorMessage: showErrorMessage,
    );
  }

  /// restful post form 表单提交操作
  Future postForm(
    String path, {
    required Map<String, dynamic> data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    bool disableRetry = false,
    bool showLoading = false,
    bool showErrorMessage = true,
  }) async {
    return post(
      path,
      data: FormData.fromMap(data),
      queryParameters: queryParameters,
      disableRetry: disableRetry,
      showLoading: showLoading,
      showErrorMessage: showErrorMessage,
    );
  }
}
