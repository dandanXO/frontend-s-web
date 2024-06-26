export default [
  {
    path: "reward",
    name: "reward",
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "reward" */ "../views/reward/RewardView.vue")
  },
  {
    path: "team-management",
    name: "team-management",
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "teamManagement" */ "../views/reward/TeamManagementView.vue")
  },
  {
    path: "team-betting",
    name: "team-betting",
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "teamBetting" */ "../views/reward/TeamBettingView.vue")
  },
  {
    path: "profit-and-loss",
    name: "profit-and-loss",
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "profitAndLoss" */ "../views/reward/ProfitAndLossView.vue")
  }
];
