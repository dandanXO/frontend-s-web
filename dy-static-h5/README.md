# 新东赢 H5 App (dy-static-h5-new)

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
npx cap run android -l   
```


### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).

