function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
var realUrl = getQueryString("url");
var agentCode = getQueryString("agentCode");
var from = getQueryString("from");

function postDownloadExtra(type,host) {
	var rUrl="https://wrss1092.5ct5mm555.com/download/extra";
	$.ajax({
	    url: rUrl,
	    type:"POST",
	    data:{"url":realUrl, "agentCode":agentCode, "type":type, "host":host, "from":from},
	    success:function(d){}
	});
}
