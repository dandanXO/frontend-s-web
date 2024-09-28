# Live Chat Agent Console (cs-client-desktop)

- NodeJS Version >= 18 (18.18.0)

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
npm run dev
```

### Build the app for production (SPA)

```bash
npm run build
```

### Build the App for production (.exe File)

1. Change the "version" Number on package.json, "VERSION=" on .env.production
2. Run CMD:

```bash
npm run build
```

3. Use the files on /release/{version}/
