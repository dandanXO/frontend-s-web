# Jolly88 App (ph-project)

APP

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


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
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
cd src-cacitor

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
2. Edit Version No: 
  -     versionCode 7
        versionName "1.0"
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
