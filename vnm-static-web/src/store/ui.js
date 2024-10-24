import { EDITION } from "@/constant/edition";
import { defineStore } from "pinia";
import { getAppDownloadUrlFromServer } from "@/api/index/site";

export const uiStore = defineStore("ui-store", {
  state: () => {
    return {
      title: "",
      footer: true,
      orientation: "landscape",
      isFetchingDownloadUrl: false,
      downloadUrl: "",
      maintenanceStartTime: "",
      maintenanceEndTime: "",
      edition: sessionStorage.getItem("HOME_EDITION") || EDITION.NORMAL
    };
  },
  actions: {
    setScrollPosition: (axis = "vertical", offset = 0, duration = 0) => null,
    hiddenFooter() {
      this.footer = false;
    },
    showFooter() {
      this.footer = true;
    },
    orientationPotrait() {
      this.orientation = "portrait";
    },
    orientationLandscape() {
      this.orientation = "landscape";
    },
    setTitle(title) {
      this.title = title;
    },
    getAppDownloadUrl() {
      this.isFetchingDownloadUrl = true;
      this.downloadUrl = getAppDownloadUrlFromServer().then((res) => {
        this.isFetchingDownloadUrl = false;
        return res.downloadPageUrl
      }).catch((err) => {
          console.log(err);
          this.isFetchingDownloadUrl = false;
        }).finally(() => {
          this.isFetchingDownloadUrl = false;
        });
    }
  }
});
