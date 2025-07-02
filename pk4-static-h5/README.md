# PK1.GAME App (pak-h5-project)

PK1.GAME (**pak**) H5 APP

- Node Version >= 16.17.0
- H5 + Android APP

### You might need to install Quasar cli first:
```bash
npm install -g @quasar/cli
```

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production (SPA Page)
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).


### Build The App in Android.
```bash
1. build
quasar build -m capacitor -T android

2. go to folder: src-capacitor
cd src-capacitor

3. sync Android
npx cap sync

4(a). Build and Run on Android device. (Plug your Android device, Enable Developer Option, Enable USB Debugging.)
adb devices  ##(Optional.)
npx cap run android

4(b). Build on Android Studio/ Build .apk
npx cap open android

4(c). Rename - pak-app-1.0.x

```

### Run LiveReload on Device
```bash
1. Run CMD
quasar dev

2. Plug your Device, Open 2nd CMD and run:
cd src-capacitor
npx cap run android -l

3. So it will build and run App on your device, and you can do a LiveReload on it.

4. If you want to change port/host, can try RUN:
npx cap run android -l --host=192.168.10.22 --port=9090

```


### Change Android Version Name

1. open src-capacitor/android/app/build.gradle
2. Edit Version No:
  -     versionCode 36
        versionName "1.0.36"
3. Rebuild Apk.


### Build Release Version .apk
1. Open Android Studio.
2. Select Build -> Generate Signed Bundle/Apk -> Select APK.
3. Select keystore file .jks
4. Input Alias & Both Passwords
5. Build release .apk.


### Build iOS WebClip.
1. goto https://ivi.cx/
2. Insert all inputs. (Logo/Name/URL/Description/Install File Name)
3. Submit & Download file .mobileconfig


### File Directory.

- Withdrawal Dialog :: src/components/WithdrawalComponent.vue
- Deposit Dialog :: src/components/depositComponent.vue
- Message Page:: src/pages/account/MessageView.vue
- Message Detail Page:: src/pages/account/MessageDetailView.vue
- Personal Center:: src/pages/AccountPage.vue
- ForgetPwd Page:: src/pages/ForgotPwdPage.vue
- Order Page:: src/pages/account/OrderView.vue
- Add Bank Card Page:: src/pages/account/BankView.vue



### Setup CloudWise Plugin.

1. Get the PDF file & .jar Zip File from Colleague.
2. Follow the steps in PDF:
   1. Add CWPlugin
   2. Add cloudwise-mobile-distribute-2.5.1.1.jar in /libs
   3. Add use 'CWPlugin' in build.gradle
   4. Add apply 'cloudwise' in app/build.gradle (Need add  cloudwise { injectDebug = true } )
   5. Add implementation files('libs/cloudwise-mobile-distribute-2.5.1.1.jar') in app/build.gradle.
   6. Add 'READ_PHONE_STATE' & 'ACCESS_NETWORK_STATE' permission in AndroidManifest.xml.
   7. Add [MyApplication.java] from /resources/app-cloudwise/app/src/main/java/app55ace/
   8. Change the 'AppKey' token inside MyApplication.java.
   9. Add android:name=".MyApplication" in <application> tag of AndroidManifest.xml.
   10. Sync App and Build Apk and Try.
3. 如果以上步骤您无法完成，你可以:
   1. Copy 整个 /resource/app-cloudwise 进去 android Folder 并 Sync & Build App ，OR 或者
   2. 找别人帮忙。 =3=



~ 愿树懒保佑着你 ~
![](http://npr101.com/sloth/sloth7.jpg)
