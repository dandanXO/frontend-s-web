import { getAllBankCard } from "@/api/personal/bank";
import { userStore } from "@/store";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export const usePersonalIntegrity = () => {
  const store = userStore();
  const router = useRouter();
  const { t } = useI18n();
  const { realName, registeredWithdrawPassword } = storeToRefs(store);

  const checkIsGotBankCard = async () => {
    try {
      const res = await getAllBankCard();
      if (res.code !== 0) return false;
      return !!res.data.length;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const checkPersonalInfoIntegrity = async () => {
    if (!realName.value) {
      ElMessage.error(t("message.message_no_real_name"));
      router.push("/center/personal");
      return;
    }

    if (!registeredWithdrawPassword.value) {
      ElMessage.error(t("message.message_no_withdraw_password"));
      router.push({
        path: "/center/personal",
        query: {
          name: "chgWithdrawPwd"
        }
      });
      return;
    }

    const hasBankCard = await checkIsGotBankCard();

    if (!hasBankCard) {
      ElMessage.error(t("message.message_no_bank_card"));
      router.push({
        path: "/center/personal",
        query: {
          name: "Bank"
        }
      });
      return;
    }
  };

  return checkPersonalInfoIntegrity;
};
