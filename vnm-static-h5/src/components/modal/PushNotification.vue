<template>
  <dialog class="dialog-container" @click.stop="onClickDialogBackdrop" ref="pushNotificationDialog">
    <div class="content" @click.stop="onClickDialog">
      <div class="icon-wrapper">
        <img class="icon" :src="notificationData.imgUrl" />
      </div>
      <div class="title">{{ notificationData.title }}</div>
      <div class="desc">{{ notificationData.body }}</div>
      <div class="action-buttons">
        <q-btn class="common-large-btn" no-caps @click.stop="closeDialog">Close</q-btn>
      </div>
    </div>
  </dialog>
</template>

<script lang="js">
import { defineComponent, onMounted, ref, watch } from "vue";

export default defineComponent({
  name: "AssistancePopupView",
  components: {
  },
  props: ['pushNotificationData'],
  setup(props) {
      const notificationData = ref({});
      const pushNotificationDialog = ref();

      const onClickDialog = () => {
          console.log('clicked dialog');
      }

      const onClickDialogBackdrop = () => {
          console.log('clicked backdrop');
          if(pushNotificationDialog.value.open) {
              closeDialog();
          }
      }

      const closeDialog = () => {
          pushNotificationDialog.value.close();
      }

      watch(() => props.pushNotificationData, () => {
          if(!!props.pushNotificationData.title && !!props.pushNotificationData.body) {
              notificationData.value = props.pushNotificationData;
              pushNotificationDialog.value.showModal();
          }
      });

      return {
          closeDialog,
          notificationData,
          onClickDialog,
          onClickDialogBackdrop,
          pushNotificationDialog
      };
  },
});
</script>

<style scoped lang="scss">
.dialog-container {
  border: 0;
  border-radius: 6px;
  background:linear-gradient(180deg, #ffffff 0%, #e4efff 100%);
  color: #333;
  text-align: center;
  width: 100%;

  .content {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .icon-wrapper {
      display: flex;
      justify-content: center;

      .icon {
        max-width: 100px;
      }
    }

    .title {
      font-weight: 700;
      font-size: 19px;
    }

    .desc {
      font-size: 16px;
      max-height: 300px;
      overflow-y: auto;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 10px;

      .action-button {
        min-width: 100px;
        width: 100%;
        height: 38px;
        background-color: #fff;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        color: #374151;
        font-size: 12px;

        &.primary {
          background-color: #0071ed;
          color: #ffffff;
        }
      }
    }

    .close-btn {
      padding: 5px 0px;
      border-radius: 6px;
    }
  }
}

.btn-style-dialog-confirm {
  background: linear-gradient(187.94deg, rgba(255, 255, 255, 0.8) 5.77%, #8eb5ff 93.57%);
  color: #4a38b9;
  font-weight: bold;
}

::backdrop {
  background-color: gray;
  opacity: 0.75;
}
</style>
