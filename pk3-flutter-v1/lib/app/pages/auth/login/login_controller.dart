import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:pk3_flutter_v1/app/data/api/auth_api.dart';

class LoginController extends GetxController {
  // Observable loginName and password
  final loginName = ''.obs;
  final password = ''.obs;

  void login() async {
    final response = await AuthApi.login(
      loginName: loginName.value,
      password: password.value,
    );

    print(response.data?.token);
    final storage = GetStorage();
    storage.write('token', response.data?.token);
  }
}
