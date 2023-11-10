import router, { constantRoutes, notFound } from "../../../router";

export const MenuMutationType = {
  SET_ROUTES: 'SET_ROUTES'
}

export const mutations = {
  [MenuMutationType.SET_ROUTES](state, routes) {
    state.routes = constantRoutes.concat(routes)
    state.dynamicRoutes = routes
    routes.forEach((route) => {
      router.addRoute(route);
    });
    router.addRoute(notFound)
  }
}
