function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
var realUrl = getQueryString("url");
var agentCode = getQueryString("agentCode");

function postDownloadExtra(type,host) {
	var rUrl="https://rest.2wl2kk222.com/download/extra";
	$.ajax({
	    url: rUrl,
	    type:"POST",
	    data:{"url":realUrl, "agentCode":agentCode, "type":type, "host":host},
	    success:function(d){}
	});
}
