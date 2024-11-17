const routes = [
  {
    path: '/',
    redirect: '/r/1'
  },
  {
    path: "/r/:affiliate",
    component: () => import("src/pages/RedirectPage.vue"),
    name: 'redirect'
  },
];

export default routes;
