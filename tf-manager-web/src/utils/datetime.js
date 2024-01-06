/* eslint-disable */
import moment from 'moment/moment'

// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

export const getShortcuts = t => {
  return [
    {
      text: t('fields.today'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(
          moment(start)
            .startOf('day')
            .format('x')
        )
        return [start, end]
      },
    },
    {
      text: t('fields.yesterday'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(
          moment(start)
            .subtract(1, 'days')
            .startOf('day')
            .format('x')
        )
        end.setTime(
          moment(end)
            .subtract(1, 'days')
            .endOf('day')
            .format('x')
        )
        return [start, end]
      },
    },
    {
      text: t('fields.thisWeek'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(
          moment(start)
            .startOf('isoWeek')
            .format('x')
        )
        return [start, end]
      },
    },
    {
      text: t('fields.lastWeek'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(
          moment(start)
            .subtract(1, 'weeks')
            .startOf('isoWeek')
            .format('x')
        )
        end.setTime(
          moment(end)
            .subtract(1, 'weeks')
            .endOf('isoWeek')
            .format('x')
        )
        return [start, end]
      },
    },
    {
      text: t('fields.thisMonth'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(
          moment(start)
            .startOf('month')
            .format('x')
        )
        return [start, end]
      },
    },
    {
      text: t('fields.lastMonth'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(
          moment(start)
            .subtract(1, 'months')
            .startOf('month')
            .format('x')
        )
        end.setTime(
          moment(end)
            .subtract(1, 'months')
            .endOf('month')
            .format('x')
        )
        return [start, end]
      },
    },
    {
      text: t('fields.last3Months'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(
          moment(start)
            .subtract(2, 'months')
            .startOf('month')
            .format('x')
        )
        return [start, end]
      },
    },
  ]
}

export const getLogShortcuts = t => {
  return [
    {
      text: t('fields.last5Min'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(
          moment(start)
            .subtract(5, 'minutes')
            .format('x')
        )
        return [start, end]
      },
    },
    {
      text: t('fields.last15Min'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(
          moment(start)
            .subtract(15, 'minutes')
            .format('x')
        )
        return [start, end]
      },
    },
    {
      text: t('fields.last30Min'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(
          moment(start)
            .subtract(30, 'minutes')
            .format('x')
        )
        return [start, end]
      },
    },
    {
      text: t('fields.last1Hour'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(
          moment(start)
            .subtract(1, 'hours')
            .format('x')
        )
        return [start, end]
      },
    },
  ]
}

export const convertDateToStart = date => {
  var m = moment(date)
  m.set({ hour: 0, minute: 0, second: 0 })
  return m.format('YYYY-MM-DD HH:mm:ss')
}

export const convertDateToEnd = date => {
  var m = moment(date)
  m.set({ hour: 23, minute: 59, second: 59 })
  return m.format('YYYY-MM-DD HH:mm:ss')
}
