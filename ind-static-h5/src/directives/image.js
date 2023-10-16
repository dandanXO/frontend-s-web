export const image = {
  beforeMount(el, binding) {
    checkImage(el, binding);
  },
  updated(el, binding) {
    checkImage(el, binding);
  },
};

const checkImage = async (el, binding) => {
  let imgURL = binding.value; //获取图片地址
  if (imgURL) {
    let exist = await imageIsExist(imgURL);
    if (exist) {
      el.setAttribute("src", imgURL);
    }
  }
};

const imageIsExist = function (url) {
  return new Promise((resolve) => {
    let img = new Image();
    img.onload = function () {
      if (this.complete == true) {
        resolve(true);
        img = null;
      }
    };
    img.onerror = function () {
      resolve(false);
      img = null;
    };
    img.src = url;
  });
};
