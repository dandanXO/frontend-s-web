import { storeToRefs } from "pinia";
import { userStore } from "src/stores";
import { onActivated, onMounted, ref } from "vue";

/**
 * Use the `useCheckKYC` function to check KYC (Know Your Customer) status
 * at specific times during the component lifecycle.
 *
 * @param {string[]} checkTiming - An array of strings specifying when to check KYC status.
 *                                 Valid values are "mounted" and "activated".
 *
 * @example
 * // Call the function with both "mounted" and "activated" timings
 * useCheckKYC(["mounted", "activated"]);
 *
 * @example
 * // Call the function with only "mounted" timing
 * useCheckKYC(["mounted"]);
 */
export const useCheckKYC = (checkTiming) => {
  const store = userStore();
  const { realName, guest } = storeToRefs(store);
  const { getMemberInfo } = store;

  const userKYCDialog = ref(false);
  const guestKYCDialog = ref(false);

  const openUserKYCDialog = () => {
    userKYCDialog.value = true;
  };
  const closeUserKYCDialog = () => {
    getMemberInfo().then(() => {
      loadInfo();
      userKYCDialog.value = false;
    });
  };

  const openGuestKYCDialog = () => {
    guestKYCDialog.value = true;
  };
  const closeGuestKYCDialog = () => {
    getMemberInfo().then(() => {
      loadInfo();
      guestKYCDialog.value = false;
    });
  };

  const loadInfo = () => {
    if (guest.value && realName.value === null) {
      openGuestKYCDialog();
    }

    if (!guest.value && realName.value === null) {
      openUserKYCDialog();
    }
  };

  onMounted(() => checkTiming.includes("mounted") && loadInfo());
  onActivated(() => checkTiming.includes("activated") && loadInfo());

  return {
    userKYCDialog,
    guestKYCDialog,
    closeGuestKYCDialog,
    closeUserKYCDialog
  };
};
