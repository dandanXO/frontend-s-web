# Jolly88 App (tha-project)

- Node Js: >= 16.17.0

## Install the dependencies
```bash
yarn
# or
npm install
npm i pinia
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

## Android Ver.

### Build the App in Android
```bash
npm run android
```

-- AND THEN

### Go To src-capacitor:
```bash
cd src-capacitor
npm run update
```

### To Install Android .apk into Device (Need goto directory src-capacitor)
```bash
npx cap run android -l
```

### To Generate Android Icons/Splashs (You need to install cordova-res in npm 1st:)
```bash
npm install -g cordova-res
cordova-res android
```


### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).


---

## Build SPA Version. (For Android App).

### 1. Change the version no. of file '**version.js**'.


### 2. Run Quasar Command to build SPA.
```bash
quasar build
```

### 3. Run Python Command
  (Need to Install Python 3.x on your PC, and you need to change '**localDirec**' in deploy.py to your directory.)
```bash
python deploy.py
```
  (This command will rename some files in /js, /css & index.html, & paste file 'version.js')

### 4. Goto folder /dist/ , rename folder 'spa', compress & deploy it. =D

---
