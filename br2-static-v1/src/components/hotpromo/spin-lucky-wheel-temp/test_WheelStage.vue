// src/components/hotpromo/spin-lucky-wheel-temp/test_WheelStage.vue
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import WheelStage from './WheelStage.vue'
import { nextTick } from 'vue'

// Mock i18n $t
const t = (key) => key

// Mock Pinia store
vi.mock('src/stores', () => ({
  userStore: () => ({
    currency: { value: 'R$' }
  })
}))

// Mock Quasar
vi.mock('quasar', () => ({
  useQuasar: () => ({
    notify: vi.fn()
  })
}))

// Mock eventapi
const postMock = vi.fn()
const getMock = vi.fn()
vi.mock('src/boot/axios', () => ({
  eventapi: {
    post: postMock,
    get: getMock
  }
}))

// Mock child components
vi.mock('./WheelResultDialog.vue', () => ({
  default: {
    name: 'WheelResultDialog',
    template: '<div class="mock-dialog"></div>',
    props: ['modelValue', 'prize']
  }
}))
vi.mock('./RecordDialog.vue', () => ({
  default: {
    name: 'RecordDialog',
    template: '<div class="mock-record-dialog"></div>',
    props: ['modelValue']
  }
}))
vi.mock('./CashOutPopup.vue', () => ({
  default: {
    name: 'CashOutPopup',
    template: '<div class="mock-cashout-popup"></div>',
    props: ['modelValue']
  }
}))
vi.mock('./SharePopup.vue', () => ({
  default: {
    name: 'SharePopup',
    template: '<div class="mock-share-popup"></div>',
    props: ['modelValue']
  }
}))
vi.mock('./withdrawDialog/GradientTextAmount.vue', () => ({
  default: {
    name: 'RedGradientTextAmount',
    template: '<span class="mock-gradient-amount"></span>',
    props: ['amountText']
  }
}))

// Mock moment
vi.mock('moment-timezone', async () => {
  const moment = (date) => {
    const d = date ? new Date(date) : new Date()
    return {
      format: () => '01-01 12:00:00',
      diff: () => 3600,
      isAfter: () => false,
      tz: () => moment(),
      add: () => moment(),
      startOf: () => moment(),
      min: () => moment(),
      max: () => moment()
    }
  }
  moment.tz = () => moment()
  moment.min = () => moment()
  moment.max = () => moment()
  return { default: moment }
})

// Mock inject/provide
vi.mock('vue', async (importOriginal) => {
  const vue = await importOriginal()
  return {
    ...vue,
    inject: (key) => (key === 'extractionDifference' ? 0 : undefined)
  }
})

describe('WheelStage.vue', () => {
  let info
  let wrapper

  beforeEach(() => {
    // Reset mocks
    postMock.mockReset()
    getMock.mockReset()
    info = {
      availableSpin: 1,
      accumulatedBonus: 10,
      claimBonus: 5,
      wheelEndTime: new Date(Date.now() + 3600 * 1000).toISOString(),
      wheelResetTime: new Date(Date.now() + 7200 * 1000).toISOString()
    }
    getMock.mockResolvedValue({ code: 0, data: [
      { recordTime: Date.now(), loginName: 'User123', bonus: 0.05 }
    ] })
    postMock.mockResolvedValue({ code: 0, data: 0.05 })
    // Mount component
    wrapper = mount(WheelStage, {
      props: { info },
      global: {
        mocks: { $t: t }
      },
      attachTo: document.body // Needed for ref DOM
    })
    // Mock spinWheelRef DOM
    wrapper.vm.spinWheelRef = {
      style: { transform: '', transition: '' }
    }
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders with correct available spins', () => {
    expect(wrapper.find('.btn').text()).toBe('1')
  })

  it('spins the wheel and shows result dialog', async () => {
    vi.useFakeTimers()
    // Click spin button
    await wrapper.find('.btn').trigger('click')
    // Should disable button
    expect(wrapper.vm.spinButtonDisable).toBe(true)
    // Simulate animation frames and timeouts
    for (let i = 0; i < 120; i++) {
      vi.advanceTimersByTime(50)
      await nextTick()
    }
    // Wait for result dialog open delay
    vi.advanceTimersByTime(1000)
    await flushPromises()
    expect(wrapper.vm.showResultDialog).toBe(true)
    vi.useRealTimers()
  })

  it('does not spin if no availableSpin', async () => {
    await wrapper.setProps({ info: { ...info, availableSpin: 0 } })
    await wrapper.find('.btn').trigger('click')
    expect(postMock).not.toHaveBeenCalled()
  })

  it('shows winning record', async () => {
    await flushPromises()
    expect(wrapper.find('.winning-record-item').exists()).toBe(true)
    expect(wrapper.find('.winning-record-item .name').text()).toBe('User123')
  })
})// src/components/hotpromo/spin-lucky-wheel-temp/test_WheelStage.vue
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import WheelStage from './WheelStage.vue'
import { nextTick } from 'vue'

