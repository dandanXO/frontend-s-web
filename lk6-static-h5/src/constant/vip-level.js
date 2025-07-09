// '无'

export default {
  labels: {
    redEnvelop: '每月红包',
    deposit: '每月存送',
    birthday: '生日礼金',
    requirements: '流水要求',
  },
  levels: [
    {
      level: 1,
      monthlyRedEnvelop: false,
      monthlyDeposit: false,
      birthdayBonus: false,
      requirements: false,
      description: ">有一笔存款<br>>无保级要求"
    },
    {
      level: 2,
      monthlyRedEnvelop: 28,
      monthlyDeposit: '存款至少100元可申请每月一次再存20% 最高奖金588元',
      birthdayBonus: 38,
      requirements: 12,
      description: ">5000≤累积存款<br>>1888≤一个月内累积存款"
    },
    {
      level: 3,
      monthlyRedEnvelop: 88,
      monthlyDeposit: '存款至少100元可申请每月一次再存20% 最高奖金888元',
      birthdayBonus: 108,
      requirements: 12,
      description: ">50000≤累积存款<br>>10888≤一个月内累积存款"
    },
    {
      level: 4,
      monthlyRedEnvelop: 188,
      monthlyDeposit: '存款至少100元可申请每周一次再存25% 最高奖金888元',
      birthdayBonus: 388,
      requirements: 12,
      description: ">250000≤累积存款<br>>38888≤一个月内累积存款"
    },
    {
      level: 5,
      monthlyRedEnvelop: 388,
      monthlyDeposit: '存款至少500元可申请每月一次再存50% 最高奖金1888元',
      birthdayBonus: 688,
      requirements: 15,
      description: ">500000≤累积存款<br>>58888≤一个月内累积存款"
    },
    {
      level: 6,
      monthlyRedEnvelop: 888,
      monthlyDeposit: '存款至少500元可申请每周一次再存30% 最高奖金2888元',
      birthdayBonus: 1088,
      requirements: 15,
      description: ">2500000≤累积存款<br>>88888≤一个月内累积存款"
    },
    {
      level: 7,
      monthlyRedEnvelop: 2888,
      monthlyDeposit: '存款至少500元可申请每周一次再存35% 最高奖金3888元',
      birthdayBonus: 6888,
      requirements: 15,
      description: ">5000000≤累积存款<br>>188888≤一个月内累积存款"
    },
    {
      level: 8,
      monthlyRedEnvelop: 5888,
      monthlyDeposit: '存款至少500元可申请每周一次再存40% 最高奖金5888元',
      birthdayBonus: 8888,
      requirements: 15,
      description: ">8000000≤累积存款<br>>288888≤一个月内累积存款"
    },
    {
      level: 9,
      monthlyRedEnvelop: 6888,
      monthlyDeposit: '存款至少500元可申请每周一次再存45% 最高奖金8888元',
      birthdayBonus: 10888,
      requirements: 15,
      description: ">12000000≤累积存款<br>>588888≤一个月内累积存款"
    },
    {
      level: 10,
      monthlyRedEnvelop: 8888,
      monthlyDeposit: '存款至少500元可申请每周一次再存50% 最高奖金12888元',
      birthdayBonus: 18888,
      requirements: 15,
      description: '>20000000≤累积存款<br/>>888888≤一个月内累积存款'
    },
  ]
}



