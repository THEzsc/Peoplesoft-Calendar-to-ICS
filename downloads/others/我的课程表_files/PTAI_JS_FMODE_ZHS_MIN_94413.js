





var ptaiObj = {


baseUri :"",
ptaiLoadButtonsUri :"",

InstanceExists : false, 
 
AgPostMessage : function () { 
if ((this.InstanceExists) && (typeof top.ptgpPage != 'undefined') && (top.ptgpPage)) 
 top.ptgpPage.updateMainGrouplet(); },




 init : function () {

  
  this.baseUri = String(location).match(/\/ps(c|p)\/([^\/]*)?\/?([^\/]*)?\/?([^\/]*)?\//)[0];  this.ptaiLoadButtonsUri=this.baseUri + "s/WEBLIB_PTAI.ISCRIPT1.FieldFormula.IScript_LoadSubpageButtons";  this.ptaiSubpageActionsUri=this.baseUri + "s/WEBLIB_PTAI.ISCRIPT1.FieldFormula.IScript_SubpageActions"; }, 

 setCurrentItem : function (ActionItemId) {
 this.baseUri = String(location).match(/\/ps(c|p)\/([^\/]*)?\/?([^\/]*)?\/?([^\/]*)?\//)[0];  var AGURI = this.baseUri + "s/WEBLIB_PTAI.ISCRIPT1.FieldFormula.IScript_GetItemStatus"; try {
 var AGparams = "PTAI_ITEM_ID=" + ActionItemId + "&PTAI_ACTION=click" + "&cmd=smartnav"; var AGLoader = new net2.ContentLoader(AGURI, null, null, "GET", function() {
 var respHTML = this.req.responseText; if ((typeof top.ptgpPage != 'undefined') && (top.ptgpPage))
 { top.ptgpPage.updateMainGrouplet(); }
 }, function() {
 var respHTML = this.req.responseText; }, AGparams, "application/x-www-form-urlencoded"); }
 catch (err) {}

 }, 

 Execute : function (strListid, strBtnMethod, strButtonSrc) {

 this.baseUri = String(location).match(/\/ps(c|p)\/([^\/]*)?\/?([^\/]*)?\/?([^\/]*)?\//)[0];  this.ptaiSubpageActionsUri=this.baseUri + "s/WEBLIB_PTAI.ISCRIPT3.FieldFormula.IScript_SubpageActions"; var ptaiLoader = new net2.ContentLoader(
  this.ptaiSubpageActionsUri + "?PTAI_LIST_ID=" + strListid+"&PTAI_BTN_METHOD="+strBtnMethod+"&PTAI_BTN_SRC="+strButtonSrc+"&cmd=smartnav",
  null, "", "GET",
  function () {
  
  
  var respHTML = this.req.responseText; if (respHTML!= "") {
 switch (respHTML.substring(0,1)) {
 case "0": 
 if ((typeof top.ptgpPage != 'undefined') && (top.ptgpPage)) 
 top.ptgpPage.updateMainGrouplet(); break; case "1": 
 var topUrl=respHTML.substring(2,respHTML.length); if (topUrl.indexOf("http") != -1)
 top.location =topUrl; else
 {
 if ((typeof top.ptgpPage != 'undefined') && (top.ptgpPage)) 
 top.ptgpPage.updateMainGrouplet(); }
 break; case "2": 
 var topUrl=respHTML.substring(2,respHTML.length); if (topUrl.indexOf("http") != -1)
 top.location =topUrl; else
 {
 if ((typeof top.ptgpPage != 'undefined') && (top.ptgpPage)) 
 top.ptgpPage.updateMainGrouplet(); }
 break; case "3": 
 var topUrl=respHTML.substring(2,respHTML.length); if (topUrl.indexOf("http") != -1)
 top.location =topUrl; else
 top.ptgpPage.returnToPreviousPage(false); break; case "4": 
 var topUrl=respHTML.substring(2,respHTML.length); if (topUrl.indexOf("http") != -1)
 top.location =topUrl; else
 {
 if ((typeof top.ptgpPage != 'undefined') && (top.ptgpPage)) 
 top.ptgpPage.updateMainGrouplet(); }
 break; }
 }
  },
  function () {
  
  
  var respHTML = this.req.responseText;  },
  null,
  "application/x-www-form-urlencoded"
  ); }, 


 ExecuteAG : function (strListid, strBtnMethod, strMsgBoxTitle, strMessage, strButtonSrc) {

 var CancelEvent='ptaiObj.CancelAction()'; var scriptAft='ptaiObj.Execute("'+strListid+'", "'+strBtnMethod+'", "'+strButtonSrc+'")'; var strExplainMessage=""; switch (strBtnMethod)
 {
 case 'SubmitAGProcess': 
 var OKEvent='top.ptgpPage.submit('+scriptAft+')';  break;  case 'ExitAGProcess': 
 if (strMessage=="F") {
 var oWin = top.window; var oTFrame = document.querySelector(".ps_target-iframe"); if (oTFrame)
 oWin = oTFrame.contentWindow; var bChanged = checkFrameChanged(oWin); if (bChanged) {
 strMessage="\u662f\u5426\u8981\u9000\u51fa\u6b64\u5411\u5bfc\u5f0f\u5904\u7406?"; strExplainMessage="\u5355\u51fb\u201c\u662f\u201d\u53ef\u653e\u5f03\u6240\u6709\u66f4\u6539\u5e76\u9000\u51fa\uff0c\u5355\u51fb\u201c\u5426\u201d\u53ef\u4fdd\u7559\u5728\u6b64\u9875\u4e0a\u3002"; }
 }
 var OKEvent=scriptAft; break;  default:
 var OKEvent=scriptAft; break; }

 if (strMessage=="F")
 eval(OKEvent); else
 psConfirmFluid(strMsgBoxTitle, strMessage , "YesNo", OKEvent, CancelEvent, strExplainMessage, window); }, 


 AIPreProcessingNUI : function (serviceId, parameter, Isfluid, IsAutoSave, sScriptAfter) {
 this.baseUri = String(location).match(/\/ps(c|p)\/([^\/]*)?\/?([^\/]*)?\/?([^\/]*)?\//)[0];  var AGURIPRP = this.baseUri + "s/WEBLIB_PTAI.ISCRIPT1.FieldFormula.IScript_AIPreProcessing"; try {
 var AGparamsPRP = "SERVICEID=" + serviceId + "&PARAMETERS=" + parameter + "&cmd=smartnav"; var AGLoaderPRP = new net2.ContentLoader(AGURIPRP, null, null, "GET", function() {
 var respHTML = this.req.responseText; var arrResp = respHTML.split(","); var isRequiredItem = arrResp[4]; var isRedirection = arrResp[2]; var urlRedirection = arrResp[3]; var parameters = parameter.split(","); if ((typeof top.ptgpPage != 'undefined') && (top.ptgpPage)){
 if (IsAutoSave==true)
 top.ptgpPage.openUrlWithAutoSave(urlRedirection,sScriptAfter,Isfluid);  else
 top.ptgpPage.openUrlWithWarning(urlRedirection,sScriptAfter,Isfluid);  }
 }, function() {
 var respHTML = this.req.responseText; }, AGparamsPRP, "application/x-www-form-urlencoded"); }
 catch (err) {}

 }, 


 OpenInModal : function (modalWinUrl, helpTile) {

 var mOption = "bCrossDomain@1;sStyle@frame-pt_help;sTitle@" + helpTile + ";bClose@1;bFullScreen@1;"; LaunchURL(null, modalWinUrl, 2, mOption); }, 

 CancelAction : function () {
 return false; } 

};