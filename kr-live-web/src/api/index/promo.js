import { server } from "/src/utils/request";

export function loadPromo() {
  return server.REST.get("/promo/page");
}

export function loadPromoBanner(category) {
  return server.REST.get("/promo/banner", {
    params: {
      category: category
    }
  });
}
