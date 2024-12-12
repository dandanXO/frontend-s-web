window.OneSignalDeferred = window.OneSignalDeferred || [];
OneSignalDeferred.push(async function (OneSignal) {
  await OneSignal.init({
    appId: "db54d6ef-c432-43ba-9e1b-c58464ae0283"
  });
  OneSignal.Slidedown.promptPush();
});
