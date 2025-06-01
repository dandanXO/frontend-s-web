import { ElMessageBox } from "element-plus"
import { useI18n } from "vue-i18n"

export const useReconfirm = (callback, options = {}) => {
  const { t } = useI18n()

  const confirm = (...args) => {
    ElMessageBox.confirm(
      options.message || t('message.confirmToAction'),
      options.title || t('fields.notice'),
      {
        confirmButtonText: t('fields.confirm'),
        cancelButtonText: t('fields.cancel'),
        type: 'info',
      }
    ).then(() => {
      // eslint-disable-next-line
      callback(...args)
    }).catch(() => {})
  }

  return confirm
}