// Mock i18n $t
const t = (key) => key

// Mock Pinia store
vi.mock('src/stores', () => ({
  userStore: () => ({
    currency: { value: 'R$' }
  })
}))

// Mock Quasar
vi.mock('quasar', () => ({
  useQuasar: () => ({
    notify: vi.fn()
  })
}))

// Mock eventapi
const postMock = vi.fn()
const getMock = vi.fn()
vi.mock('src/boot/axios', () => ({
  eventapi: {
    post: postMock,
    get: getMock
  }
}))

// Mock moment
vi.mock('moment-timezone', async () => {
  const moment = (date) => {
    const d = date ? new Date(date) : new Date()
    return {
      format: () => '01-01 12:00:00',
      diff: () => 3600,
      isAfter: () => false,
      tz: () => moment(),
      add: () => moment(),
      startOf: () => moment(),
      min: () => moment(),
      max: () => moment()
    }
  }
  moment.tz = () => moment()
  moment.min = () => moment()
  moment.max = () => moment()
  return { default: moment }
})

// Mock inject/provide
vi.mock('vue', async (importOriginal) => {
  const vue = await importOriginal()
  return {
    ...vue,
    inject: (key) => (key === 'extractionDifference' ? 0 : undefined)
  }
})

describe('WheelStage.vue', () => {
  let info

  beforeEach(() => {
    // Reset mocks
    postMock.mockReset()
    getMock.mockReset()
    info = {
      availableSpin: 1,
      accumulatedBonus: 10,
      claimBonus: 5,
      wheelEndTime: new Date(Date.now() + 3600 * 1000).toISOString(),
      wheelResetTime: new Date(Date.now() + 7200 * 1000).toISOString()
    }
    getMock.mockResolvedValue({ code: 0, data: [] })
  })

  it('renders with correct available spins', async () => {
    const wrapper = mount(WheelStage, {
      props: { info },
      global: {
        mocks: { $t: t }
      }
    })
    expect(wrapper.find('.btn').text()).toBe('1')
  })

  it('spins the wheel and shows result dialog', async () => {
    // Mock API response for spin
    postMock.mockResolvedValue({ code: 0, data: 0.05 })
    // Mount component
    const wrapper = mount(WheelStage, {
      props: { info },
      global: {
        mocks: { $t: t }
      }
    })
    // Mock spinWheelRef DOM
    wrapper.vm.spinWheelRef = { style: { transform: '', transition: '' } }
    // Click spin button
    await wrapper.find('.btn').trigger('click')
    // Should disable button
    expect(wrapper.vm.spinButtonDisable).toBe(true)
    // Fast-forward timers for animation and dialog
    vi.useFakeTimers()
    // Simulate animation frames and timeouts
    for (let i = 0; i < 100; i++) {
      vi.advanceTimersByTime(50)
      await nextTick()
    }
    // Wait for result dialog open delay
    vi.advanceTimersByTime(1000)
    await flushPromises()
    expect(wrapper.vm.showResultDialog).toBe(true)
    vi.useRealTimers()
  })

  it('does not spin if no availableSpin', async () => {
    info.availableSpin = 0
    const wrapper = mount(WheelStage, {
      props: { info },
      global: {
        mocks: { $t: t }
      }
    })
    await wrapper.find('.btn').trigger('click')
    expect(postMock).not.toHaveBeenCalled()
  })
})