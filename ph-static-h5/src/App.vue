<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useQuasar } from "quasar";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { api } from "boot/axios";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs")
    const $q = useQuasar(); // calling here; equivalent to when component
    $q.dark.set(true);
    const checkSID = () => {
      const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");
      const fpPromise = FingerprintJS.load();
      (async () => {
        const fp = await fpPromise;
        const result = await fp.get();
        const excludes = { value: ["timezone", "timeZoneOffset"] };
        const allComponents = { ...result.components };
        excludes.value.forEach((element) => {
          delete allComponents[element];
        });
        const sidParam = FingerprintJS.hashComponents(allComponents);
          const obj = {
            identifier: sidParam,
            affiliateCode: affiliateItem,
          };          
          api.post('/memberAccessLog', qs.stringify(obj)).then((res) => {
            if (res.code===0) {}
          })
      })();
    };
    onMounted(() => {
      checkSID()
    })
  }
});
</script>
