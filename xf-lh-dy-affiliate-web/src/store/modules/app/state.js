import { getSidebarStatus } from '@/utils/cookies'

export const DeviceType = {
  Mobile: 'mobile',
  Desktop: 'desktop'
}

export const state = {
  device: DeviceType.Desktop,
  sidebar: {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  }
}
