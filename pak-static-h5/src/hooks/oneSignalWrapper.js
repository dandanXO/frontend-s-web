import { useOneSignal } from "@onesignal/onesignal-vue3";
import OneSignal from "onesignal-cordova-plugin";
import { Platform } from "quasar";
import { computed, ref } from "vue";

export const useOneSignalWrapper = () => {
  const oneSignalWeb = useOneSignal();

  const pushNotificationData = ref();

  const isOnAndroid = computed(() => Platform.is.android && Platform.is.capacitor);

  const initOneSignal = (appId) => {
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
      appId,
      allowLocalhostAsSecureOrigin: true
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

    oneSignalWeb.Notifications.requestPermission().then((accepted) => {
      console.log("User accepted web push notifications: " + accepted);
    });
  };

  const populatePushNotificationData = (data) => {
    pushNotificationData.value = data;
  };

  return {
    initOneSignal,
    pushNotificationData
  };
};
