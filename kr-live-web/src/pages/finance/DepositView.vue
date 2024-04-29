<template>
  <div>
    <DepositComponent/>
  </div>
</template>
<script>
import {defineComponent} from "vue";
import DepositComponent from "components/depositComponent.vue";
import {useRouter} from "vue-router";

export default defineComponent({
  components: {
    DepositComponent,
    // RiCloseLine
  },
  setup() {
    const router = useRouter();

    const goBack = () => {
      router.go(-1);
    }


    return {
      goBack
    }
  }
});
</script>
