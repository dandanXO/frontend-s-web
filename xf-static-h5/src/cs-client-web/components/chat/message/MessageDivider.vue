<template>
  <div class="strike q-py-lg">
    <span v-if="label">{{ label }}</span>
  </div>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "MessageDivider",
  props: {
    label: {
      type: String,
      default: '',
    }
  },
  setup() {
    return {
      //
    }
  }
});
</script>

<style scoped>
.strike {
  display: block;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  line-height: 1;
  width: 50%;
  margin: 0 auto;
}

.strike > span {
  position: relative;
  display: inline-block;
  font-size: .75rem;
}

.strike > span:before,
.strike > span:after {
  content: "";
  position: absolute;
  top: 50%;
  width: 9999px;
  height: 1px;
  background: #9e9e9e;
}

.strike > span:before {
  right: 100%;
  margin-right: 15px;
}

.strike > span:after {
  left: 100%;
  margin-left: 15px;
}
</style>
