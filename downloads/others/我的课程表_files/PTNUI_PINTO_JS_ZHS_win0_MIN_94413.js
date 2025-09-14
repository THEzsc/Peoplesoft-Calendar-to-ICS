var PT_ToastMsg = function(msg, options) {

 if (typeof(bFMode) != "undefined" && bFMode) {

 psConfirmFluid("", "", "OK", "", "", msg); } else {
 var objFrame = top.frames['TargetContent']; if (objFrame) {
 objFrame.psConfirm2("\u6dfb\u52a0\u5230", msg); } else {
 psConfirm2("\u6dfb\u52a0\u5230", msg); }

 }
}

var PT_Toast = {
 ToastId: 0,
 Fluid: false,
 GetToastContainer: function() {
 var el = document.querySelector('.ps_header_confirmation .psc_confirmation-animate'); if (el) {
 t_el = el; PT_Toast.Fluid = true; } else {
 el = document.querySelector('#PT_CONTENT'); if (el == null)
 el = document.querySelector('#ptifrmcontent'); if (el == null)
 el = document.querySelector('#pthdr2container'); t_el = el.querySelector('#PT_TOAST'); PT_Toast.Fluid = false; }

 return t_el; },

 ShowMessage: function(msg, options) {
 var toast = new PT_ToastMsg(msg, options); }
}

