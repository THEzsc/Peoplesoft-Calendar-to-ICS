
PT_typeahead.prototype.SetProperties = function(xElem, xColNum, xHidden,xserverCode,
 xignoreCase,xmatchAnywhere,xmatchTextBoxWidth,
 xshowNoMatchMessage,xuseTimeout,xtheVisibleTime)
{
 var props={
 elem:xElem,
 colnum:xColNum,
 hidden:xHidden,
 serverCode:xserverCode,
 regExFlags: ( (xignoreCase)?"i":""),
 regExAny:((xmatchAnywhere)?"":"^"), 
 matchAnywhere:xmatchAnywhere,
 matchTextBoxWidth:xmatchTextBoxWidth,
 theVisibleTime:xtheVisibleTime,
 showNoMatchMessage:xshowNoMatchMessage,
 useTimeout:xuseTimeout,
 arrOptions:new Array(),
 arrHeaders:new Array()
 }; this.AddHandler(xElem); return props;};PT_typeahead.prototype.AddHandler = function(objText){
 objText.onblur=function(){
 ptTAObj_win0.bLostFocus = true; if(this.obj.useTimeout) {
 ptTAObj_win0.StartTimeout(); }
 }
};PT_typeahead.prototype.resetTextBox = function(theTextBox){
 this.theTextBox=theTextBox;};PT_typeahead.prototype.OnPromptLaunch = function(oDoc) {
 if (!oDoc || typeof oDoc == 'undefined') return; el=oDoc.getElementById('pt_typeahead0'); if (el && typeof el != 'undefined')
 el.innerHTML="<span id='pt_typeahead' class='spanTextDropdown'></span>";};PT_typeahead.prototype.KeyUpDown = function(e) {
 if (typeof ptTAObj_win0.oWin == 'undefined') 
 return; this.bTabPressed = false; this.bKeyUp = false; this.bKeyDown = false; var intKey=-1; ptTAObj_win0.bLostFocus = false; if (this.theTextBox)
 addchg_win0(this.theTextBox); if (ptTAObj_win0.oWin.event) 
 intKey=ptTAObj_win0.oWin.event.keyCode; else
 intKey = e.which; if (intKey == this.CTRL) 
 return true; if (intKey == this.ALT) { 
 ptTAObj_win0.EraseDelayTime();  return true; }
 if(intKey==this.UPARROW){
 this.bKeyUp = true; ptTAObj_win0.MoveHighlight(-1); ptTAObj_win0.GrabHighlighted(); return true; }
 else if(intKey==this.DOWNARROW){
 this.bKeyDown = true; ptTAObj_win0.MoveHighlight(1); ptTAObj_win0.GrabHighlighted(); return true; }
 else if(intKey==this.ENTER){ 
 if(this.currentValueSelected >= 0){
 var xVal = this.currentValueSelected + this.startPos; this.SetText(xVal); }
 return true; }
 else if(intKey==this.ESCAPE) {
 ptTAObj_win0.HideTheBox();  return true; }
 else if(intKey==this.TAB) {
 this.bTabPressed = true;  if (isFModeLayout())
 typeAheadPositionTopClear()
 else
 ptTAObj_win0.HideTheBox();   if (this.theTextBox != null) {
 var thisObj = this.theTextBox.attributes.getNamedItem('onchange'); if (thisObj != null && thisObj.nodeValue != null) 
 this.theTextBox.onchange();  if (pm)
 pm.updateEventAfterTypeahead();  }
 return true; }
 return false;};PT_typeahead.prototype.GiveOptions = function(e) {
 if (typeof ptTAObj_win0.oWin == 'undefined') 
 return; this.PositionTop(getEventTarget(e)); var intKey=-1; if (ptTAObj_win0.oWin.event) { 
 intKey=ptTAObj_win0.oWin.event.keyCode; this.theTextBox=ptTAObj_win0.oWin.event.srcElement; }
 else{
 intKey = e.which; this.theTextBox = e.target; }
 if (intKey == this.CTRL || intKey == this.TAB) { 
 this.lastIntKey = intKey;  return true; }
 if (intKey == this.SHIFT || intKey == this.END) { 
 this.lastIntKey = intKey;  return true; }

 if (ptTAObj_win0.CancelTypeAhead(this.theTextBox)) return false;  if (intKey == this.BACKSPACE || this.lastIntKey != this.BACKSPACE) {
 ptTAObj_win0.EraseDelayTimeout(); }

 
 if ((intKey == this.SHIFT && this.lastIntKey == this.TAB) ||
 (intKey == this.SHIFT && this.lastIntKey == this.SHIFT)) { 
 this.lastIntKey = intKey; return false; } 

 this.lastIntKey = intKey; if((intKey>=this.LEFTARROW && intKey<=this.DOWNARROW)) {
 return false; }

 
 if (intKey==48||intKey==57||intKey==this.EQUALSIGN||
 intKey==this.FORWARDSLASH||intKey==this.OPENBRACKET || intKey==this.BACKSLASH ||intKey==this.CLOSEBRACKET ) {
 var regE = new RegExp(this.UnsupportedKeycode,this.theTextBox.obj.regExFlags);  this.theTextBox.value=this.theTextBox.value.replace(regE,''); this.theTextBox.value=this.theTextBox.value.replace(']','');  this.theTextBox.value=this.theTextBox.value.replace('[',''); }
 ptTAObj_win0.resetTextBox(this.theTextBox); if(this.theTextBox.value.length==0&&!this.isOpera){ 
 this.InitArrOptions(); ptTAObj_win0.HideTheBox(); ptTAObj_win0.strLastValue=''; }
 if(this.objLastActive==this.theTextBox){
 if(intKey==this.ENTER){ 
 ptTAObj_win0.GrabHighlighted(); this.theTextBox.blur(); }
 } 
 if (this.theTextBox.value.length==0) 
 ptTAObj_win0.HideTheBox(); else {
 if ( ptTAObj_win0.bInProcess || (this.objLastActive!=this.theTextBox) ||
 ((this.theTextBox.value.length!=0) && (this.theTextBox.value.length > ptTAObj_win0.strLastValue.length)) ||
 (this.theTextBox.value.indexOf(ptTAObj_win0.strLastValue)!=0) ||
 (this.GetArrOptions().length==0 && !this.bNoResults) ||
 (this.theTextBox.value.length <= ptTAObj_win0.strLastValue.length) ) {
 ptTAObj_win0.StartDelayTimeout(); } else {
 if (this.theTextBox.obj.nMaxRows==this.GetArrOptions().length)
 ptTAObj_win0.DoTypeAhead(); else {
 ptTAObj_win0.BuildList(this.theTextBox.value); }
 }
 }
 return true;};PT_typeahead.prototype.DoTypeAhead = function(){

 var mObj = this.GetContainerEl(); var theMatch = null; if (isFModeLayout() && mObj) {
 var sQuery = mObj.getAttribute('sQueryValue'); if (sQuery) {
 var pattern = this.GetRegExPattern(this.theTextBox, sQuery); if (pattern.length > 0) {
 var regExp = new RegExp(pattern, this.theTextBox.obj.regExFlags); theMatch = ptTAObj_win0.theTextBox.value.match(regExp); }
 }
 }

 if (theMatch || ((this.GetArrOptions().length > 0 && !this.bNoResults)
 && (this.objLastActive == null || this.objLastActive.id == this.theTextBox.id)
 && this.theTextBox.value.indexOf(ptTAObj_win0.strLastValue) == 0
 ))
 {
 var bShowMatch = this.theTextBox.obj.showNoMatchMessage; this.theTextBox.obj.showNoMatchMessage = false; ptTAObj_win0.BuildList(this.theTextBox.value); this.theTextBox.obj.showNoMatchMessage = bShowMatch; if (!this.bNoResults) {
 ptTAObj_win0.strLastValue=this.theTextBox.value; return; }
 }

 if (ptTAObj_win0.theTextBox.value.length==0 || typeof ptTAObj_win0.theTextBox.value == "undefined") 
 ptTAObj_win0.HideTheBox(); else {
 this.ResetContainerEl(); ptTAObj_win0.bMadeRequest=true; ptTAObj_win0.bInProcess = true; ptTAObj_win0.TypeAhead(ptTAObj_win0.theTextBox.value); ptTAObj_win0.objLastActive=ptTAObj_win0.theTextBox; ptTAObj_win0.sQueryValue = ptTAObj_win0.theTextBox.value; ptTAObj_win0.bInProcess = false; }
 ptTAObj_win0.strLastValue=this.theTextBox.value;};function getCaretPos(focusEle)
{
 var caretPos = undefined; var range, textInputRange, len, endRange;  if (typeof focusEle.selectionStart == "number") {
 caretPos = focusEle.selectionStart; } else {
 range = document.selection.createRange(); if (range && range.parentElement() == focusEle) {
 len = focusEle.value.length;  textInputRange = focusEle.createTextRange(); textInputRange.moveToBookmark(range.getBookmark());    endRange = focusEle.createTextRange(); endRange.collapse(false); if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
 caretPos = len; } else {
 caretPos = -textInputRange.moveStart("character", -len); }
 }
 }
 

 return caretPos;};function setCaretPos(ele, caretPos){
 if (ele.focus)
 ele.focus(); else if (ele.setActive)
 ele.setActive();  if (caretPos == undefined)
 {
 return; }

 if(ele.setSelectionRange)
 {
 ele.setSelectionRange(caretPos, caretPos); }
 else if (ele.createTextRange) {
 var range = ele.createTextRange(); range.collapse(true); range.moveEnd('character', caretPos); range.moveStart('character', caretPos); range.select(); }


};function saveTALostFocus()
{
 if (ptTAObj_win0.theTextBox != null && ptTAObj_win0.theTextBox != undefined)
 ptTAObj_win0.caretPos = getCaretPos(ptTAObj_win0.theTextBox); var lost = ptTAObj_win0.bLostFocus; return function () {
 ptTAObj_win0.bLostFocus = lost; lost = null; };}


