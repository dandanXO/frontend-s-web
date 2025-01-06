var winW = $(window).width();
var winH = $(window).height();


$(window).resize(function () {
  var winW = $(window).width();
  var winH = $(window).height();
});

$(document).ready(function () {

  tabItemToggle();
  navHeightToggle();
  navLinkTrigger();
  seeAllJobPositions();
  switchPackage();
  getDownloadUrl();

  var jobApply = document.querySelectorAll(".ja-apply");
  jobApply.forEach(function (button) {
    button.addEventListener("click", function (event) {
      var title = this.closest(".ja-box").querySelector("h4").innerText;
      document.getElementById("modalTitle").innerText = "Application: " + title;
    });
  });

  var packageApply = document.querySelectorAll(".package-apply");
  packageApply.forEach(function (button) {
    button.addEventListener("click", function (event) {
      var packageTitle =
          this.closest(".package-col").querySelector(".package-title").innerText;
      document.getElementById("modalTitle").innerText =
          "Trial: " + packageTitle;

      var switchPackage = $('input[name="switchOne"]:checked').val();

      this.closest(".package-col").querySelector(".package-title").innerText;
      document.getElementById("selectedPackage").innerText =
          packageTitle + " | " + switchPackage;
    });
  });

  let counterAnimated = false;

  if ($("#aos_anchor_figure").length > 0) {
    window.addEventListener("scroll", () => {
      const anchor = document.getElementById("aos_anchor_figure");
      const rect = anchor.getBoundingClientRect();
      if (
          rect.top <= window.innerHeight &&
          rect.bottom >= 0 &&
          !counterAnimated
      ) {
        numberCounter();
        counterAnimated = true;
      }
    });
  }

  // navAddBg();

  if ($(this).scrollTop() > 0) {
    $(".minigame-nav").addClass("nav-bg");
  } else {
    $(".minigame-nav").removeClass("nav-bg");
  }

  $(window).scroll(function () {
    if ($(this).scrollTop() > 0) {
      $(".minigame-nav").addClass("nav-bg");
    } else {
      $(".minigame-nav").removeClass("nav-bg");
    }
  });

  $(window).on("load", function () {
    $("#loader-wrapper").fadeOut(700);
  });

  window.onload = function () {
    setTimeout(function () {
      $("#fadeinContent").remove();
      AOS.init();
    }, 1000);
  };

  $("#i-accept").on("click", function () {
    if (localStorage.hidecookiebar !== "1") {
      $("#cookie-notice").hide();
      localStorage.hidecookiebar = "1";
    }
  });
  if (localStorage.hidecookiebar == "1") {
    $("#cookie-notice").hide();
  }

  $("#contactFormId").submit((e) => submitContactForm(e));

  $("#subscribeFormId").submit((e) => submitSubscribeForm(e));

  $("#downloadFormId").submit((e) => submitDownloadForm(e));

  $("#applyJobFormId").submit((e) => submitJonApplyForm(e));

  $("#applyPackageFormId").submit((e) => submitPackageApplyForm(e));

  $(".open-qr-code1").click(function(e){
    $("#qrcodeWrap2").show();
  })
  $(".open-qr-code2").click(function(e){
    $("#qrcodeWrap1").show();
  })

  $(document).on("click", function(event) {
    if (!$(event.target).closest("#qrcodeWrap1, .open-qr-code2").length) {
      // If the click is outside both the trigger and target div, hide the target div
      $("#qrcodeWrap1").hide();
    }
    if (!$(event.target).closest("#qrcodeWrap2, .open-qr-code1").length) {
      // If the click is outside both the trigger and target div, hide the target div
      $("#qrcodeWrap2").hide();
    }
  });

  $(".copy-btn").click(function (e) {
    var copyAddr = $(this).data("url");

    var oInput = document.createElement('input');
    oInput.value = copyAddr;
    document.body.appendChild(oInput);
    oInput.select(); // é€‰æ‹©å¯¹è±¡
    document.execCommand("Copy"); // æ‰§è¡Œæµè§ˆå™¨å¤åˆ¶å‘½ä»¤
    oInput.className = 'oInput';
    oInput.style.display = 'none';
    alert('链接已复制.');
  })

  $(".download-btn").click(function(e){
    var downloadUrl = $(this).data("url");
    // alert(downloadUrl);

    const link = document.createElement("a");
    link.style.display = "none";
    link.href = downloadUrl;
    link.target= "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  })

});

async function getDownloadUrl() {
  try {
    const response = await fetch(`https://im-rest.lq56svo1rg.com/getDownloadUrl`);
    const data = await response.json();
    if (data) {
      console.log("data", data);
      const {android, ios, win, mac} = data.data;
      console.log(android)

      $("#xiazai0").attr("data-url", win);
      $("#xiazai1").attr("data-url", mac)
      $("#xiazai2").attr("data-url", ios)
      $("#xiazai3").attr("data-url", android);


      $("#copy-id0").attr("data-url", win);
      $("#copy-id1").attr("data-url", mac)
      $("#copy-id2").attr("data-url", ios)
      $("#copy-id3").attr("data-url", android);


      new QRCode(document.getElementById("qrcodeIco"), {
        text: android,
        width: 150,
        height: 150,
      });

      new QRCode(document.getElementById("qrcodeIco2"), {
        text: ios,
        width: 150,
        height: 150,
      });

    }
  } catch (error) {
    console.log(error)
  }
}

function submitJonApplyForm(e) {
  // console.log(e.target);
  e.preventDefault();
  $(".btn-close-mobal").click();

  Swal.fire(
    "We have received your job application and will respond to you as soon as possible.",
    "",
    ""
  );
  console.log(e);
  $(".form-group input").val("");
}

function submitContactForm(e) {
  // console.log(e.target);
  e.preventDefault();

  Swal.fire(
    "We have received your message and will respond to you as soon as possible.",
    "",
    ""
  );
  console.log(e);
  $(".form-group input").val("");
  $(".form-group textarea").val("");
}

function submitSubscribeForm(e) {
  // console.log(e.target);
  e.preventDefault();

  Swal.fire(
    "We have received your message and will respond to you as soon as possible.",
    "",
    ""
  );
  console.log(e);
  $("#emailInput").val("");
}

function submitDownloadForm(e) {
  console.log(e.target);
  e.preventDefault();

  Swal.fire(
    "We have received your message and will respond to you as soon as possible.",
    "",
    ""
  );
  $("#emailRequestDemoInput").val();
}

function submitPackageApplyForm(e) {
  // console.log(e.target);
  e.preventDefault();
  $(".btn-close-mobal").click();

  Swal.fire(
    "We have received your trial submission and will respond to you as soon as possible.",
    "",
    ""
  );
  console.log(e);
  $(".form-group input").val("");
}

const tabItemToggle = () => {
  // Set the default active tab
  // $(".tab-item:first").addClass("active");
  $(".tab-item[tabtarget='#product_voxis']").addClass("active");
  $(".tab-item[tabtarget='#product_all']").addClass("mobile-active");

  // Show the corresponding product showcase for the active tab
  $(".product-showcase:first").removeClass("d-none");

  // Toggle the active class on click
  $(".tab-item").click(function () {
    // Remove the active class from all tab items
    $(".tab-item").removeClass("active mobile-active");
    // Add the active class to the clicked tab item
    $(this).addClass("active mobile-active");

    // Hide all product showcases
    $(".product-showcase").addClass("d-none");
    // Show the corresponding product showcase for the clicked tab item
    var target = $(this).attr("tabtarget");

    if (target === "#product_all") {
      $(".product-showcase").removeClass("d-none");
    } else {
      $(target).removeClass("d-none");
    }

    // Prevent default link behavior
    return false;
  });

  // Check if the webpage's screen width is considered mobile
  const isMobile = window.innerWidth <= 992;

  // Remove the "d-none" class from ".product-showcase" if it's mobile
  if (isMobile) {
    $(".product-showcase").removeClass("d-none");
  }
};

const numberCounter = () => {
  // Number counter
  $(".count").each(function () {
    $(this)
      .prop("Counter", 0)
      .animate(
        {
          Counter: $(this).text(),
        },
        {
          duration: 5000,
          easing: "swing",
          step: function (now) {
            now = Number(Math.ceil(now)).toLocaleString("en");
            $(this).text(now);
          },
        }
      );
  });
};

const navHeightToggle = () => {
  $(".navbar-toggler").click(function () {
    if ($(this).attr("aria-expanded") === "true") {
      $(".minigame-nav").removeClass("openNav");
      $(this).parent().parent().addClass("openNav");
      $("body").css("overflow", "hidden");
    } else {
      $(".minigame-nav").removeClass("openNav");
      $("body").css("overflow", "auto");
    }
  });
};

const navLinkTrigger = () => {
  $(".nav-link").click(function () {
    if ($(this).hasClass("dropdown-toggle") || winW > 992) {
      // return false;
    } else {
      $(".navbar-toggler").trigger("click");
      $(".minigame-nav").removeClass("openNav");
      $("body").css("overflow", "auto");
    }
  });
};

const seeAllJobPositions = (e) => {
  $("#seeAllJobPositions").click(function (e) {
    e.preventDefault();
    if ($(".job-available-container").hasClass("job-swipeable")) {
      $(".job-available-container").removeClass("job-swipeable");
      $("#seeAllTxt").addClass("d-none");
      $("#seeLessTxt").removeClass("d-none");
    } else {
      $(".job-available-container").addClass("job-swipeable");
      $("#seeAllTxt").removeClass("d-none");
      $("#seeLessTxt").addClass("d-none");
    }
  });
};

const navAddBg = () => {
  if ($(this).scrollTop() > 0) {
    $(".minigame-nav").addClass("nav-bg");
  } else {
    $(".minigame-nav").removeClass("nav-bg");
  }
};

const switchPackage = () => {
  // Bind change event to all radio buttons with name="switchOne"
  $('input[name="switchOne"]').change(function () {
    // Get the selected value
    var selectedValue = $(this).val();

    if (selectedValue === "Monthly") {
      $('input[name="switchOne"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .find(".package-price .dollar-amt")
        .html("48");

      $('input[name="switchTwo"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .find(".package-price .dollar-amt")
        .html("78");
    }

    if (selectedValue === "Annually") {
      $('input[name="switchOne"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .find(".package-price .dollar-amt")
        .html("36");

      $('input[name="switchTwo"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .find(".package-price .dollar-amt")
        .html("58");
    }

    // Set the selected value for all radio buttons with name="switchTwo" and name="switchThree"
    $('input[name="switchTwo"]').val([selectedValue]);
    $('input[name="switchThree"]').val([selectedValue]);
  });

  // Bind change event to all radio buttons with name="switchTwo"
  $('input[name="switchTwo"]').change(function () {
    // Get the selected value
    var selectedValue = $(this).val();

    if (selectedValue === "Monthly") {
      $('input[name="switchOne"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .find(".package-price .dollar-amt")
        .html("48");

      $('input[name="switchTwo"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .find(".package-price .dollar-amt")
        .html("78");
    }

    if (selectedValue === "Annually") {
      $('input[name="switchOne"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .find(".package-price .dollar-amt")
        .html("36");

      $('input[name="switchTwo"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .find(".package-price .dollar-amt")
        .html("58");
    }

    // Set the selected value for all radio buttons with name="switchOne" and name="switchThree"
    $('input[name="switchOne"]').val([selectedValue]);
    $('input[name="switchThree"]').val([selectedValue]);
  });

  // Bind change event to all radio buttons with name="switchThree"
  $('input[name="switchThree"]').change(function () {
    // Get the selected value
    var selectedValue = $(this).val();

    if (selectedValue === "Monthly") {
      $('input[name="switchOne"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .find(".package-price .dollar-amt")
        .html("48");

      $('input[name="switchTwo"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .find(".package-price .dollar-amt")
        .html("78");
    }

    if (selectedValue === "Annually") {
      $('input[name="switchOne"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .find(".package-price .dollar-amt")
        .html("36");

      $('input[name="switchTwo"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .find(".package-price .dollar-amt")
        .html("58");
    }

    // Set the selected value for all radio buttons with name="switchOne" and name="switchTwo"
    $('input[name="switchOne"]').val([selectedValue]);
    $('input[name="switchTwo"]').val([selectedValue]);
  });
};

const selectedPackageMonthly = () => {
  if (selectedValue === "Monthly") {
    $('input[name="switchOne"]')
      .parent()
      .parent()
      .parent()
      .parent()
      .find(".package-price .dollar-amt")
      .html("48");

    $('input[name="switchTwo"]')
      .parent()
      .parent()
      .parent()
      .parent()
      .find(".package-price .dollar-amt")
      .html("78");
  }

  if (selectedValue === "Annually") {
    $('input[name="switchOne"]')
      .parent()
      .parent()
      .parent()
      .parent()
      .find(".package-price .dollar-amt")
      .html("36");

    $('input[name="switchTwo"]')
      .parent()
      .parent()
      .parent()
      .parent()
      .find(".package-price .dollar-amt")
      .html("58");
  }
};
