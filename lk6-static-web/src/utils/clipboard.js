import { uiStore } from "@/store/ui";

const requestClipboardPermission = () => {
  return navigator.permissions.query({
    name: "clipboard-write"
  });
};

export const writeClipboard = async (content, useExecCommand = false) => {
  const ui = uiStore();
  try {
    if (window.isSecureContext && navigator.clipboard && !useExecCommand) {
      const permission = await requestClipboardPermission();
      if (permission.state !== "granted") throw new Error();
      await navigator.clipboard.writeText(content);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = content;
      textArea.style.position = "absolute";
      textArea.style.opacity = "0";
      document.body.prepend(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    ui.notify({
      type: "success",
      message: "复制成功"
    });
  } catch (error) {
    if (!useExecCommand) {
      await writeClipboard(content, true);
    } else {
      ui.notify({
        type: "error",
        message: "复制失败"
      });
    }
  }
};
