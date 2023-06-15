import {defineStore} from "pinia";

export const uiStore = defineStore("ui-store", {
    state: () => {
        return {
            title: "",
            footer: true,
            orientation: 'landscape'
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
            this.orientation = 'portrait'
        },
        orientationLandscape() {
            this.orientation = 'landscape'
        },
        setTitle(title) {
            this.title = title;
        }
    }
});
