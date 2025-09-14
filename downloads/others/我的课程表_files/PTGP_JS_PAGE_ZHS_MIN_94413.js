



function AgPostMessage() {
 if ((typeof (top.ptaiObj) != "undefined") && (top.ptaiObj) && (typeof (top.ptaiObj.AgPostMessage) == "function")) ptaiObj.AgPostMessage();}





var ptgpPage = {

 
 id : "", 
 currentStepId : "", 

 initialized : false, 
 ignoreCustomStepButton : false, 


 
 UNDEFINED : "undefined",

 CSS_HIDDEN : "psc_hidden",
 CSS_INACTIVE : "psc_inactive",
 CSS_INVISIBLE : "psc_invisible",

 CSS_MODE_INITIALIZATION : "ps_ag-initialization",
 CSS_MODE_OPTIMIZED : "ps_ag-optimized",

 CSS_STEP : "ps_ag-step",
 CSS_STEP_GROUP : "ps_ag-step-group",

 CSS_STEP_BUTTON : "ps_ag-step-button",
 CSS_STEP_GROUP_BUTTON : "ps_ag-step-group-button",

 CSS_STEP_SELECTED : "psc_selected",
 CSS_STEP_VISITED : "psc_visited",
 CSS_STEP_DISABLED : "psc_disabled",
 CSS_STEP_DISPLAY_ONLY : "psc_displayonly",
 CSS_STEP_GROUP_OPEN : "psc_expanded",

 CSS_BUTTON : "ps_ag-button",

 CSS_BUTTON_DISABLED : "psc_disabled",
 CSS_BUTTON_FORCE_VISIBLE : "psc_force_visible",


 
 ID_PAGE_WRAPPER : "PT_WRAPPER",

 ID_HEADER_GROUPLET : "PT_AG_LAYOUT_PT_AG_GROUPBOX3",
 ID_MENU_GROUPLET : "PT_AG_LAYOUT_PT_AG_GROUPBOX5",
 ID_ACTION_MENU_GROUPLET : "PT_AG_LAYOUT_PT_AG_GROUPBOX7",


 
 CSSID_TARGET_IFRAME : ".ps_target-iframe",

 CSSID_INITIALIZATION_TEXT : ".ps_ag-initialization-text",

 CSSID_PROCESS_NAV_LIST : ".ps_ag-navigation-list-level1",

 CSSID_CUSTOM_HEADER_BUTTONS_LOC : ".ps_ag_action.ps_menusection",

 CSSID_SYSTEM_BUTTONS : ".ps_ag-header-system-buttons",
 CSSID_CUSTOM_BUTTONS : ".ps_ag-header-custom-buttons",

 CSSID_HEADER_TEXTS : ".ps_ag-header-texts",
 CSSID_HEADER_TEXT_LABEL_BOX : ".ps_box-label",
 CSSID_HEADER_TEXT_LABEL : ".ps-label",

 CSSID_BUTTON_PREVIOUS : ".ps_ag-button-previous",
 CSSID_BUTTON_NEXT : ".ps_ag-button-next",
 CSSID_BUTTON_SUBMIT : ".ps_ag-button-submit",
 CSSID_BUTTON_EXIT : ".ps_ag-button-exit",

 CSSID_CUSTOM_BUTTON_PREVIOUS : ".ps_ag-custom-button-previous",
 CSSID_CUSTOM_BUTTON_NEXT : ".ps_ag-custom-button-next",
 CSSID_CUSTOM_BUTTON_SUBMIT : ".ps_ag-custom-button-submit",
 CSSID_CUSTOM_BUTTON_EXIT : ".ps_ag-custom-button-exit",

 CSSID_CUSTOM_STEP_BUTTON : ".ps_ag-custom-step-button-",

 CSSID_STEP_HEADER_CONTENTS : ".ps_ag-step-header-content-wrapper",
 CSSID_STEP_COMPONENT_HEADER_LOC : ".ps_box-agtitle",
 CSSID_HEADER_STEP_INFO_LOC : ".ps_ag-header-step-info-wrapper",

 CSSID_PROGRESS_BAR : ".ps_ag-progress-bar",
 CSSID_PROGRESS_STEP_PROGRESS : ".ps_ag-progress-step-progress",
 CSSID_PROGRESS_STEP_NUMBER : ".ps_ag-progress-step-number",



 
 
 
 init : function (pProcessId, pCurrentStepId) {

 this.id = pProcessId;  SetAGAction("", "", "", "");  var objCustomHeaderButtonsLoc = document.querySelector(this.CSSID_CUSTOM_HEADER_BUTTONS_LOC); if (objCustomHeaderButtonsLoc) {
 objCustomHeaderButtonsLoc.innerHTML = ""; var objCustomButtons = document.querySelector(this.CSSID_CUSTOM_BUTTONS); if (objCustomButtons) {
 objCustomHeaderButtonsLoc.innerHTML = objCustomButtons.innerHTML; var objList = objCustomHeaderButtonsLoc.querySelectorAll("*[id]"); for (var i = 0; i < objList.length; i++) objList[i].removeAttribute("id"); }
 }


 
 if (!this.initialized) {
 this.openStep(pCurrentStepId, true); }


 
 this.selectStep(pCurrentStepId);  sMDWrapperStyle = ((typeof (sMDWrapperStyle) == this.UNDEFINED) ? "" : sMDWrapperStyle.replace(this.CSS_MODE_INITIALIZATION, "")); ptUtil.removeClass(ptUtil.id(this.ID_PAGE_WRAPPER), this.CSS_MODE_INITIALIZATION); ptUtil.addClass(document.querySelector(this.CSSID_INITIALIZATION_TEXT), this.CSS_HIDDEN);  this.initialized = true; }, 





 
 
 
 showMessage : function (pTitle, pContent) {

 psConfirmFluid("", pTitle, "OK", "", "", pContent); }, 


 
 
 
 showButtonGroupPopup : function (pButtonGroupId) {

 doPopupRequest(document.forms[0], pButtonGroupId); }, 


 
 
 
 returnToPreviousPage : function (pWarning) {

 DoBack(window.document.forms[0].name, ((typeof (pWarning) == this.UNDEFINED) ? true : pWarning)); }, 


 
 
 
 deferLoadingGrouplet : function (pId) {

 var groulpetLoc = -1; switch (pId) {
 case this.ID_HEADER_GROUPLET:
 groulpetLoc = 0; break; case this.ID_MENU_GROUPLET:
 groulpetLoc = 1; break; }

 var objGrouplet = ptUtil.id(getGroupletId(pId, groulpetLoc)); if (objGrouplet) {
 try {
 
 setGroupletInactive(objGrouplet); } catch (error) {
 
 }
 }

 }, 


 
 
 
 deferLoadingGrouplets : function () {

 try {
 this.deferLoadingGrouplet(this.ID_HEADER_GROUPLET); this.deferLoadingGrouplet(this.ID_MENU_GROUPLET); } catch (error) {
 
 }

 }, 


 
 
 
 updateMainGrouplet : function () {

 var objGrouplet = ptUtil.id(getGroupletId(this.ID_MENU_GROUPLET, 1)); if (objGrouplet) {
 this.reloadGrouplet(this.ID_MENU_GROUPLET); } else {
 this.reloadGrouplet(this.ID_HEADER_GROUPLET); }

 }, 


 
 
 
 updateMainGroupletWithUpdate : function (pUrl) {

 

 if (!pUrl) {
 this.updateMainGrouplet(); return; }

 var ptgpStatusUpdateLoader = new net2.ContentLoader (
 pUrl, null, "ptgpStatusUpdateLoader", "GET",
 function () {
 
 top.ptgpPage.updateMainGrouplet(); }, function(){},null,"application/x-www-form-urlencoded"
 ); }, 


 
 
 
 reloadGrouplet : function (pId) {

 var groulpetLoc = -1; switch (pId) {
 case this.ID_HEADER_GROUPLET:
 groulpetLoc = 0; break; case this.ID_MENU_GROUPLET:
 groulpetLoc = 1; break; }

 var objGrouplet = ptUtil.id(getGroupletId(pId, groulpetLoc)); if (objGrouplet) {
 ptUtil.removeClass(objGrouplet.parentNode, this.CSS_HIDDEN); ptUtil.removeClass(objGrouplet.parentNode, this.CSS_INACTIVE); ptUtil.removeClass(objGrouplet.parentNode, this.CSS_INVISIBLE); try {
 
 setGroupletActive(objGrouplet); reloadAGGroupletById(pId, groulpetLoc); } catch (error) {
 
 }
 }

 }, 


 
 
 
 reloadGrouplets : function () {

 try {
 this.reloadGrouplet(this.ID_HEADER_GROUPLET); this.reloadGrouplet(this.ID_MENU_GROUPLET); } catch (error) {
 
 }

 }, 


 
 
 
 openUrl : function (pUrl, pOnLoad, pIsFluid) {

 if (typeof (pIsFluid) == this.UNDEFINED) pIsFluid = true; try {
 if (pIsFluid) {
 LaunchURL(null, pUrl, 6, "", "", false, false, pOnLoad); } else {
 LaunchURL(null, pUrl, 9, "", "", false, false, pOnLoad); }
 } catch (error) {
 
 }

 }, 


 
 
 
 openUrlWithWarning : function (pUrl, pOnLoad, pIsFluid) {

 if (typeof (pIsFluid) == this.UNDEFINED) pIsFluid = true; try {
 if (pIsFluid) {
 LaunchURL(null, pUrl, 6, "", "", false, true, pOnLoad); } else {
 LaunchURL(null, pUrl, 9, "", "", false, true, pOnLoad); }
 } catch (error) {
 
 }

 }, 


 
 
 
 openUrlWithAutoSave : function (pUrl, pOnLoad, pIsFluid) {

 if (typeof (pIsFluid) == this.UNDEFINED) pIsFluid = true; try {
 if (pIsFluid) {
 LaunchURL(null, pUrl, 6, "", "", true, false, pOnLoad); } else {
 LaunchURL(null, pUrl, 9, "", "", true, false, pOnLoad); }
 } catch (error) {
 
 }

 }, 


 
 
 
 saveCurrentStep : function (pPostScript) {

 var pPostScript = (typeof (pPostScript) == this.UNDEFINED) ? "" : pPostScript; var objWin = window; var objTFrame = document.querySelector(this.CSSID_TARGET_IFRAME); if (objTFrame) objWin = objTFrame.contentWindow; if (checkFrameChanged(top.window)) {
 var sScript = "objWin.submitAction_" + objWin.document.forms[0].name + "(objWin.document.forms[0], '#ICSave', null, '', false, pPostScript, 6);"; loader = null; eval(sScript); }

 }, 


 
 
 
 saveUnitOfWork : function (pPostScript) {

 var pPostScript = (typeof (pPostScript) == this.UNDEFINED) ? "" : pPostScript; var objWin = window; var objTFrame = document.querySelector(this.CSSID_TARGET_IFRAME); if (objTFrame) objWin = objTFrame.contentWindow; var sScript = "objWin.submitAction_" + objWin.document.forms[0].name + "(objWin.document.forms[0], '#ICSaveUOW', null, '', false, pPostScript, 6);"; loader = null; eval(sScript); }, 


 
 
 
 submit : function (pPostScript) {

 var pPostScript = (typeof (pPostScript) == this.UNDEFINED) ? "" : pPostScript; var obj = ptUtil.id("ICUOW"); if ((obj) && (obj.value != "N")) {
 this.saveUnitOfWork(pPostScript); } else {
 this.saveCurrentStep(pPostScript); }

 }, 


 
 
 
 toggleStepGroup : function (pStepGroupId) {

 var obj = this.getStepObject(pStepGroupId); var objStepButton = this.getStepButtonObject(pStepGroupId); if (obj) {
 if (ptUtil.isClassMember(obj, this.CSS_STEP_GROUP_OPEN)) {
 ptUtil.removeClass(obj, this.CSS_STEP_GROUP_OPEN); obj.setAttribute("aria-expanded", "false"); if (objStepButton) objStepButton.setAttribute("aria-expanded", "false"); } else {
 ptUtil.addClass(obj, this.CSS_STEP_GROUP_OPEN); obj.setAttribute("aria-expanded", "true"); if (objStepButton) objStepButton.setAttribute("aria-expanded", "true"); }
 }

 }, 


 
 
 
 getPtgpId : function (pObj) {
 return ((pObj) ? pObj.getAttribute("ptgpid") : ""); }, 


 
 
 
 getStepObject : function (pStepId) {
 return ((pStepId) ? document.querySelector("li[ptgpid=" + pStepId + "]") : null); }, 


 
 
 
 getStepButtonObject : function (pStepId) {
 return ((pStepId) ? document.querySelector("div[ptgpid=" + pStepId + "]") : null); }, 


 
 
 
 isActiveStepButton : function (pStepButtonObj) {
 return ((pStepButtonObj) ? (!ptUtil.isClassMember(pStepButtonObj, this.CSS_STEP_DISABLED)) && (!ptUtil.isClassMember(pStepButtonObj, this.CSS_STEP_DISPLAY_ONLY)) : false); }, 


 
 
 
 selectStep : function (pStepId) {

 var objProcess = document.querySelector(this.CSSID_PROCESS_NAV_LIST); if (objProcess) {

 var firstStepId = ""; var lastStepId = ""; var firstActiveStepId = ""; var lastActiveStepId = ""; var objCurrentStep = null; var objList = objProcess.querySelectorAll("li." + this.CSS_STEP + ", li." + this.CSS_STEP_GROUP); for (var i = 0; i < objList.length; i++) {

 var obj = objList[i]; var objStepId = this.getPtgpId(obj); var objStepButton = this.getStepButtonObject(objStepId);  if (ptUtil.isClassMember(obj, this.CSS_STEP)) {

 
 firstStepId = ((firstStepId) ? firstStepId : objStepId); lastStepId = objStepId; if (this.isActiveStepButton(objStepButton)) {
 firstActiveStepId = ((firstActiveStepId) ? firstActiveStepId : objStepId); lastActiveStepId = objStepId; }

 
 if (objStepId == pStepId) {
 objCurrentStep = obj; ptUtil.addClass(objStepButton, this.CSS_STEP_SELECTED); ptUtil.addClass(objStepButton, this.CSS_STEP_VISITED); objStepButton.setAttribute("aria-current", "true"); if (!objStepButton.getAttribute("target")) {
 objStepButton.setAttribute("aria-controls", "PT_CONTENT"); }
 } else {
 ptUtil.removeClass(objStepButton, this.CSS_STEP_SELECTED); objStepButton.setAttribute("aria-current", "false"); objStepButton.removeAttribute("aria-controls"); }

 }

 
 if (ptUtil.isClassMember(obj, this.CSS_STEP_GROUP)) {

 var objChildList = obj.querySelectorAll("li." + this.CSS_STEP); for (var j = 0; j < objChildList.length; j++) {
 if (this.getPtgpId(objChildList[j]) == pStepId) {
 break; }
 }

 if (j < objChildList.length) {
 ptUtil.addClass(obj, this.CSS_STEP_GROUP_OPEN); ptUtil.addClass(objStepButton, this.CSS_STEP_SELECTED); ptUtil.addClass(objStepButton, this.CSS_STEP_VISITED); obj.setAttribute("aria-expanded", "true"); objStepButton.setAttribute("aria-expanded", "true"); } else {
 ptUtil.removeClass(obj, this.CSS_STEP_GROUP_OPEN); ptUtil.removeClass(objStepButton, this.CSS_STEP_SELECTED); obj.setAttribute("aria-expanded", "false"); objStepButton.setAttribute("aria-expanded", "false"); }

 }

 }


 
 if (objCurrentStep) objCurrentStep.scrollIntoView(true);  var objSystemButtons = document.querySelector(this.CSSID_SYSTEM_BUTTONS); if (objSystemButtons) {

 var previousAction = ""; var objPreviousButton = objSystemButtons.querySelector(this.CSSID_BUTTON_PREVIOUS); if (objPreviousButton) {
 if ((firstStepId == pStepId) || ((firstActiveStepId == pStepId) && !ptUtil.isClassMember(objPreviousButton, this.CSS_BUTTON_FORCE_VISIBLE))) {
 ptUtil.addClass(objPreviousButton, this.CSS_BUTTON_DISABLED); objPreviousButton.setAttribute("aria-disabled", "true"); } else {
 ptUtil.removeClass(objPreviousButton, this.CSS_BUTTON_DISABLED); objPreviousButton.setAttribute("aria-disabled", "false"); previousAction = "if (document.querySelector(ptgpPage.CSSID_CUSTOM_BUTTON_PREVIOUS)) {ptgpPage.openSystemButton(ptgpPage.CSSID_CUSTOM_BUTTON_PREVIOUS);} else {ptgpPage.openSystemButton(ptgpPage.CSSID_BUTTON_PREVIOUS);}; return false;"; }
 }

 var nextAction = ""; var objNextButton = objSystemButtons.querySelector(this.CSSID_BUTTON_NEXT); if (objNextButton) {
 if ((lastStepId == pStepId) || ((lastActiveStepId == pStepId) && !ptUtil.isClassMember(objNextButton, this.CSS_BUTTON_FORCE_VISIBLE))) {
 ptUtil.addClass(objNextButton, this.CSS_BUTTON_DISABLED); objNextButton.setAttribute("aria-disabled", "true"); } else {
 ptUtil.removeClass(objNextButton, this.CSS_BUTTON_DISABLED); objNextButton.setAttribute("aria-disabled", "false"); nextAction = "if (document.querySelector(ptgpPage.CSSID_CUSTOM_BUTTON_NEXT)) {ptgpPage.openSystemButton(ptgpPage.CSSID_CUSTOM_BUTTON_NEXT);} else {ptgpPage.openSystemButton(ptgpPage.CSSID_BUTTON_NEXT);}; return false;"; }
 }

 var submitAction = ""; var objSubmitButton = objSystemButtons.querySelector(this.CSSID_BUTTON_SUBMIT); if (objSubmitButton) {
 if (!ptUtil.isClassMember(objSubmitButton, this.CSS_BUTTON_DISABLED)) {
 submitAction = "if (document.querySelector(ptgpPage.CSSID_CUSTOM_BUTTON_SUBMIT)) {ptgpPage.openSystemButton(ptgpPage.CSSID_CUSTOM_BUTTON_SUBMIT);} else {ptgpPage.openSystemButton(ptgpPage.CSSID_BUTTON_SUBMIT);}; return false;"; }
 }

 var exitAction = ""; var objExitButton = objSystemButtons.querySelector(this.CSSID_BUTTON_EXIT); if (objExitButton) {
 if (!ptUtil.isClassMember(objExitButton, this.CSS_BUTTON_DISABLED)) {
 exitAction = "if (document.querySelector(ptgpPage.CSSID_CUSTOM_BUTTON_EXIT)) {ptgpPage.openSystemButton(ptgpPage.CSSID_CUSTOM_BUTTON_EXIT);} else {ptgpPage.openSystemButton(ptgpPage.CSSID_BUTTON_EXIT);}; return false;"; }
 }

 try {
 SetAGAction(previousAction, nextAction, submitAction, exitAction); } catch (error) {
 
 }

 }

 }

 this.currentStepId = pStepId; this.setComponentTitle(); }, 


 
 
 
 openSystemButton : function (pButtonId) {

 var objButton = document.querySelector(pButtonId + " a"); if (objButton) {
 loader = null; objButton.click(); }

 }, 


 
 
 
 openCustomStepButton : function (pStepId) {

 var customButtonOpened = false; if (this.ignoreCustomStepButton) {
 this.ignoreCustomStepButton = false; } else {
 
 var objButton = document.querySelector(this.CSSID_CUSTOM_STEP_BUTTON + pStepId + " a"); if (objButton) {
 customButtonOpened = true; loader = null; objButton.click(); }

 }

 return customButtonOpened; }, 


 
 
 
 openStep : function (pStepId, pIgnoreCustomStepButton) {
 if (isAnyMsg()) return; var objButton = this.getStepButtonObject(pStepId); if (objButton && this.isActiveStepButton(objButton)) {
 this.ignoreCustomStepButton = pIgnoreCustomStepButton; loader = null; objButton.click(); }

 }, 


 
 
 
 openPreviousStep : function () {

 var objProcess = document.querySelector(this.CSSID_PROCESS_NAV_LIST); if (objProcess) {
 var objList = objProcess.querySelectorAll("li." + this.CSS_STEP); for (var i = 0; i < objList.length; i++) {
 var objCurrentButton = this.getStepButtonObject(this.getPtgpId(objList[i])); if (ptUtil.isClassMember(objCurrentButton, this.CSS_STEP_SELECTED)) {
 for (var k = i - 1; k >= 0; k--) {
 var objNextButton = this.getStepButtonObject(this.getPtgpId(objList[k])); if (this.isActiveStepButton(objNextButton)) {
 loader = null; objNextButton.click(); break; }
 }
 break; }
 }
 }

 }, 


 
 
 
 openNextStep : function () {

 var objProcess = document.querySelector(this.CSSID_PROCESS_NAV_LIST); if (objProcess) {
 var objList = objProcess.querySelectorAll("li." + this.CSS_STEP); for (var i = 0; i < objList.length; i++) {
 var objCurrentButton = this.getStepButtonObject(this.getPtgpId(objList[i])); if (ptUtil.isClassMember(objCurrentButton, this.CSS_STEP_SELECTED)) {
 for (var k = i + 1; k < objList.length; k++) {
 var objPreviousButton = this.getStepButtonObject(this.getPtgpId(objList[k])); if (this.isActiveStepButton(objPreviousButton)) {
 loader = null; objPreviousButton.click(); break; }
 }
 break; }
 }
 }

 }, 


 
 
 
 adjustHeaderTextLabelWidth : function () {

 var objHeaderTexts = document.querySelector(this.CSSID_HEADER_TEXTS); if (objHeaderTexts) {

 
 var labelWidth = 0; var objList = objHeaderTexts.querySelectorAll(this.CSSID_HEADER_TEXT_LABEL); for (var i = 0; i < objList.length; i++) {
 if (objList[i].offsetWidth > labelWidth) {
 labelWidth = objList[i].offsetWidth; }
 }

 
 var objList = objHeaderTexts.querySelectorAll(this.CSSID_HEADER_TEXT_LABEL_BOX); for (var i = 0; i < objList.length; i++) {
 objList[i].style.maxWidth = "calc(" + (labelWidth) + "px + 0.8em)"; }

 }

 }, 


 
 
 
 setComponentTitle : function () {

 var objStep = this.getStepObject(this.currentStepId); if (objStep && ptUtil.isClassMember(objStep, this.CSS_STEP)) {
 var objStepHeaderContent = objStep.querySelector(this.CSSID_STEP_HEADER_CONTENTS); if (objStepHeaderContent) {

 
 var objHeaderStepInfoLoc = document.querySelector(this.CSSID_HEADER_STEP_INFO_LOC); if (objHeaderStepInfoLoc) {
 objHeaderStepInfoLoc.innerHTML = objStepHeaderContent.innerHTML; var objList = objHeaderStepInfoLoc.querySelectorAll("*[id]"); for (var i = 0; i < objList.length; i++) objList[i].removeAttribute("id"); }

 
 var objStepComponentHeaderLoc = document.querySelector(this.CSSID_STEP_COMPONENT_HEADER_LOC); if (objStepComponentHeaderLoc && ptUtil.isClassMember(ptUtil.id(this.ID_PAGE_WRAPPER), this.CSS_MODE_OPTIMIZED)) {
 objStepComponentHeaderLoc.innerHTML = objStepHeaderContent.innerHTML; var objList = objStepComponentHeaderLoc.querySelectorAll("*[id]"); for (var i = 0; i < objList.length; i++) objList[i].removeAttribute("id"); }

 }
 }

 var objStepButton = this.getStepButtonObject(this.currentStepId); if (objStepButton) {
 var stepProgress = objStepButton.getAttribute("stepProgress"); var objProgressStepProgress = document.querySelector(this.CSSID_PROGRESS_STEP_PROGRESS); if (objProgressStepProgress) objProgressStepProgress.style.width = ((stepProgress) ? stepProgress : "0"); var stepNumber = objStepButton.getAttribute("stepNumber"); var objProgressStepNumber = document.querySelector(this.CSSID_PROGRESS_STEP_NUMBER); if (objProgressStepNumber) objProgressStepNumber.innerHTML = ((stepNumber) ? stepNumber : ""); var stepLabel = objStepButton.getAttribute("stepLabel"); var objProgressBar = document.querySelector(this.CSSID_PROGRESS_BAR); if (objProgressBar) objProgressBar.title = ((stepLabel) ? stepLabel : ""); }

 }, 


 
 
 
 stepKeyboardEventHandler : function (pEvent, pStepId) {

 var keyCode = (pEvent.which || pEvent.keyCode); switch (keyCode) {
 case 13: 
 case 32: 
 ptgpPage.openStep(pStepId, false); break; case 37: 
 case 38: 
 case 39: 
 case 40: 
 var objProcess = document.querySelector(this.CSSID_PROCESS_NAV_LIST); if (objProcess) {

 var objList = objProcess.querySelectorAll("li." + this.CSS_STEP + ", li." + this.CSS_STEP_GROUP); for (var i = 0; i < objList.length; i++) {

 var obj = objList[i]; var objStepId = this.getPtgpId(obj); if (objStepId == pStepId) {

 var objNewStepIndex = -1;  switch (keyCode) {
 case 37: 
 case 38: 
 objNewStepIndex = ((i > 0) ? i - 1 : 0); break; case 39: 
 case 40: 
 objNewStepIndex = ((i < objList.length - 1) ? i + 1 : objList.length - 1); break; }

 if (objNewStepIndex != i) {
 var objNewStep = objList[objNewStepIndex]; if (objNewStep) {

 
 if (objNewStep.parentNode.parentNode != objProcess) {
 ptUtil.addClass(objNewStep.parentNode.parentNode.parentNode, this.CSS_STEP_GROUP_OPEN); }

 
 var newStepId = this.getPtgpId(objNewStep); var objStepButton = this.getStepButtonObject(newStepId); objStepButton.scrollIntoView(true); objStepButton.focus(); }
 }

 
 break; }

 }

 }
 break; }

 } 

};