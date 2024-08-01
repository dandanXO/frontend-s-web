# # VNM H5 Vue3 (vnm-static-h5)

- Node Version >= 16.17.0
- H5 + Embed pages for APP


### You might need to install Quasar cli first:
```bash
npm install -g @quasar/cli
```

## Install the dependencies
```bash
npm install
```

### Start the app in development mode.
```bash
quasar dev
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
npx cap run android -l --host=192.168.79.69 --port=9090

```

### Build the app for production
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
npx cap run android -l

4(b). Build on Android Studio/ Build .apk
npx cap open android

```

### Change Android Version Name

1. open src-capacitor/android/app/build.gradle
2. Edit Version No:  (+1 to versionCode & versionName)
  -     versionCode 9
  -     versionName "1.0.9"
3. Build Apk.


### Build 'Release' Version .apk
1. Open Android Studio.
2. Select Build -> Generate Signed Bundle/Apk -> Select APK.
3. Select keystore file .jks
4. Input Alias & Both Passwords (You may find the passwords/Alias from some file Or ask other to get.)
5. Build release .apk.


### Build iOS WebClip.
1. goto https://ivi.cx/
2. Insert all inputs. (Logo/Name/URL/Description/Install File Name)
3. Submit & Download file .mobileconfig
