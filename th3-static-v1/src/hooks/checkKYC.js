import { storeToRefs } from "pinia";
import { userStore } from "src/stores";
import { useUI } from "src/stores/ui";
import { nextTick, onActivated, onMounted, ref } from "vue";

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
export const useCheckKYC = (checkTiming = [], kycUserFormRef) => {
  const store = userStore();
  const { realName, guest, phone } = storeToRefs(store);
  const { getMemberInfo } = store;
  const ui = useUI();

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

  const loadInfo = async () => {
    switch (ui.siteType) {
      case "CURACAO":
        const savedAddress = localStorage.getItem("PAK_ADDRESS");
        if (!savedAddress) openUserKYCDialog();
        break;
      default:
        if (realName.value === null || phone.value === null) {
          if (guest.value) {
            openGuestKYCDialog();
          } else {
            openUserKYCDialog();
          }
        }
    }
    await nextTick();
    if (kycUserFormRef.value) {
      kycUserFormRef.value.loadCurrentInfo();
    }
  };

  onMounted(() => checkTiming.includes("mounted") && loadInfo());
  onActivated(() => checkTiming.includes("activated") && loadInfo());

  return {
    userKYCDialog,
    guestKYCDialog,
    loadInfo,
    openUserKYCDialog,
    openGuestKYCDialog,
    closeGuestKYCDialog,
    closeUserKYCDialog
  };
};
