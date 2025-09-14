

 function loadMAF(filename, callback){

 var returnObj;  var scriptObj = document.createElement('script');  scriptObj.setAttribute("type","text/javascript");  scriptObj.setAttribute("charset","utf-8");  scriptObj.setAttribute("src", filename); if(callback != "")
 scriptObj.setAttribute("onload", callback);  if (typeof scriptObj != "undefined")
  returnObj = document.getElementsByTagName("head")[0].appendChild(scriptObj); }

 if (!window.adf){
 window.adf = {}; adf.wwwPath = "/~maf.device~/www/"; }

 var isMAFWrapper = isMAF(); if(isMAFWrapper == "1"){
 var http = new XMLHttpRequest(); http.open('HEAD', "/~maf.device~/www/js/base.js", false); http.send(); if (http.status == "200") {
 loadMAF("/~maf.device~/www/js/base.js","");   }
 }

 function readMAFDeviceToken() {
 adf.mf.api.invokeMethod("application.PeopleSoft", "GetDeviceToken", onSuccess, onFail); }

 
 document.addEventListener("showpagecomplete", readMAFDeviceToken, false); function onSuccess(request, response) { 
 var DeviceToken = (response[0]); var DeviceName = encodeURIComponent(response[1]); var AppName = encodeURIComponent(response[2]); var AppID = encodeURIComponent(response[3]);   var UUID=""; UpdateMAFToken(DeviceToken,DeviceName,AppName,AppID,UUID); }
 
 function onFail() {
 alert("Error accessing MAF"); }

 function UpdateMAFToken(DeviceToken,DeviceName,AppName,AppID,UUID) {

 var dBaseUri = location.href;    var dServerUri = dBaseUri.split(getPortalName(dBaseUri))[0];  dServerUri = dServerUri.replace("/psp/", "/psc/");  dServerUri = dServerUri + getPortalName(dBaseUri) + "/" + getNodeName(dBaseUri) + "/s/WEBLIB_PTPP.ISCRIPT1.FieldFormula.IScript_RegisterMAFDevice?cmd=MAFDevice&dname="+DeviceName+"&dappid="+AppID+"&dappname="+AppName+"&duuid="+UUID+"&dtoken="+DeviceToken; sendMAFAjaxRequest(dServerUri);  }

 function sendMAFAjaxRequest(url) {
 loader = new net2.ContentLoader(url,null, null, "GET", function() {
 var respData = this.req.responseText;  }, null, null, "application/x-www-form-urlencoded");  loader = null; }