# XF App (xf-static-h5)

兴發 H5+APP

## Requirements: 安装需求：

- Node Version >= 16.17.0


## Install npm 安装 npm
```bash
npm install
```

### Start the Project in development mode (在 Localhost 里打开项目)
```bash
quasar dev
```


### Build for H5 production (Build H5 的项目)
```bash
quasar build

--> /dist/spa/ 文件夹
```

### Run HotReload on Device via USB (用USB链接设备内进行 HotReload 调试)
```bash
1. Run CMD
quasar dev

2. Plug your Device, Open 2nd CMD and run: [用USB插上设备,然后CMD跑:]
cd src-capacitor
npx cap run android -l --host=192.168.XX.XX --port=9090

// 192.168.XX.XX 是 quasar dev 时在Localhost 跑着的IP地址

3. Select Your Device and click Enter. [在CMD里选择你的设备,并按Enter]

4. So it will build and run App on your device, and you can do a HotReload on it.
[这样项目会安装成App在你的设备中,你可以一边更改代码,App里的项目内容也会随着更改.]

```

### Build The App in Android. (创建安卓App)
```bash
1. RUN CMD
npm run android  [cross-env ENV_FILE=app quasar build -m capacitor -T android]

2. GOTO Folder: src-capacitor
cd src-capacitor

3. Sync Android (Sometimes You might need to RUN npm install one more time in this folder.)
npx cap sync

4(a). Build and Run on Android device. (Plug your Android device via USB, Enable Developer Option, Enable USB Debugging.)
adb devices  ##(Optional.)
npx cap run android

4(b). Build on Android Studio/ Build .apk
npx cap open android

```

### Change Android Version Name

1. open src-capacitor/android/app/build.gradle
2. Edit Version No & versionName:
  -     versionCode 7
        versionName "1.0.7"
3. Click "Sync Now" to Rebuild.


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
