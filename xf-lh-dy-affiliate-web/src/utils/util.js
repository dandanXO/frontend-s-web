// import vueDefaultConfig from "../config/vue.custom.config";

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};
export const getDevice = () => {
  return isMobile() ? "MOBILE" : "WEB";
};

// export const showTips = (name) => {
//   const menus = vueDefaultConfig.showTipsMenu;
//   return menus.includes(name);
// }
