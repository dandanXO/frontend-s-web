<template>
  <router-view />
</template>

<script>
/* eslint-disable */
import { defineComponent, onBeforeMount } from "vue";
import { useUserStore } from "src/cs-client-web/stores/user";

export default defineComponent({
  name: "BlankLayout",
  setup() {
    const userStore = useUserStore();

    onBeforeMount(() => {
      // console.log("LAYOUT ONLMOUNTED");

      checkLocalStorage();
    });

    function checkLocalStorage() {
      // console.log("Check Storage Status");
      let isLocalStorageEnabled = true;
      try {
        window.localStorage.setItem("lstest", "test");
        var testitem = window.localStorage.getItem("lstest");
        window.localStorage.removeItem("lstest");
        // console.log("Can Use");
        // alert(testitem);

        if (!testitem) {
          isLocalStorageEnabled = false;
        }
      } catch (e) {
        // console.log("CANNOT USE STORAGE");
        isLocalStorageEnabled = false;
      }

      // For Testing.
      // isLocalStorageEnabled= false;

      if (!isLocalStorageEnabled) {
        // LocalStorage is disabled
        // Handle the error or provide an alternative storage mechanism
        userStore.is_storage_enabled = false;
      }
    }

    return {};
  }
});
</script>
