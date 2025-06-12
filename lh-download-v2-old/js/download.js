function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
var realUrl = getQueryString("url");
var agentCode = getQueryString("agentCode");
var from = getQueryString("from");

function postDownloadExtra(type,host) {
	$.ajax({
	    url: "https://yj8wz.ks1er9lyi8.com/download/extra",
	    type:"POST",
	    data:{"url":realUrl, "agentCode":agentCode, "type":type, "host":host, "from":from},
	    success:function(d){}
	});
}

 function getCustomerService(returnService){
	var rUrl="https://yj8wz.ks1er9lyi8.com/rest/api/otherSetting";
	$.ajax({
	    url: rUrl,
	    type:"GET",
	    success:function(d){
			returnService(d);
		}
	});
}