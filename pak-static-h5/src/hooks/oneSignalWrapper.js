import { useOneSignal } from "@onesignal/onesignal-vue3";
import OneSignal from "onesignal-cordova-plugin";
import { Platform } from "quasar";
import { useUI } from "src/stores/ui";
import { computed, ref } from "vue";

export const useOneSignalWrapper = () => {
  const oneSignalWeb = useOneSignal();
  const ui = useUI();

  const isOnAndroid = computed(() => Platform.is.android && Platform.is.capacitor);

  const initOneSignal = (appId) => {
    console.log("init onesignal");
    console.log(isOnAndroid.value);
    if (isOnAndroid.value) {
      initOnAndroid(appId);
    } else {
      initOnWeb(appId);
    }
  };

  const initOnAndroid = (appId) => {
    OneSignal.initialize(appId);

    let myClickListener = async function (event) {
      console.log("CLICK PUSH");
      let notificationData = event;
      console.log(notificationData);
      console.log(notificationData.notification.title);
      console.log(notificationData.notification.body);
      console.log(notificationData.notification.additionalData);
      populatePushNotificationData(notificationData.notification);
    };
    OneSignal.Notifications.addEventListener("click", myClickListener);

    // Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
    OneSignal.Notifications.requestPermission(true).then((accepted) => {
      console.log("User accepted android notifications: " + accepted);
    });
  };

  const initOnWeb = async (appId) => {
    await oneSignalWeb.init({
      appId
    });

    let myClickListener = async function (event) {
      console.log("CLICK PUSH");
      let notificationData = event;
      console.log(notificationData);
      console.log(notificationData.notification.title);
      console.log(notificationData.notification.body);
      console.log(notificationData.notification.additionalData);
      populatePushNotificationData(notificationData.notification);
    };
    oneSignalWeb.Notifications.addEventListener("click", myClickListener);

    // if (oneSignalWeb.User.PushSubscription.id) return;

    oneSignalWeb.Slidedown.promptPush()
      .then(() => console.log("enable onesignal"))
      .catch(() => console.log("disable onesignal"));
  };

  const populatePushNotificationData = (data) => {
    ui.notificationData = data;
  };

  return {
    initOneSignal
  };
};
