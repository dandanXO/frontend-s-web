import { boot } from 'quasar/wrappers';
import { StatusBar , Style} from '@capacitor/status-bar';
import { Platform } from "quasar";

export default boot(({ app }) => {
  // Check if running in Capacitor environment
  if (app.config.globalProperties.$q.platform.is.capacitor) {
    document.addEventListener('deviceready', async () => {
      console.log('Capacitor runtime is ready');

      // Ensure Quasar DOM/UI is fully initialized
      app.config.globalProperties.$nextTick(async () => {
        if (Platform.is.capacitor && Platform.is.android) {
          await StatusBar.hide();
          await StatusBar.setOverlaysWebView({ overlay: true })
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setOverlaysWebView({ overlay: true });

          console.log('StatusBar overlay enabled');
        }
      });
    });
  }
});
