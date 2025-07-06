# LK6 App (lk6-static-h5-new)

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



### Build Android APK App.
```bash
quasar build -m capacitor -T android
cd src-capacitor
npx cap sync
npx cap update android


npx cap open android     (OR)
npx cap run android
```


### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).



### Fix ERR_SSL_PROTOCOL_ERROR on some Android App:


-- src-capacitor\android\capacitor-cordova-android-plugins\src\main\java\org\apache\cordova\inappbrowser\InAppBrowser.java

```bash
super.onReceivedSslError(view, handler, error);

 ##, below add:

handler.proceed();
return;

## AND THEN COMMENT all try{}catch{}handle.cancel() codes below.

```