var PTPinTo = {
 GetBaseURI : function() {
 var baseURI; var portalCntx = "";  if (typeof(portalContextNodeURI) != 'undefined')
 portalCntx = portalContextNodeURI; else if (typeof(top.portalContextNodeURI) != 'undefined')
 portalCntx = top.portalContextNodeURI; if (portalCntx == "")
 baseURI = getptBaseURI(); else
 baseURI = portalCntx + "/"; return baseURI; },

 pinBaseURL : "s/WEBLIB_PTNUI.PT_BUTTON_PIN.FieldFormula.IScript_SavePin",

 

 AddToLPModal : function(ajaxURL, lpHtml){
 var pinCloseURL = (typeof(NUImodalCloseUrl) != "undefined" && NUImodalCloseUrl) ? NUImodalCloseUrl : ((typeof(modalCloseUrl) != "undefined" && modalCloseUrl) ? modalCloseUrl : ""); var pinCloseAlt = '\u5173\u95ed'; var lpPinClose = "<div class='ps_box-button psc_modal-close ps_pinto_close'><span class='ps-button-wrapper' title='" + pinCloseAlt + "'><a class='ps-button' onclick='PTPinTo.CloseLPWin(event)' role='button' alt='" + pinCloseAlt + "' title='" + pinCloseAlt + "' ><img src='" + pinCloseURL + "'/ alt='" + pinCloseAlt + "'></a></span></div>"; var lpPinTitle = "<div class='ps_modal_header'><div class='ps_modal_title'>\u6dfb\u52a0\u81f3\u4e3b\u9875</div><div class='ps_modal_close'>" + lpPinClose + "</div></div>"; var lpPinList = "<div class='ps_modal_content addto'><h2 class='ps_header-group'><span class='ps-text'>\u4ece\u53ef\u7528\u4e3b\u9875\u4e2d\u9009\u62e9</span></h2><div class='lplistgrid' id='ptlplist'><ul>" + lpHtml+ "</ul></div></div>"; var lpPinNewLP = "<div class='addtofooter'><h2 class='ps_header-group'><span class='ps-text'>\u6216\u521b\u5efa\u65b0\u4e3b\u9875</span></h2><div class='pinnewlp'><input type='text' name='lplabel' placeholder='Add to new Homepage'/><div class='ps_box-button'><span class='ps-button-wrapper'><a id='ptaddlpbtn' onclick='PTPinTo.SaveNewLPPin(event, this.href);return false;' class='ps-button' href='" + ajaxURL + "' role='button'>Add</a></span></div></div></div>"; return "<div id='PT_PINTO_MASK' onclick='PTPinTo.CloseLPWin(event)'>" + "<div id='PT_PINLPSELECT' class='ps_modal_container' onclick='event.stopPropagation()'>" + lpPinTitle + lpPinList + lpPinNewLP + "</div></div>"; },

 UpdateAddToLPModal : function(ajaxURL, lpHtml){
 
 var hpList = document.getElementById('ptlplist'); if (hpList) {
 hpList.innerHTML = "<ul>" + lpHtml + "</ul>";  var addNewBtn = document.getElementById('ptaddlpbtn'); addNewBtn.href = ajaxURL; }
 },

 DeleteThis : function(targURL){
 if (targURL == null) return; var ajaxURL = this.GetBaseURI() + "s/WEBLIB_PTNUI.PT_BUTTON_PIN.FieldFormula.IScript_DeleteLPPinned"; var pin_url = "url=" + encodeURIComponent(targURL); var loader = new net2.ContentLoader(ajaxURL,null,null,"POST",
 function () {},null,pin_url,"application/x-www-form-urlencoded"); },

 PinThis : function(loc, crefID, targURL, targURLParam, tileURLParam, label, apiCall) {
 
 if ((loc != "LP") && (loc != "NB") && (loc != "FAV")){
 PT_Toast.ShowMessage("Pin \u4f4d\u7f6e\u672a\u77e5: " + loc); return; }

 crefID = (crefID == null) ? "": crefID; var pin_url = "loc=" + loc; if (crefID !== "")
 pin_url += "&crefName=" + encodeURIComponent(crefID).replace(/'/g, "%27"); if (label !== "")
 pin_url += "&crefLabel=" + encodeURIComponent(label).replace(/'/g, "%27");; if (targURL !== "")
 pin_url += "&url=" + encodeURIComponent(targURL).replace(/'/g, "%27");  if (targURLParam !== "")
 pin_url += "&targParam=" + encodeURIComponent(targURLParam).replace(/'/g, "%27");  if (tileURLParam !== "")
 pin_url += "&tileParam=" + encodeURIComponent(tileURLParam).replace(/'/g, "%27");    if ((typeof apiCall == "undefined") || (apiCall == "1"))
 pin_url += "&apiCall=1";   var ajaxURL = this.GetBaseURI() + this.pinBaseURL ; if (loc == "FAV" && typeof(ptIframeHdr) === "object") {
 ptIframeHdr.favOpen(); } else {
 var loader = new net2.ContentLoader(ajaxURL,null,null,"POST",
 function () {
 var m = this.req.responseText; if (loc == 'LP') {
 var rcd = eval(m); if ((rcd.length == 1) && (rcd[0].ERROR == "LP")) {
 PT_Toast.ShowMessage(rcd[0].ERRTEXT); return; }
 var lpHtml = ""; for (var i = 0; i < rcd.length; i++) {
 var curLP = ""; if (rcd[i].exists == 'y') {
 curLP = "<a class='disabled'>" + rcd[i].label + " (\u5df2\u6dfb\u52a0)</a>"; } else {
 curLP = "<a class='active' onclick='PTPinTo.SaveLPPin(event, this.href, this.innerHTML);return false;' href='" + ajaxURL + "?" + pin_url + "&lp=" + rcd[i].name + "'>" + rcd[i].label + "</a>"; }
 lpHtml = lpHtml + "<li><div class='lplistitem'>" + curLP + "</div></li>"; }
 var el = document.querySelector('#PT_CONTENT'); if (el == null)
 el = document.querySelector('#ptifrmcontent'); if (el == null)
 el = document.querySelector('#pthdr2container'); if (el == null)
 el = document.querySelector('#win0divPSPAGECONTAINER'); var t_el = el.querySelector('#PT_PINTO_MASK'); if (t_el == null) { 
 var addDialogHTML = PTPinTo.AddToLPModal(ajaxURL+"?"+pin_url, lpHtml); ptUtil.appendHTML(el, addDialogHTML); } else {
 PTPinTo.UpdateAddToLPModal(ajaxURL+"?"+pin_url, lpHtml); t_el.style.display = 'inherit'; }
 } else {
 
 PTNavBar.bDirty = true;  PT_Toast.ShowMessage(m); }
 },null,pin_url,"application/x-www-form-urlencoded");  }
 
 var actionlistContainer = findActionListContainer(); if( !actionlistContainer )
 { this.Toggle(); }
 

 if (document.querySelector('#PT_CONTENT') != null) {
 
 
 var ptMaskEl = document.querySelector('#pt_modalMask'); if (ptMaskEl)
 ptMaskEl.click(); }
 
 },


 Init : function(el) {

 var actionlistContainer = findActionListContainer(); var themeParams = "" ; if (actionlistContainer)
 {
 themeParams = "setClassicFluidHeaderFlag="+"true"; }
 else
 {
 themeParams = "setClassicFluidHeaderFlag="+"false"; }

 var ajaxURL = PTPinTo.GetBaseURI() + "s/WEBLIB_PTNUI.PT_BUTTON_PIN.FieldFormula.IScript_ShowPinMenu"; var loader = new net2.ContentLoader(ajaxURL,null,null,"GET",
 function () {
 var popupHTML = this.req.responseText;  ptUtil.appendHTML(el,popupHTML); PTPinTo.Toggle(); },null,themeParams,"application/x-www-form-urlencoded"); },
 Toggle : function() {
 var pin_el = document.querySelector('.ps_header-pin'); if (pin_el != null) {
 var pin_menu_el = pin_el.querySelector('.ps-pin-menu'); if (pin_menu_el == null) {
 this.Init(pin_el); } else {
 toggleClass(pin_el, 'active'); toggleClass(pin_menu_el, 'ps-pin-hidden'); }
 }
 },
 DecodeHTML: function(inStr) {
 var e = document.createElement('div');  e.innerHTML = inStr; return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue; },
 SavePin : function(loc) {
 var pCrefID = ""; var pin_url = top.location.href; var pLabel = ""; if ((typeof(bFMode) !== 'undefined') && (bFMode)) {
 
 if ((typeof strReqURL !== "undefined") && (strReqURL != ""))
 pin_url = strReqURL;  else
 pin_url = location.href; if ((typeof(szPinCrefID)!=='undefined') && (typeof(szPinCrefReg)!=='undefined') && (szPinCrefReg=='T')) { 
 pCrefID = szPinCrefID; }

 if ((typeof(szPinCrefLabel) !== 'undefined') && (typeof(szPinCrefReg)!=='undefined') && (szPinCrefReg=='T')) {
 pLabel = PTPinTo.DecodeHTML(szPinCrefLabel); } else {
 pLabel = document.title; }
 } else {
 
 pCrefID = ""; pLabel = document.title; if (typeof top.ptalPage == "object") {
 
 var ptalInfo = ptalPage.id.split("."); if (ptalInfo.length > 1) {
 pCrefID = ptalInfo[1]; pLabel = ptalPage.label; pin_url = top.location.href; }
 }else {
 try {
 this.TargetFrame = top.frames["TargetContent"]; if ((typeof(this.TargetFrame.szPinCrefReg)!=='undefined') && (this.TargetFrame.szPinCrefReg=='T')) {
 pCrefID = this.TargetFrame.szPinCrefID; pLabel = this.TargetFrame.szPinCrefLabel; }
 } catch(e) {}

 if (this.TargetFrame) {
 
 if (!isCrossDomain(this.TargetFrame) && (typeof this.TargetFrame.strReqURL !== 'undefined')) { 
 pin_url = this.TargetFrame.strReqURL;  } else {
 pin_url = top.location.href; }
 } else {
 
 pin_url = top.location.href; }
 } 
 }
 PTPinTo.PinThis(loc, pCrefID, pin_url, "", "", pLabel, "0");  },

 SaveLPPin : function(e, url, label) {
 e.preventDefault(); PTPinTo.CloseLPWin(e); if (url.indexOf("?") > -1)
 url = url + "&"; else
 url = url + "?"; url = url + "label=" + encodeURIComponent(label).replace(/'/g, "%27"); var loader = new net2.ContentLoader(url,null,null,"GET",
 function () {
 var m = this.req.responseText; PT_Toast.ShowMessage(m); },null,null,"application/x-www-form-urlencoded"); },
 SaveNewLPPin : function(e, url) {
 e.preventDefault(); var input_el = document.querySelector('#PT_PINLPSELECT input'); var newLabel = input_el.value; if (input_el.value == "") {
 PT_Toast.ShowMessage("\u8bf7\u9009\u62e9\u65b0\u4e3b\u9875\u7684\u540d\u79f0"); return; }

 input_el.value = ""; PTPinTo.CloseLPWin(e); url = url + "&newlp=" + encodeURIComponent(newLabel).replace(/'/g, "%27"); var loader = new net2.ContentLoader(url,null,null,"GET",
 function () {
 var m = this.req.responseText; PT_Toast.ShowMessage(m); },null,null,"application/x-www-form-urlencoded"); },
 CloseLPWin : function(e) {
 e.stopPropagation(); var el = document.querySelector('#PT_PINTO_MASK'); el.style.display = 'none'; }
};function DoPin() { PTPinTo.Toggle() };function findActionListContainer()
{
 var actionlistContainer = document.querySelector('#pthdr2actionListcontainerfluid');  return actionlistContainer;};(function(){
var actionlistContainer = findActionListContainer();if(actionlistContainer){ DoPin(); return false; }
}());