PT_typeahead.prototype.TypeAhead = function(xStrText){
 if (ptTAObj_win0.bLostFocus) return;  if (this.CheckSpecialKeycode(xStrText))
 this.bFoundSpecialKeycode = true; ptTAObj_win0.SetOpValue(this.theTextBox); this.theTextBox.obj.hidden.value=this.theTextBox.id; ptTAObj_win0.bLostFocus = false;  addchg_win0(this.theTextBox);  eval(this.theTextBox.obj.serverCode); ptTAObj_win0.RestoreOpValue(this.theTextBox);};PT_typeahead.prototype.buildChoices = function (arrOptions, arrHeaders) {
 this.oWin.gFocusId = this.theTextBox.id; if (typeof this.oWin.modWin != 'undefined' && this.oWin.modWin != null) {
 return; }
 
 if (ptTAObj_win0.bLostFocus && !isFModeLayout()) {
 return;  }

 this.bStartNewList = 1; if (this.RestoreTextBox())
 { 
 this.theTextBox.obj.arrHeaders = arrHeaders; this.theTextBox.obj.arrOptions = arrOptions; this.theTextBox.obj.bNew = true; if (isFModeLayout()) {
 this.Close();  }
 this.BuildList(ptTAObj_win0.strLastValue.replace(/\\/g,'\\\\')); bMadeReqiest = false; this.startPos = 0; this.bFoundSpecialKeycode = false; }
};PT_typeahead.prototype.RestoreTextBox = function(){
 var tempColNum = this.theTextBox.obj.colnum; var tempMaxRows = this.theTextBox.obj.nMaxRows; this.theTextBox = document.getElementById(this.theTextBox.id); if (this.theTextBox == null || typeof this.theTextBox.id == "undefined") 
 return false;  else {
 setCaretPos(this.theTextBox, ptTAObj_win0.caretPos);  if (!this.theTextBox.obj)
 initTypeAheadEl(this.theTextBox); this.theTextBox.obj.colnum = tempColNum; this.theTextBox.obj.nMaxRows = tempMaxRows;   var thisObj = this.theTextBox.attributes.getNamedItem('onchange'); if (thisObj != null && thisObj.nodeValue != null) {
 this.theTextBox.onchange(); }
 return true; }
};PT_typeahead.prototype.EscapeHTMLSymbol = function(theText) {
 
 theText = theText.replace(/&/gi,'&amp;').replace(/'/gi, '&#039;').replace(/</gi,'&lt;').replace(/>/gi,'&gt;').replace(/%/,'&#037;').replace(/ /gi, '&nbsp;'); theText = theText.replace(/"/gi,"&quot;") 
 return theText;};PT_typeahead.prototype.TAFieldHasFocus = function() {
 var bTAFieldHasFocus = false;  if (typeof PFieldList_win0!='undefined' && PFieldList_win0) {
 for (var i = 0; i < PFieldList_win0.length; i++) {
 var fname = PFieldList_win0[i][0];  var nStop = PFieldList_win0[i][1]; for (var j=0; j<nStop; j++) { 
 var name = fname;  var nsuffix = ""; if (nStop>1) { 
 nsuffix = '$'+j;  name = fname+nsuffix; } else if (ptTAObj_win0.oDoc.getElementById(fname+'$'+j)) {
 nsuffix = '$'+j;  name = fname+nsuffix; }
 var el = ptTAObj_win0.oDoc.getElementById(name); if (el && el.getAttribute("focus") == "true") {
 bTAFieldHasFocus = true; return bTAFieldHasFocus; }
 } 
 } 
 }

 if (bTAFieldHasFocus)
 return bTAFieldHasFocus; if (typeof EFieldList_win0!='undefined' && EFieldList_win0) {
 for (var i = 0; i < EFieldList_win0.length; i++) {
 var fname = EFieldList_win0[i][0];  var nStop = EFieldList_win0[i][1]; for (var j=0; j<nStop; j++) { 
 var name = fname;  var nsuffix = ""; if (nStop>1) { 
 nsuffix = '$'+j;  name = fname+nsuffix; } else if (ptTAObj_win0.oDoc.getElementById(fname+'$'+j)) {
 nsuffix = '$'+j;  name = fname+nsuffix; }
 var el = ptTAObj_win0.oDoc.getElementById(name); if (el && el.getAttribute("focus") == "true") {
 bTAFieldHasFocus = true; return bTAFieldHasFocus; }
 } 
 } 
 }
 return bTAFieldHasFocus;};PT_typeahead.prototype.SetProcessedTypeAheadValue = function(theText) {
 this.typeAheadProcessedValue = theText;  this.bStaledResult = false;  this.currentTypeAheadField = document.getElementById(this.theTextBox.id);   if ( this.typeAheadProcessedValue == '' || 
 this.typeAheadProcessedValue != this.EscapeHTMLSymbol(this.currentTypeAheadField.value) ) {
 this.bStaledResult = true; }
};PT_typeahead.prototype.SetMaxRange = function(theTextBoxInt,nMatchLength) {
 if (isFModeLayout()) {
 this.maxRange = this.GetArrOptions().length; return; }
 var selectedPosX=0; var selectedPosY=0; var theElement=theTextBoxInt; if(!theElement) 
 return; var theElemHeight=theElement.offsetHeight; var divgbr = null; var divgbrId = null; var divgblr = null;  var divgblrId = null; this.maxRange=3; var XYposition = ptCommonObj2.getPosition2(theElement, "win0"); selectedPosY= XYposition.y; selectedPosX= XYposition.x;   var viewportHeight = ptCommonObj2.getViewportHeight(); var nBelHeightLeft = viewportHeight + document.body.scrollTop - (selectedPosY+theElemHeight);  var nAbvHeightLeft = viewportHeight - (nBelHeightLeft+theElemHeight);  var nMinHeight = theElemHeight*3;  var nBelMaxRange = Math.floor((nBelHeightLeft - nMinHeight)/theElemHeight); var nAbvMaxRange = Math.floor((nAbvHeightLeft - nMinHeight)/theElemHeight);  if (nBelMaxRange >= nMatchLength || nBelMaxRange >= this.maxRange)
 {
 if (nBelMaxRange >= nMatchLength)
 this.maxRange = nMatchLength; else
 this.maxRange = nBelMaxRange; this.ndisplay = 1;  return {x:selectedPosX, y:(selectedPosY+theElemHeight)}; }
 else if (nAbvMaxRange>= nMatchLength || nAbvMaxRange >= this.maxRange) 
 {
 if (nAbvMaxRange >= nMatchLength) 
 this.maxRange = nMatchLength; else
 this.maxRange = nAbvMaxRange; this.ndisplay = 0;  return {x:selectedPosX, y:selectedPosY}; }
 else if (nBelMaxRange > nAbvMaxRange && nBelMaxRange > 0) 
 {
 this.maxRange = nBelMaxRange; this.ndisplay = 1;  return {x:selectedPosX, y:(selectedPosY+theElemHeight)}; }
 else if (nAbvMaxRange > 0)
 {
 this.maxRange = nAbvMaxRange; this.ndisplay = 0;  return {x:selectedPosX, y:selectedPosY};  }
 else 
 {
 this.maxRange = 1; this.ndisplay = 1;  return {x:selectedPosX, y:(selectedPosY+theElemHeight)}; }


};PT_typeahead.prototype.BuildList = function(theText){

 if (isFModeLayout())
 return this.BuildListF(theText);  if (this.bTabPressed) {
 this.bTabPressed = false; return; }
 
 
 if (this.bStaledResult) {
 return;  } 
 
 var theElemWidth=this.theTextBox.offsetWidth; var theMatches = null; var matchGrid = null; var xPosElement = this.GetContainerEl(); this.SetMatchesArr(theText); var mLengthA= ptTAObj_win0.arrMatches.length; var boxPos = this.SetMaxRange(this.theTextBox,mLengthA);  theMatches = this.MakeMatchesArr(theText); if(theMatches.length>0) 
 matchGrid=this.CreateGrid(theMatches,mLengthA); if (matchGrid) {
 xPosElement.innerHTML=matchGrid; ptTAObj_win0.oDoc.getElementById("OptionsList_0").className="spanNormalElement"; this.currentValueSelected=-1; this.bNoResults=false; if (this.ndisplay == 0) { 
 
 
 if (this.bStartNewList) {
 this.bStartNewList = 0;  var nListH = this.maxRange * this.theTextBox.offsetHeight + this.theTextBox.offsetHeight; if (this.bScrolldownImage) 
 nListH = nListH + 3; boxPos.y = boxPos.y - nListH; }
 else
 boxPos.y = boxPos.y - xPosElement.scrollHeight; }
 }
 else {
 this.bStartNewList = 0; this.currentValueSelected=-2; this.bNoResults=true; if(this.theTextBox.obj.showNoMatchMessage) 
 this.GetContainerEl().innerHTML="<span class='noMatchData' style='white-space:nowrap;background-color: rgb(226,226,226);'>"+this.noMatchingDataMessage+"</span>";  else 
 this.HideTheBox(); }

 this.SetElementPosition(this.theTextBox, boxPos.x, boxPos.y);};PT_typeahead.prototype.BuildListF = function(theText){
 
 if (this.bTabPressed) {
 this.bTabPressed = false; return; }
 
 
 if (this.bStaledResult) {
 return;  } 
 
 var theElemWidth=this.theTextBox.offsetWidth; var theMatches = null; var matchGrid = null; var xPosElement = this.GetContainerEl(); this.SetMatchesArr(theText); var mLengthA= ptTAObj_win0.arrMatches.length; var boxPos = this.SetMaxRange(this.theTextBox,mLengthA);  theMatches = this.MakeMatchesArr(theText); if(theMatches.length>0) 
 matchGrid=this.CreateGridF(theMatches,mLengthA); if (matchGrid) {
 xPosElement.innerHTML=matchGrid; this.currentValueSelected=-1; this.bNoResults=false; if (this.ndisplay == 0) { 
 
 
 if (this.bStartNewList) {
 this.bStartNewList = 0;  var nListH = this.maxRange * this.theTextBox.offsetHeight + this.theTextBox.offsetHeight; if (this.bScrolldownImage) 
 nListH = nListH + 3; boxPos.y = boxPos.y - nListH; }
 else
 boxPos.y = boxPos.y - xPosElement.scrollHeight; }
 }
 else {
 this.bStartNewList = 0; this.currentValueSelected=-2; this.bNoResults=true; if(this.theTextBox.obj.showNoMatchMessage) 
 this.GetContainerEl().innerHTML="<span class='noMatchData' style='white-space:nowrap;background-color: rgb(226,226,226);'>"+this.noMatchingDataMessage+"</span>";  else 
 this.HideTheBox(); }

 var mObj = document.getElementById(this.theTextBox.id + '$typeahead'); if (!mObj) {
 mObj = document.createElement('div'); mObj.innerHTML = xPosElement.innerHTML; }
 if (!mObj.id || isHidden(mObj) || (mObj.id && mObj.id.indexOf('$typeahead') == -1)) {
 var sOptions = ""; mObj.setAttribute('id', this.theTextBox.id + '$typeahead'); mObj.setAttribute('sQueryValue', ptTAObj_win0.sQueryValue); var sOptions = "bPIA@1;bCache@1;sCacheParentId@pt_typeahead0;nAlign@1;bAnm@0;bPopup@1;bVertical@1;bTail@0;bResize@0;bHeader@0;bMask@0;bAutoClose@0;sStyle@ps_typeahead_modal;"; if (sOptions.indexOf("sPopupParent") == -1)
 sOptions += "sPopupParentId@" + this.theTextBox.id + ";"; mObj.setAttribute('options', sOptions); if (isHidden(mObj))
 removeHide(mObj); bLocalModal = true; addDivPopup(mObj, window, sOptions); playDivPopup(); }
 
 if (matchGrid) this.Resize();};PT_typeahead.prototype.SetColNum = function(colnum,nMaxRows){
 this.theTextBox.obj.colnum=colnum; this.theTextBox.obj.nMaxRows=nMaxRows;}; PT_typeahead.prototype.SetElementPosition = function(theTextBoxInt, selectedPosX, selectedPosY ){
 var theElement=theTextBoxInt; if(!theElement) 
 return; var theElemHeight=theElement.offsetHeight; var theElemWidth=theElement.offsetWidth; var el = ptTAObj_win0.oDoc.getElementById("pt_typeahead0"); if (el && typeof el != 'undefined')
 el.style.display='block';  var xPosElement = this.GetContainerEl(); if('ltr' == 'ltr') 
 xPosElement.style.left = selectedPosX + "px";  else {
 var viewportWidth = ptCommonObj2.getViewportWidth();   xPosElement.style.left = "-9999px"; xPosElement.style.right = "9099px"; xPosElement.style.display='block';  var adjustWidth = 0; var ttableEle = ptTAObj_win0.oDoc.getElementById("ttable"); if (ttableEle != null)
 adjustWidth = ttableEle.offsetWidth; xPosElement.style.display='none'; if (browserInfoObj2.isiPad && browserInfoObj2.isSafari)
 adjustWidth += 15 + 3; xPosElement.style.left = selectedPosX + theElemWidth - adjustWidth + "px";  xPosElement.style.right = viewportWidth - selectedPosX - theElemWidth + "px";  }

 if(theTextBoxInt.obj.matchTextBoxWidth)
 xPosElement.style.width=theElemWidth; xPosElement.style.top=selectedPosY + "px"; xPosElement.style.display='block';  if(theTextBoxInt.obj.useTimeout){
 xPosElement.onmouseout=ptTAObj_win0.StartTimeout; xPosElement.onmouseover=ptTAObj_win0.EraseTimeout; }
 else {
 xPosElement.onmouseout=null; xPosElement.onmouseover=null; } 
 
 
};PT_typeahead.prototype.SetOpValue = function(theTextBox) {
 var name=theTextBox.id; if (name.indexOf('$to')>0)
 name = name.split('$')[0]; var elOP=this.oWin.document.getElementById(name+"$op"); if (elOP==null || elOP.value=="1") return; ptTAObj_win0.opValue=elOP.value; elOP.value=1; return;};PT_typeahead.prototype.RestoreOpValue = function(theTextBox) {
 var name=theTextBox.id; if (name.indexOf('$to')>0)
 name = name.split('$')[0]; var elOP=this.oWin.document.getElementById(name+"$op"); if (elOP==null) return; if (ptTAObj_win0.opValue != -1) {
 elOP.value = ptTAObj_win0.opValue; ptTAObj_win0.opValue = -1; }
 return;};PT_typeahead.prototype.CancelTypeAhead = function(theTextBox) {
if (!ptCommonObj2.isSearchPage(this.oForm)) return false; var name=theTextBox.id; if (name.indexOf('$to')>0)
 name = name.split('$')[0]; var elOP=this.oWin.document.getElementById(name+"$op"); if (elOP==null ||elOP.value=="1" || elOP.value=="2") 
 return false;  else 
 return true;};PT_typeahead.prototype.GetRegExPattern = function(theTextBox,compareStr) {
  
 return theTextBox.obj.regExAny+compareStr; };PT_typeahead.prototype.SetMatchesArr = function(xCompareStr){
 this.countForId=0; this.currentTotalRow=0;  ptTAObj_win0.arrMatches=new Array(); var tmpArray=new Array(); this.DecodeArrOptions(); if (!this.bFoundSpecialKeycode) {
 var pattern=this.GetRegExPattern(this.theTextBox,xCompareStr); if(pattern.length > 0) { 
 var regExp=new RegExp(pattern,this.theTextBox.obj.regExFlags); for(var i=0;i<this.GetArrOptions().length;i++){
 var theMatch=this.GetArrOptions()[i][this.theTextBox.obj.colnum].match(regExp); if (theMatch) {
 tmpArray[ptTAObj_win0.arrMatches.length]=this.GetArrOptions()[i][this.theTextBox.obj.colnum]; ptTAObj_win0.arrMatches[ptTAObj_win0.arrMatches.length]=this.GetArrOptions()[i]; }
 }
 }
 } 
 else {
 for(var i=0;i<this.GetArrOptions().length;i++) {
 var str = this.GetArrOptions()[i][this.theTextBox.obj.colnum]; var theMatch = this.StrStartsWith(str, xCompareStr); if (theMatch) {
 tmpArray[ptTAObj_win0.arrMatches.length]=this.GetArrOptions()[i][this.theTextBox.obj.colnum]; ptTAObj_win0.arrMatches[ptTAObj_win0.arrMatches.length]=this.GetArrOptions()[i]; }
 }
 }
};PT_typeahead.prototype.StrStartsWith = function(str, prefix) 
{
 if ((str == null) || (prefix == null))
 return false;  var str1 = str.substring(0, prefix.length).toUpperCase(); var str2 = prefix.toUpperCase(); if (str1 === str2)
 return true; else
 return false;};PT_typeahead.prototype.CheckSpecialKeycode = function(str) {
 for (var i=0; i< this.SpecialKeycode.length; i++) {
 if (str.indexOf(this.SpecialKeycode.charAt(i)) != -1) 
 return true; }
 return false;}; PT_typeahead.prototype.MakeMatchesArr = function(xCompareStr){
 this.countForId=0; this.currentTotalRow=0; var matchArray=new Array(); for(var i=this.startPos;(i<ptTAObj_win0.arrMatches.length && (i-this.startPos)<this.maxRange);i++){
 var matchRowArr=new Array(); for (var j=0;j<this.GetArrOptions()[i].length;j++) {
 if (j==this.theTextBox.obj.colnum) {
 matchRowArr[matchRowArr.length]=this.CreateBold(ptTAObj_win0.arrMatches[i][j],xCompareStr,i); }
 else 
 matchRowArr[matchRowArr.length]=this.CreateBoldOtherCol(ptTAObj_win0.arrMatches[i][j],i); }
 matchArray[matchArray.length]=matchRowArr; }
 return matchArray;};PT_typeahead.prototype.CheckDup = function(tmpArray,value){
 
 return false;};PT_typeahead.prototype.ScrollUp = function(){
 this.startPos = this.startPos - this.maxRange+1; if (this.startPos < 0 )
 this.startPos = 0; this.BuildList(ptTAObj_win0.strLastValue); var xPosElement = this.GetContainerEl(); xPosElement.onmouseover(); this.MoveHighlight(1);};PT_typeahead.prototype.ScrollDown = function(){
 this.startPos = this.startPos + this.maxRange-1; if (this.startPos < ptTAObj_win0.arrMatches.length)
 this.BuildList(ptTAObj_win0.strLastValue); var xPosElement = this.GetContainerEl(); xPosElement.onmouseover(); this.MoveHighlight(1);};PT_typeahead.prototype.CreateGrid = function(matchArray,mLengthA) {
 var matchGrid = this.tableStart; this.bScrolldownImage=0;  if (this.arrHeaders.length>0){
 matchGrid +=this.trStart; for (var i=0;i<this.arrHeaders.length;i++) 
 matchGrid +=this.thStart+this.arrHeaders[i]+this.thEnd; matchGrid +=this.trEnd; }
 var odd=true; var mLength = matchArray.length; var nCol = matchArray[0].length;  if (browserInfoObj2.isiPad && browserInfoObj2.isSafari) {
 var sCloseTAResult = "<img align='right' src='"+this.url_close+"'/ onclick='ptTAObj_win0.HideTheBox()'>"; matchGrid=matchGrid+this.trStart; matchGrid=matchGrid+sCloseTAResult;  matchGrid=matchGrid+this.trEnd; }
 if (browserInfoObj2.isiPad && browserInfoObj2.isSafari) { 
 var sScrollUp = "<img align='absmiddle' src='"+this.url_up+"'/ onclick='ptTAObj_win0.ScrollUp()'>"; } else {
 var sScrollUp = "<img align='absmiddle' src='"+this.url_up+"'/ onmouseover='ptTAObj_win0.ScrollUp()'>"; } 
 sScrollUp = this.tdScrollStart+nCol+"'>"+sScrollUp+this.tdEnd
 if (this.startPos>0 && (mLength>=this.maxRange || this.startPos+mLength==mLengthA)){
 matchGrid=matchGrid+this.trStart; matchGrid=matchGrid+sScrollUp;  matchGrid=matchGrid+this.trEnd; }
 odd=false; for (var i=0;i<matchArray.length;i++){
 matchGrid += this.trStart; for (var j=0;j<matchArray[i].length;j++){
 if (odd) matchGrid += this.tdODDStart+matchArray[i][j]+this.tdEnd; else matchGrid += this.tdEVENStart+matchArray[i][j]+this.tdEnd; }
 if (odd) 
 odd=false;  else 
 odd=true; matchGrid += this.trEnd; }
 if (((this.startPos+this.maxRange) < ptTAObj_win0.arrMatches.length) && mLength>=this.maxRange){
 if (browserInfoObj2.isiPad && browserInfoObj2.isSafari) { 
 var sScrollDown = "<img align='absmiddle' src='"+this.url_dn+"'/ onclick='ptTAObj_win0.ScrollDown()'>"; } else {
 var sScrollDown = "<img align='absmiddle' src='"+this.url_dn+"'/ onmouseover='ptTAObj_win0.ScrollDown()'>"; }
 this.bScrolldownImage=1;  sScrollDown = this.tdScrollStart+nCol+"'>"+sScrollDown+this.tdEnd; matchGrid=matchGrid+this.trStart;  matchGrid=matchGrid+sScrollDown;  matchGrid=matchGrid+this.trEnd; }
 matchGrid += this.tableEnd; return matchGrid;};PT_typeahead.prototype.CreateGridF = function (matchArray, mLengthA) {
 
 var matchGrid = "<div class='ps_box-gridc' id='" + getPageFormName(this.theTextBox) + "div" + this.theTextBox.id + "gridc'>"; matchGrid += "<div class='ps_box-grid ps_box-grid-head' id='" + getPageFormName(this.theTextBox) + "div" + this.theTextBox.id + "colhdr'>"; matchGrid += "<table class='ps_grid-flex ps_grid-flex-head'>"; var arrHeaders = this.GetArrHeaders(); if (arrHeaders.length > 0) {
 matchGrid += "<thead class='ps_grid-head'>"; matchGrid += this.trHStart; for (var i = 0; i < arrHeaders.length; i++)
 matchGrid += this.thStart + arrHeaders[i] + this.thEnd; matchGrid += this.trEnd; matchGrid += "</thead>"; }
 matchGrid += this.tableEnd; matchGrid += "</div>"; matchGrid += "<div class='ps_box-grid ps_box-grid-typeahead ps_scrollable sbar sbar_v ps_scrollable_v' id='" + getPageFormName(this.theTextBox) + "div" + this.theTextBox.id + "grid' onscroll='ptTAObj_win0.EraseTimeout();' onmouseup=\"setFocus_win0('"+this.theTextBox.id+"');\">"; matchGrid += this.tableStart;  if (arrHeaders.length > 0) {
 matchGrid += "<thead class='ps_grid-head psc_invisible'>"; matchGrid +=this.trHStart; for (var i = 0; i < arrHeaders.length; i++)
 matchGrid += this.thStart + arrHeaders[i] + this.thEnd; matchGrid += this.trEnd; matchGrid += "</thead>"; }
 var mLength = matchArray.length; var nCol = matchArray[0].length;  matchGrid += "<tbody class='ps_grid-body'>"; for (var i=0;i<matchArray.length;i++){
 matchGrid += "<tr class='ps_grid-row' onclick='ptTAObj_win0.SetText(" + i + ");typeAheadPositionTopClear();'>";  for (var j=0;j<matchArray[i].length;j++){
 matchGrid += this.tdStart+matchArray[i][j]+this.tdEnd; }
 matchGrid += this.trEnd; } 
 matchGrid += "</tbody>";  matchGrid += this.tableEnd + "</div>"; matchGrid += "</div>"; return matchGrid;};PT_typeahead.prototype.CreateBold = function(xStr,xTextMatch,xVal) { 
 var selectSpanMid = ""; if (!isFModeLayout())
 selectSpanMid="onclick='ptTAObj_win0.SetText("+xVal+")'"; selectSpanMid += " id='OptionsList_" + this.countForId + "' theArrayNumber='" + xVal + "'>"; if (!this.bFoundSpecialKeycode) {
 var regExp=new RegExp(xTextMatch,this.theTextBox.obj.regExFlags);  aStart=xStr.search(regExp); } else {
 aStart = this.StrStartsWith(xStr, xTextMatch) ? 0 : -1; }
 xTextMatch = xTextMatch.replace(/\\\\/g,'\\');   var preMatchedText = xStr.substring(0, aStart);  var matchedText=xStr.substring(aStart,aStart+xTextMatch.length); var postMatchedText = xStr.substring(aStart+xTextMatch.length); if (isFModeLayout() && postMatchedText.length == 0)
 this.SetText(xVal); this.countForId++; this.currentTotalRow++; return this.selectSpanStart+selectSpanMid+this.EscapeHTMLSymbol(preMatchedText)+this.undeStart+this.EscapeHTMLSymbol(matchedText)+this.undeEnd+this.EscapeHTMLSymbol(postMatchedText)+this.selectSpanEnd;};PT_typeahead.prototype.CreateBoldOtherCol = function(xStr,xVal) {
 selectSpanMid="onclick='ptTAObj_win0.SetText("+xVal+")'"+"id='OptionsList_"+this.countForId+"' theArrayNumber='"+xVal+"'>"; this.countForId++;  return this.selectSpanStart+selectSpanMid+this.EscapeHTMLSymbol(xStr)+this.selectSpanEnd;};PT_typeahead.prototype.MoveHighlight = function(xDir){
 if(this.currentValueSelected>=-1){
 newValue=parseInt(this.currentValueSelected)+parseInt(xDir); if(newValue>-1 && newValue<this.currentTotalRow){ 
 this.currentValueSelected=newValue; this.SetHighColor(null, xDir); }
 if (newValue == this.currentTotalRow && ((this.startPos+this.maxRange) < ptTAObj_win0.arrMatches.length)){
 this.ScrollDown(); this.currentValueSelected=0; ptTAObj_win0.GrabHighlighted(); this.MoveHighlight(xDir); }
 if (newValue == -1 && this.startPos>0){
 this.ScrollUp(); this.currentValueSelected=this.currentTotalRow; ptTAObj_win0.GrabHighlighted(); this.MoveHighlight(xDir); }
 }
};PT_typeahead.prototype.SetHighColor = function(theTextBox, xDir){
 if(theTextBox){
 this.currentValueSelected=theTextBox.id.slice(theTextBox.id.indexOf("_")+1,theTextBox.id.length); }
 var odd=false; var totalCol=ptTAObj_win0.arrMatches[0].length; for(i=0;i<this.currentTotalRow;i++){
 var tObj = ptTAObj_win0.oDoc.getElementById('OptionsList_'+i*totalCol); var trObj = tObj.parentNode.parentNode; for (var j=0; j<trObj.childNodes.length; j++) {
 if (isFModeLayout()) {
 removeSelected(trObj); }
 else {
 var node = trObj.childNodes[j]; if (odd)
 node.className = 'PSSRCHRESULTSODDROW'; else
 node.className = 'PSSRCHRESULTSEVENROW'; }
 }
 if (odd) odd=false; else odd=true; }

 
 if (theTextBox) {
 var selectOBJ=ptTAObj_win0.oDoc.getElementById('OptionsList_'+this.currentValueSelected); this.currentValueSelected = selectOBJ.getAttribute("theArrayNumber") - this.startPos;  }
 else
 var selectOBJ=ptTAObj_win0.oDoc.getElementById('OptionsList_'+this.currentValueSelected*totalCol);  var trObj = selectOBJ.parentNode.parentNode; if (isFModeLayout()) {
 addSelected(trObj);  var objScroll = this.GetScrollContainer(); if (objScroll) {
 var nRowH = trObj.clientHeight; if (xDir == 1 && this.currentValueSelected > 0)
 objScroll.scrollTop += nRowH; else
 objScroll.scrollTop -= nRowH; }
 }
 else {
 for (var j = 0; j < trObj.childNodes.length; j++) {
 var node = trObj.childNodes[j]; node.className = 'spanHighElement'; }
 }
};PT_typeahead.prototype.IsSelectedUnique = function(xVal){
 var bUnique = true;  var selectedValue; var aboveValue; var belowValue;  selectedValue = this.DecodeValue(ptTAObj_win0.arrMatches[xVal][this.theTextBox.obj.colnum]); if (xVal > 0) 
 aboveValue = this.DecodeValue(ptTAObj_win0.arrMatches[xVal -1][this.theTextBox.obj.colnum]); if (xVal + 1 < ptTAObj_win0.arrMatches.length) 
 belowValue= this.DecodeValue(ptTAObj_win0.arrMatches[xVal + 1][this.theTextBox.obj.colnum]); if (selectedValue == aboveValue || selectedValue == belowValue)
 bUnique = false; return bUnique; };PT_typeahead.prototype.GetIndexBasedOnSelectedVal = function(xVal) {
 var index = 0; var i = xVal; var aboveValue; var selectedValue = this.DecodeValue(ptTAObj_win0.arrMatches[xVal][this.theTextBox.obj.colnum]); while (i > 0) {
 aboveValue = this.DecodeValue(ptTAObj_win0.arrMatches[i -1][this.theTextBox.obj.colnum]); if (selectedValue == aboveValue) 
 i--; else
 break; }
 index = xVal - i; return index;};PT_typeahead.prototype.UpdateControlField = function(xVal) {
 if (ptCommonObj2.isSearchPage(this.oForm)) return;  var rowNum = this.GetIndexBasedOnSelectedVal(xVal);  var val = '#ICRow' + rowNum; document.win0.target = window.id; document.win0.ICAction.value = val; aAction_win0(document.win0, val);};PT_typeahead.prototype.SetText = function(xVal){
 if ((this.theTextBox).focus)
 (this.theTextBox).focus(); else if ((this.theTextBox).setActive)
 (this.theTextBox).setActive();  this.theTextBox.value=this.DecodeValue(ptTAObj_win0.arrMatches[xVal][this.theTextBox.obj.colnum]);  if (!ptTAObj_win0.IsSelectedUnique(xVal)) {
 this.UpdateControlField(xVal); } 
 addchg_win0(this.theTextBox);   var thisObj = this.theTextBox.attributes.getNamedItem('onchange'); if (thisObj != null && thisObj.nodeValue != null) 
 this.theTextBox.onchange();  if (browserInfoObj2.isiPad && browserInfoObj2.isSafari) {
 ptTAObj_win0.HideTheBox();  } 
};PT_typeahead.prototype.DecodeValue = function(xVal) {
 var newValue=xVal;  newValue = newValue.replace(/&quot;/gi,'"');  newValue = newValue.replace(/&#039;/gi, '\'').replace(/&acute;/gi,'\'').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&#037;/,'%').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi,'&');  return newValue;};PT_typeahead.prototype.GrabHighlighted = function(){
 if(this.currentValueSelected>=0){
 this.bGrabHighlighted = true; var xVal = this.currentValueSelected+this.startPos;  this.theTextBox.value=this.DecodeValue(ptTAObj_win0.arrMatches[xVal][this.theTextBox.obj.colnum]); }
};PT_typeahead.prototype.AutoWinAdj = function(xPosElement){
 ptTAObj_win0.bodyScrollLeft=ptTAObj_win0.oDoc.body.scrollLeft;  ptTAObj_win0.bodyScrollTop=ptTAObj_win0.oDoc.body.scrollTop; var t1=parseInt(xPosElement.offsetHeight,10); var t2=parseInt(document.body.offsetHeight,10)-(parseInt(xPosElement.style.top,10)-ptTAObj_win0.oDoc.body.scrollTop); if (t1>t2)
 ptTAObj_win0.oDoc.body.scrollTop=t1-t2+10; t1=parseInt(xPosElement.offsetWidth,10); t2=parseInt(document.body.offsetWidth,10)-(parseInt(xPosElement.style.left,10)-ptTAObj_win0.oDoc.body.scrollLeft); if (t1>t2) {
 if (ptTAObj_win0.oDoc.win0.ICActionPrompt.value=='true') {
 var o=ptTAObj_win0.oWin.parent.document.getElementById('popupContainer'); ptTAObj_win0.promptWidth = Math.max(0,o.style.width.replace('px','')); var newW=ptTAObj_win0.promptWidth+t1-t2+20+'px'; o.style.width = newW; o=ptTAObj_win0.oWin.parent.document.getElementById('popupFrame'); o.style.width = newW; o=ptTAObj_win0.oWin.parent.document.getElementById("popupTitleBar"); o.style.width = newW; }
 var selectedPosX=0; var selectedPosY=0; var theElement=xPosElement; if(!theElement) return; var theElemHeight=theElement.offsetHeight; var theElemWidth=theElement.offsetWidth; while(theElement!=null){
 selectedPosX+=theElement.offsetLeft; selectedPosY+=theElement.offsetTop; theElement = theElement.offsetParent; }
 if ((t1-t2+20) > selectedPosX)
 ptTAObj_win0.oDoc.body.scrollLeft=selectedPosX-20; else
 ptTAObj_win0.oDoc.body.scrollLeft=t1-t2+20; }
};PT_typeahead.prototype.AutoWinUnAdj = function(){
 ptTAObj_win0.oDoc.body.scrollLeft=ptTAObj_win0.bodyScrollLeft;  ptTAObj_win0.oDoc.body.scrollTop=ptTAObj_win0.bodyScrollTop;  if (!ptTAObj_win0.oDoc.win0.ICActionPrompt || ptTAObj_win0.oDoc.win0.ICActionPrompt.value!='true') {
 ptTAObj_win0.promptWidth=0;return; }
 if (ptTAObj_win0.promptWidth==0) return; var o=ptTAObj_win0.oWin.parent.document.getElementById('popupContainer'); o.style.width = ptTAObj_win0.promptWidth+'px'; o=ptTAObj_win0.oWin.parent.document.getElementById('popupFrame'); o.style.width = ptTAObj_win0.promptWidth+'px'; o=ptTAObj_win0.oWin.parent.document.getElementById("popupTitleBar"); o.style.width = ptTAObj_win0.promptWidth+'px'; };PT_typeahead.prototype.ClearResultData = function() {
 ptTAObj_win0.arrHeaders.length = 0; this.GetArrOptions().length = 0; ptTAObj_win0.arrMatches.length = 0;};PT_typeahead.prototype.DecodeArrOptions = function() {
 if (typeof this.GetArrOptions() == 'undefined') 
 return; for (var i=0;i<this.GetArrOptions().length;i++) {
 for (var j=0;j<this.GetArrOptions()[i].length;j++) {
 this.GetArrOptions()[i][j] = this.DecodeValue(this.GetArrOptions()[i][j]); }
 }
};PT_typeahead.prototype.HideTheBox = function(){
 if (isFModeLayout()) {
 this.Close(); return; }

 
 
 this.bGrabHighlighted = false; var el=ptTAObj_win0.oDoc.getElementById('pt_typeahead0'); if (el && typeof el != 'undefined')
 el.style.display='none'; ptTAObj_win0.oDoc.getElementById('pt_typeahead').style.display='none'; ptTAObj_win0.currentValueSelected=-2; ptTAObj_win0.EraseTimeout(); ptTAObj_win0.EraseDelayTime(); this.startPos = 0;  ptTAObj_win0.ClearResultData(); };PT_typeahead.prototype.IsGrabHighlighted = function() { 
 if (this.bGrabHighlighted)
 return true; return false;};PT_typeahead.prototype.EraseDelayTime = function(){
 clearTimeout(ptTAObj_win0.isDelayTiming); ptTAObj_win0.isDelayTiming=false;};PT_typeahead.prototype.StartDelayTimeout = function(){
 if (!ptTAObj_win0.theTextBox) return; ptTAObj_win0.isDelayTiming=setTimeout("ptTAObj_win0.DoTypeAhead()",this.nDelayTime);};PT_typeahead.prototype.EraseDelayTimeout = function(){
 clearTimeout(ptTAObj_win0.isDelayTiming); ptTAObj_win0.isDelayTiming=false;};PT_typeahead.prototype.EraseTimeout = function(){
 clearTimeout(ptTAObj_win0.isTiming); ptTAObj_win0.isTiming=false;};PT_typeahead.prototype.StartTimeout = function(){
 if (!ptTAObj_win0.theTextBox) 
 return; ptTAObj_win0.isTiming=setTimeout("ptTAObj_win0.HideTheBox()",ptTAObj_win0.theTextBox.obj.theVisibleTime);};PT_typeahead.prototype.GetContainerEl = function () { 
 var xPosElement = null; if (isFModeLayout()) {
 xPosElement = ptTAObj_win0.oDoc.getElementById(this.theTextBox.id + '$typeahead'); if (!xPosElement)
 xPosElement = ptTAObj_win0.oDoc.getElementById("pt_typeahead"); }
 else
 xPosElement = ptTAObj_win0.oDoc.getElementById("pt_typeahead"); return xPosElement;};PT_typeahead.prototype.ResetContainerEl = function () {
 if (!isFModeLayout()) return; var mObj = document.getElementById(this.theTextBox.id + '$typeahead'); if (mObj) {
 mObj.arrHeaders = ""; mObj.arrOptions = ""; }
}

PT_typeahead.prototype.GetArrOptions = function () {

 if (this.GetContainerEl().arrOptions)
 return this.GetContainerEl().arrOptions; if (this.theTextBox && this.theTextBox.obj)
 return this.theTextBox.obj.arrOptions; return new Array();};PT_typeahead.prototype.GetArrHeaders = function () {

 if (this.GetContainerEl().arrHeaders)
 return this.GetContainerEl().arrHeaders; if (this.theTextBox && this.theTextBox.obj)
 return this.theTextBox.obj.arrHeaders; return new Array();};PT_typeahead.prototype.InitArrOptions = function () {

 if (this.theTextBox && this.theTextBox.obj)
 this.theTextBox.obj.arrOptions = new Array();};PT_typeahead.prototype.GetScrollContainerId = function () {
 return getPageFormName(this.theTextBox.parentNode) + "div" + this.theTextBox.id + "grid";}

PT_typeahead.prototype.GetScrollContainer = function () {
 return document.getElementById(this.GetScrollContainerId());}

PT_typeahead.prototype.PositionTop = function (el) {
return false; if (isFModeLayout() && isTouchKeyboard() && el) {
 var elp = document.getElementById(getPageFormName(el.parentNode) + "div" + el.id); if (!elp) return; elp.style.top = 0, elp.style.left = 0, elp.style.position = "absolute", elp.style.zIndex = 211; ptCommonObj2.showPopupMask(window, 'pt_modalMask', false, 'ps_maskwhite '); var popMask = document.getElementById('pt_modalMask'); popMask.bTypeAhead = true; popMask.addEventListener("click", typeAheadPositionTopClear, false); }
}

PT_typeahead.prototype.PositionTopClear = function () {
return;  if (isFModeLayout() && isTouchKeyboard()) {
 var el = document.getElementById(this.theTextBox.id); if (!el) return; var elp = document.getElementById(getPageFormName(el.parentNode) + "div" + this.theTextBox.id); if (!elp) return; elp.style.top = "", elp.style.left = "", elp.style.position = "", elp.style.zIndex = ""; ptCommonObj2.hidePopupMask(window, 'pt_modalMask', false, 'ps_maskwhite '); var popMask = document.getElementById('pt_modalMask');  popMask.bTypeAhead = false; popMask.removeEventListener("click", typeAheadPositionTopClear, false); }
}

PT_typeahead.prototype.Resize = function () {
 var mObj = document.getElementById(this.theTextBox.id + '$typeahead'); nMaxH = getModObjHeight(MTop().modId); var objH = mObj.querySelector(".ps_grid-head"); if (objH) nMaxH -= objH.clientHeight; var cObj = this.GetScrollContainer(); cObj.bVScroll = 1; cObj.bHScroll = 0; scrollInit(this.GetScrollContainerId(), true, nMaxH); gridInit(this.GetScrollContainerId()); resizeModalDialog_pt(MTop().modId);}

PT_typeahead.prototype.Close = function () {
 autoCloseTypeAhead(); if (this.theTextBox != null) {
 var mObj = document.getElementById(this.theTextBox.id + '$typeahead'); if (mObj && this.theTextBox.obj.bNew) {
 mObj.arrHeaders = this.theTextBox.obj.arrHeaders; mObj.arrOptions = this.theTextBox.obj.arrOptions; this.theTextBox.obj.bNew = false; }
 }
}

PT_typeahead.prototype.isNew = function () {
 if (this.theTextBox != null)
 return this.theTextBox.obj.bNew; else
 return false;}

function typeAheadPositionTopClear() {
 ptTAObj_win0.Close(); ptTAObj_win0.PositionTopClear();}


function isTypeHeadeNew() {
 return ptTAObj_win0.isNew();}