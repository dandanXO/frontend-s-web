import { boot } from "quasar/wrappers";
import VueGtag from "vue-gtag-next";

export default boot(({ app, router }) => {
  const measurementId = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID;

  if (process.env.NODE_ENV === "production" && measurementId) {
    app.use(VueGtag, {
      property: {
        id: measurementId
      }
    });
    console.log("Google Analytics initialised.");

    router.afterEach((to) => {
      app.config.globalProperties.$gtag.pageview({
        page_title: to.meta.title || "Default Title",
        page_location: window.location.href,
        page_path: to.fullPath
      });
    });
  } else {
    console.log("Google Analytics is disabled.");
  }
});
