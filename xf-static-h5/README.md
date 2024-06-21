# XF App (xf-static-h5)

兴發 H5+APP

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


### Build the app for H5 production
```bash
quasar build
```

### Run LiveReload on Device
```bash
1. Run CMD
quasar dev

2. Plug your Device, Open 2nd CMD and run:
cd src-capacitor
npx cap run android -l

3. Select Your Device and click Enter.

4. So it will build and run App on your device, and you can do a LiveReload on it.

5. If you want to change port/host, can try RUN: (You need to change IP to your own IP.)
npx cap run android -l --host=192.168.79.69 --port=9090

```

### Build The App in Android.
```bash
1. build
npm run build   [cross-env ENV_FILE=app quasar build -m capacitor -T android]

2. go to folder: src-capacitor
cd src-capacitor

3. sync Android
npx cap sync

4(a). Build and Run on Android device. (Plug your Android device, Enable Developer Option, Enable USB Debugging.)
adb devices  ##(Optional.)
npx cap run android

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
