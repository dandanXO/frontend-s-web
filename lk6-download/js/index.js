$(document).ready(function (e) {
	detectIfSafari();
	getApiUrl();

	$("#id-url-input").text(window.location.href);

	function detectIfSafari() {
		if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
			// Safari detected
			console.log("You are using Safari.");
		} else {
			// Not Safari
			console.log("You are not using Safari.");
			$(".modal-open").show();

			$(".step-2-btn, .step-1-btn").css("pointer-events", "none").css("filter", "grayscale(1)");
		}
	}

	$("#id-copy-btn").click(function(e){
		var textToCopy= $("#id-url-input").text();

		copyTextToClipboard(textToCopy);
		alert("复制成功。")
	})

	function copyTextToClipboard(text) {
		var textarea = document.createElement("textarea");
		textarea.value = text;
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand("copy");
		document.body.removeChild(textarea);
	}


	var modal = document.getElementById("step-1-modal");

	// Get the button that opens the modal
	var btn = document.getElementById("step-1-btn");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks the button, open the modal
	btn.onclick = function() {
		modal.style.display = "flex";
	}

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}


	function isURLSchemeSupported(urlScheme) {
		var iframe = document.createElement("iframe");
		iframe.style.display = "none";
		document.body.appendChild(iframe);
		var success = false;

		iframe.onload = function() {
			success = true;
		};

		iframe.src = urlScheme + "://";

		setTimeout(function() {
			document.body.removeChild(iframe);
			if (success) {
				return success;
			} else {
				return false;
			}
		}, 1000);
	}


	async function getApiUrl() {
		if(isURLSchemeSupported("itms-beta"))
		{
			var clickBtn = document.getElementById("click-btn");
			clickBtn.onclick = async function () {
				clickBtn.classList.add("is-active");
				var apiUrl = 'https://tfwkal.nc547frt0an.com/getTfData'
				try {
					const response = await fetch(apiUrl, {
						method: 'GET',
					});
					const data = await response.json();
					if (data) {
						clickBtn.classList.remove("is-active");
						// debugger;
						console.log("data", data);
						if (data.code == 1) {
							var openUrl = data.data;
							window.location.href= openUrl;
						}
						else
						{
							alert(data.msg)
						}
					}
				} catch (error) {
					clickBtn.classList.remove("is-active");
					console.log(error)
				}
			}
		}else
		{
			alert("请先安装testflight")
		}
	}
})


