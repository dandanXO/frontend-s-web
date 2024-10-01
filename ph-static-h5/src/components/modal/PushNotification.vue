<template>
    <dialog class="dialog-container" @click.stop="onClickDialogBackdrop" ref="pushNotificationDialog">
        <div class="content" @click.stop="onClickDialog">
            <div class="icon-wrapper">
                <img class="icon" :src="notificationData.imgUrl" />
            </div>
            <div class="title">{{ notificationData.title }}</div>
            <div class="desc">{{ notificationData.body }}</div>
            <div class="action-buttons">
                <button class="action-button close-btn" @click.stop="closeDialog">Close</button>
            </div>
        </div>
    </dialog>
</template>
    
<script lang="js">
import { defineComponent, ref, watch } from "vue";

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
            color: #111827;
            font-weight: 700;
            font-size: 18px;
        }

        .desc {
            color: #6B7280;
            font-size: 14px;
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
                border: 1px solid #D1D5DB;
                color: #374151;
                font-size: 12px;

                &.primary {
                    background-color: #0071ED;
                    color: #FFFFFF;
                }
            }
        }

        .close-btn {
            padding: 5px 0px;
            border-radius: 6px;
        }
    }


}

::backdrop {
    background-color: gray;
    opacity: 0.75;
}
</style>
    