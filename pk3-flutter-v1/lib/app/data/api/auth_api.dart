import 'dart:convert';
import 'package:pk3_flutter_v1/app/data/http/http.dart';
import 'package:pk3_flutter_v1/app/data/models/responses/single_response.dart';
import 'package:pk3_flutter_v1/app/data/models/responses/login_response.dart';
import 'package:pk3_flutter_v1/app/utils/app_util.dart';

class AuthApi {
  static Future<SingleResponse<LoginResponse>> login({
    required String loginName,
    required String password,
  }) async {
    Map<String, dynamic> data = {
      'loginName': loginName,
      'password': password,
      // 'way': AppUtil.getPlatform(),
      'way': 'WEB',
      'captchaCode': '0000',
      'sid': 'df2a04ed8824a4fd70f0622e1f9a22ec',
    };

    final response = await HttpUtil().post(
      '/member/login',
      data: data,
      showLoading: true,
    );

    final decoded = jsonDecode(response);

    final parsed = SingleResponse<LoginResponse>.fromJson(
      decoded,
      (d) => LoginResponse.fromJson({'token': d}),
    );

    return parsed;
  }
}
