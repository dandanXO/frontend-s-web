<template>
  <div class="sticky-date-wrapper">
    <span
      ref="dateRef"
      id="date-label"
      class="sticky-date-text rounded-borders bg-grey-2"
    ></span>
  </div>
</template>

<script>
import {defineComponent, ref, watch, onMounted} from "vue";

export default defineComponent({
  name: "FloatDateLabel",
  props: {
    scrollTop: {
      type: Number,
      default: 0,
    },
    target: {type: String, required: true},
  },
  setup(props) {
    const dateRef = ref(null);

    onMounted(() => {
      dateRef.value.style.opacity = "0";
    });

    watch(
      () => props.scrollTop,
      () => {
        const dateLabels = document.querySelectorAll(props.target);
        let currentLabel = null;

        dateLabels.forEach((dateLabel) => {
          if (props.scrollTop >= dateLabel.offsetTop - 20) {
            currentLabel = dateLabel;
          }
        });

        if (currentLabel) {
          dateRef.value.style.opacity = "1";
          dateRef.value.innerText = currentLabel.innerText;
        } else {
          dateRef.value.style.opacity = "0";
        }
      }
    );

    return {dateRef};
  },
});
</script>

<style lang="scss" scoped>
.sticky-date-wrapper {
  position: relative;
  top: 0.5em;
  text-align: center;
  z-index: 1000;

  .sticky-date-text {
    display: inline-block;
    padding: 8px 8px;
    border-radius: 4px;
    background: rgba(245, 245, 245, 0.95) !important;
    font-size: smaller;
    font-weight: 500;
    line-height: 1;
  }
}
</style>
