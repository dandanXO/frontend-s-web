import 'core-js/stable';
import 'regenerator-runtime/runtime';

// 👇 补全 append 兼容（Android 6 会缺）
(function () {
  if (!Element.prototype.append) {
    Element.prototype.append = function append() {
      const argArr = Array.prototype.slice.call(arguments);
      const docFrag = document.createDocumentFragment();
      argArr.forEach(function (argItem) {
        const isNode = argItem instanceof Node;
        docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
      });
      this.appendChild(docFrag);
    };
  }
})();
