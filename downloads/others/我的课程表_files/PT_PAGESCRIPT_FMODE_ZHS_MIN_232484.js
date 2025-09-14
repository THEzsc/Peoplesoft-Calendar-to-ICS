

var gFFocusObjId = null;ptDialogLocal = new PT_Dialog();
function loadChart(name, gheader, gdata) {
 var r = Raphael(name),
 txtattr = { font: "20px 'Fontin Sans', Fontin-Sans, sans-serif" }; r.text(160, 10, "Multiline Series Chart").attr(txtattr); r.barchart(10, 50, 300, 220, gdata); r.text(500, 10, "Static Pie Chart").attr(txtattr); r.piechart(520, 170, 100, gdata[0]);}

function loadBarChart(name, gheader, gdata) {
 var r = Raphael(name),
 txtattr = { font: "20px 'Fontin Sans', Fontin-Sans, sans-serif" }; r.text(160, 10, "Multiline Series Chart").attr(txtattr); r.barchart(10, 5, 300, 220, gdata);}

function loadPieChart(name, gheader, gdata) {
 var r = Raphael(name),
 txtattr = { font: "20px 'Fontin Sans', Fontin-Sans, sans-serif" }; r.text(100, 10, "Static Pie Chart").attr(txtattr); r.piechart(120, 170, 100, gdata[0]);}function goTwitter()
{
document.location='https://twitter.com/';}

function createTwitter(myid, sSearch, sType, nVersion, nInterval, sTitle, sSubject, 
 nWith, nHeight, sShellBackground, sShellColor, sTweetBackground, sTweetColor, sTweetLink,
 bScrollbar, bLoop, bLive, sBehavior) {

 if (typeof nVersion == "undefined")
 nVersion = 2; if(typeof sType == "undefined")
 sType = 'search'; if (typeof sSearch == "undefined")
 sSearch = "#love"; if (typeof nInterval == "undefined")
 nInterval = 1000; if (typeof sTitle == "undefined")
 sTitle = ''; if (typeof sSubject == "undefined")
 sSubject = 'Love'; if (typeof nWith == "undefined")
 nWith = 220; if (typeof nHeight == "undefined")
 nHeight = 300; if (typeof sShellBackground == "undefined")
 sShellBackground = '#8ec1da'; if (typeof sShellColor == "undefined")
 sShellColor = '#ffffff'; if (typeof sTweetBackground == "undefined")
 sTweetBackground = '#ffffff'; if (typeof sTweetColor == "undefined")
 sTweetColor = '#444444'; if (typeof sTweetLink == "undefined")
 sTweetLink = '#1985b5'; if (typeof bScrollbar == "undefined")
 bScrollbar = false; if (typeof bLoop == "undefined")
 bLoop = true; if (typeof bLive == "undefined")
 bLive = true; if (typeof sBehavior == "undefined")
 sBehavior = 'default'; new TWTR.Widget({
 id: myid,
 version: nVersion,
 type: 'search',
 search: sSearch,
 interval: nInterval,
 title: sTitle,
 subject: sSubject,
 width: nWith,
 height: nHeight,
 theme: {
 shell: {
 background: sShellBackground,
 color: sShellColor
 },
 tweets: {
 background: sTweetBackground,
 color: sTweetColor,
 links: sTweetLink
 }
 },
 features: {
 scrollbar: bScrollbar,
 loop: bLoop,
 live: bLive,
 behavior: sBehavior
 }
 }).render().start();}

function transferAnimationIn() {
 if (!bPageTransfered) return; var mObj = document.getElementById("PT_MAIN"); if (mObj) {
 var sClass = mObj.getAttribute("class"); mObj.setAttribute("class", sClass + " ps_main_trf2"); }
 timeoutXfrAniID = window.setTimeout('transferAnimationIn2()',0);}

function transferAnimationIn2() {
 if (gAJAXNet == null || !bPageTransfered || gAJAXNet.gXMLObj == null) return; var mObj = document.getElementById("PT_MAIN"); if (mObj) {
 var sClass = mObj.getAttribute("class"); sClass = sClass.replace(" ps_main_trf2", ""); mObj.setAttribute("class", sClass + " ps_main_trf"); }
 timeoutXfrAniID = window.setTimeout('transferAnimationOut()', 2000);}

function transferAnimationOut() {
 if (gAJAXNet == null || !bPageTransfered || gAJAXNet.gXMLObj == null) return; gAJAXNet.resume(); var mObj = document.getElementById("PT_MAIN"); if (mObj) {
 var sClass = mObj.getAttribute("class"); sClass = sClass.replace(" ps_main_trf", ""); mObj.setAttribute("class", sClass); }
}

function slideV(obj) {
 var obj3 = document.getElementById("PT_CONTENT"); var obj4 = document.getElementById(obj.id.substring(0, obj.id.length - 1)); var obj2 = document.getElementById(obj.id + "0"); if (obj4.clientHeight <= 50 && obj2.style.display == "none") {
 obj2.style.display = "block"; obj4.style.height = obj2.clientHeight + 50 + 'px'; if (obj3)
 obj3.style.height = (obj3.clientHeight - obj2.clientHeight - 50) + 'px'; }
 else {
 obj.style.width = obj4.clientWidth + 'px'; obj2.style.display = "none"; obj4.style.height = '50px'; }
}

function slideH(obj) {
 var obj3 = document.getElementById(obj.id.substring(0, obj.id.length - 1)); var obj2 = document.getElementById(obj.id + "0"); if (obj.clientWidth <= 50 && obj2.style.display == "none") {
 obj2.style.display = "block"; obj3.style.width = obj2.clientWidth + 100 + 'px'; }
 else {
 obj3.style.width = obj2.clientWidth + 'px'; obj2.style.display = "none"; }
}
var nControllerTimer = 0;var bAnyLiveTiles = false;var workerURL = "";var nMaxWorkers = 5;var workers = new Array();var groupletQueue = new Array();var bSessionStorage = (typeof(sessionStorage) != "undefined")?true:false;var groupletNodes = null;function initGroupletNodes() {
 var groupletNodesStr = null; if (bSessionStorage)
 groupletNodesStr = sessionStorage.getItem("pt_groupletnodes"); if (typeof groupletNodesStr == "undefined" || !groupletNodesStr) 
 groupletNodes = new Array(); else 
 groupletNodes = JSON.parse(groupletNodesStr); var url = window.location.href; var uri1 = getUrlHost(url) + "/psc/" + trimWindowsNumber0(getPSHome(url)); var bFound = false; for (var i = 0; i < groupletNodes.length && !bFound; i++) {
 var uri = groupletNodes[i][0]; var bStatus = groupletNodes[i][1]; var urlList = groupletNodes[i][2]; if (url.indexOf(uri + "/") != -1 || url.indexOf(uri + "_") != -1) {
 if (bStatus)
 bFound = true; }
 }
 if (!bFound) {
 var uri = getUrlHost(window.location.href) + "/psc/" + trimWindowsNumber0(getPSHome(window.location.href)); var gnode = new Array(uri, true, null); groupletNodes.push(gnode); if (bSessionStorage)
 sessionStorage.setItem("pt_groupletnodes", JSON.stringify(groupletNodes)); }
}

function checkGroupletNode(url, id, iIndex) {
 if (!isPIAUrl(url)) return; var uri1 = getUrlHost(url) + "/psc/" + trimWindowsNumber0(getPSHome(url)); for (var i = 0; i < groupletNodes.length; i++) {
 var uri = groupletNodes[i][0]; var bStatus = groupletNodes[i][1]; var urlList = groupletNodes[i][2]; if (url.indexOf(uri + "/") != -1 || url.indexOf(uri + "_") != -1) {
 if (bStatus)
 return true; else {
 groupletNodes[i][2][urlList.length] = new Array(url, id, iIndex); return false; }
 }
 }
 var gnode = new Array(uri1, false, new Array(new Array(url, id, iIndex))); groupletNodes.push(gnode); doGrouplet(uri1 + '/?cmd=ping,' + id + ',' + iIndex); return false;}

function processGroupletNode(url) {
 var uri1 = getUrlHost(url) + "/psc/" + getPSHome(url); for (var i = 0; i < groupletNodes.length; i++) {
 var uri = groupletNodes[i][0]; var urlList = groupletNodes[i][2]; if (url.indexOf(uri + "/") != -1 || url.indexOf(uri + "_") != -1) {
 groupletNodes[i][1] = true; for (var j = 0; j < urlList.length; j++) {
 doGrouplet(urlList[j][0] + ',' + urlList[j][1] + ',' + urlList[j][2]); }
 groupletNodes[i][2] = ""; }
 }
 updateGroupletNode();}

function updateGroupletNode() {
 if (bSessionStorage)
 sessionStorage.setItem("pt_groupletnodes", JSON.stringify(groupletNodes));}

function initWorkers(url, nMax) {
 initGroupletNodes(); if (typeof url != "undefined" && url.length > 0)
 workerURL = url; if (nMax > nMaxWorkers) nMaxWorkers = nMax; if (workers && workers.length == nMaxWorkers) return; workers = new Array(nMaxWorkers); var worker = null; for (var i = 0; i < nMaxWorkers; i++) {
 worker = new Worker(workerURL); worker.addEventListener('message', refreshGrouplet); worker.bBusy = false; workers[i] = worker; }
}


function initWorkerControllerTimer() {
 if (nControllerTimer == 0) return; workerControllerTimer = window.setInterval('refreshGrouplets(groupletList)', nControllerTimer);}

function clearWorkerTimer() {
 if (typeof workerControllerTimer == "undefined") return; window.clearTimeout(workerControllerTimer); workerControllerTimer = null;}

function refreshGrouplets(objGroupletList) {

 if (isSessionLoggedout(true) || (typeof objGroupletList == 'undefined' || objGroupletList.length == 0)) {
 clearWorkerTimer(); return false; }
 if (typeof objGroupletList == 'undefined' || objGroupletList.length == 0) return false; for (var i = 0; i < objGroupletList.length; i++) {
 var id = objGroupletList[i][0]; var url = objGroupletList[i][2]; var nLastTime = objGroupletList[i][8]; var el = document.getElementById(id); if (!el) {
 clearWorkerTimer(); return false; }
 if (url.length != 0 && isClass(el, "psc_inactive"))
 objGroupletList[i][10] = 1; else if (url.length != 0)
 {
 var nTimer = objGroupletList[i][7]; if (nTimer == 0) continue; var nNow = (new Date()).valueOf(); if ((nNow - nLastTime) > nTimer * 1000) {
 objGroupletList[i][8] = (new Date()).valueOf(); doGrouplet(url + ',' + id + ',' + i); }
 }
 }
 return false;}

function refreshGrouplet(e) {
 var eventName = ""; var eventData = ""; if (typeof e.data != "undefined") {
 var pos = e.data.indexOf("@"); if (pos != -1) {
 eventName = e.data.substring(0, pos); eventData = e.data.substring(pos + 1, e.data.length); } else
 eventData = e.data; }

 switch (eventName) {
 case "runScript":
 var sScript = eventData; eval(sScript); this.bBusy = false; this.data = ""; return; case "initScrolls":
 var nWaitMSec = 500;  if (eventData.length > 0)
 nWaitMSec = eventData; nTry = 0; if (browserInfoObj2.isIE || browserInfoObj2.isFF)
 nTry = 4; function runInitScrolls() {
 initScrolls(); if (nTry > 0)
 setTimeout(runInitScrolls, nWaitMSec); nTry--; }
 setTimeout(runInitScrolls, nWaitMSec); this.bBusy = false; this.data = ""; return; case "free":
 SetCurSelectedRow(); if (groupletQueue.length > 0)
 doGrouplet(groupletQueue.shift()); return; case "eventMsg":
 this.bBusy = false; this.data = ""; doReloadOnMessage(groupletList, eventData); doReloadOnMessage(agGroupletList, eventData); break; default:
 var sArr = eventData.split(","); loadGrouplet(sArr[0], sArr[1], sArr[2], this); break; }
}

function doReloadOnMessage(objGroupletList, message) {
 for (var i = 0; i < objGroupletList.length; i++) {
 var id = objGroupletList[i][0]; var url = objGroupletList[i][2]; var msg = objGroupletList[i][9]; var el = document.getElementById(id); if (url.length != 0 && isClass(el, "psc_inactive"))
 objGroupletList[i][10] = 1; else if (url.length != 0 && msg == message) {
 var id = objGroupletList[i][0]; if (url.indexOf("bReload=y") == -1)
 url += "&bReload=y"
 doGrouplet(url + ',' + id + ',' + i); }
 }
}

function getGrouletIndexById(id) {
 for (var i = 0; i < groupletList.length; i++) {
 if (groupletList[i][0] == id) {
 return i; }
 }
 return -1;}

function getAGGrouletIndexById(id) {
 for (var i = 0; i < agGroupletList.length; i++) {
 if (agGroupletList[i][0] == id) {
 return i; }
 }
 return -1;}


function loadExtGrouplet(url, id, nIndex, worker) {
 
 
 var el = document.getElementById(id); if (!el)
 el = document.getElementById(winName + "div" + id); if (!el) {
 freeWorker(worker); return; }
 var psParamIdx = url.indexOf("&psqry=1"); var xTW = url.indexOf("&tW="); var xTH = url.indexOf("&tH="); if (xTW != -1) 
 el.setAttribute("data-tW", url.substring(xTW+4, xTW+5)); if (xTH != -1)
 el.setAttribute("data-tH", url.substring(xTH+4, xTH+5)); var txtHTML = "<iframe id='" + el.id + "_iframe' class='psc_groupletiframe' name='" + el.id + "_iframe'"; var title = '\u5185\u5bb9'; if (el.id.indexOf("grouplet") != -1) {
 if (el.id.indexOf("grouplet_") != -1)
 var sId = el.id.substring(el.id.indexOf('_') + 1); else
 var sId = el.id.substring(el.id.indexOf('t') + 1); var titleObj = document.getElementById(sId); if (!titleObj) {
 sId = sId.replace('$', '_LBL$'); titleObj = document.getElementById(sId); }
 if (titleObj != null)
 title = titleObj.innerHTML; }
 txtHTML += " title='" + title + "'"; if (url.indexOf("ICGrouplet=6") != -1 || url.indexOf("tASz=1") != -1)
 txtHTML += " onload='autoResizeFrame(this)'"; if (psParamIdx != -1)
 url = url.substring(0, psParamIdx); txtHTML += " src='" + url + "'/></iframe>";  el.innerHTML = txtHTML;  freeWorker(worker); }

function freeWorker(worker) {
 if (typeof worker !== "undefined") {
 worker.bBusy = false; worker.data = ""; worker.postMessage('free@'); }
 return;}

function loadGrouplet(url, id, nIndex, worker) {
 if (url.length == 0 || url.indexOf("http") == -1) {
 if (ptConsole2.isActive()) {
 ptConsole2.append((new Date()).valueOf() + " bad format url: \n" + url); }
 freeWorker(worker); return; }
 if (url.indexOf("ICGrouplet=4") != -1 || url.indexOf("ICGrouplet=6") != -1){
 
 loadExtGrouplet(url, id, nIndex, worker)
 return; }

 if (id == "NB_CONTENT_TGT" && url.indexOf("PTNUI_MENU_COMP") > 0) {
 var lastFldr = null; if (url.indexOf("FLDR=") == -1) {
 lastFldr = sessionStorage.getItem("psNavBar_lastFolder"); if (lastFldr != null) {
 url = url + "&FLDR=" + lastFldr; }
 }

 if (typeof(lastFldr) == "string" && typeof(sessionStorage) != "undefined") {
 cacheId = "psNavBarCont_" + lastFldr; if (sessionStorage.getItem(cacheId) != null) {
 PTNavBar.OpenInContentArea(url, lastFldr); var sScript = "processing_" + document.forms[0].name + "(0,3000);"; eval(sScript); freeWorker(worker); return; }; }
 url = url.replace("ICGrouplet=2", "ICGrouplet=1"); }

 var el = document.getElementById(id); if (!el)
 el = document.getElementById(winName + "div" + id); if (!el) {
 freeWorker(worker); return; }

 var bLoaded = true; if (el && el.children.length == 1 && (el.children[0].tagName == "IMG" || isClass(el.children[0], 'psc_processing')))
 bLoaded = false; if (bLoaded && url.indexOf("bReload=y") == -1) {
 freeWorker(worker); return; }
 if (url.indexOf("ICGrouplet=3") != -1 || url.indexOf("ICGrouplet=5") != -1) {
 el.innerHTML = ""; var title = '\u5185\u5bb9'; if (el.id.indexOf("grouplet") != -1) {
 if (el.id.indexOf("grouplet_") != -1)
 var sId = el.id.substring(el.id.indexOf('_') + 1); else
 var sId = el.id.substring(el.id.indexOf('t') + 1); var titleObj = document.getElementById(sId); if (!titleObj) {
 sId = sId.replace('$', '_LBL$'); titleObj = document.getElementById(sId); }
 if (titleObj != null)
 title = titleObj.innerHTML; }
 var txtHTML = "<iframe id='" + el.id + "_iframe' title='" + title + "' class='psc_groupletiframe' src='" + url + "' name='" + el.id + "_iframe'"; if (url.indexOf("ICGrouplet=5") != -1 || url.indexOf("tASz=1") != -1)
 txtHTML += " onload='autoResizeFrame(this)'"; txtHTML += "/></iframe>"; el.innerHTML = txtHTML; freeWorker(worker); return; }
 var loader = new net2.ContentLoader(url, null, id, "GET", 
 function () { 
 if (url.indexOf("?cmd=ping") != -1) {
 processGroupletNode(url); freeWorker(worker); return; }
 var bIframe = false; if (!bIframe && this.req.responseText.indexOf("<html") != -1 || this.req.responseText.indexOf("<HTML") != -1) {
 freeWorker(worker); return; } 
 if (ptConsole2.isActive() && !bPerf) {
 ptConsole2.append((new Date()).valueOf() + " response:" + this.req.responseText.length + "\n" + this.req.responseText); }
 var bClean = true; if (url.indexOf("ICGrouplet=1") != -1)
 bClean = false; var el = document.getElementById(id); if (!el)
 el = document.getElementById(winName + "div" + id); if (!el) {
 freeWorker(worker); return; }
 if (!bIframe && el && (url.indexOf("tASz=1") != -1)) 
 el.setAttribute("data-bAutoSize", "y");  if (bIframe) {
 el.innerHTML = ""; var txtHTML = "<iframe id='" + el.id + "_iframe' class='psc_groupletiframe' src='about:blank' name='" + el.id + "_iframe'"; if (url.indexOf("ICGrouplet=5") != -1 || url.indexOf("tASz=1") != -1)
 txtHTML += " onload='autoResizeFrame(this)'";  txtHTML += "/></iframe>";  el.innerHTML = txtHTML; elWin = document.getElementById(el.id + '_iframe'); elWin.contentDocument.write(this.req.responseText); elWin.contentDocument.close();  }
 else if (bClean) {
 el.innerHTML = ""; el.innerHTML = this.req.responseText; if (id.indexOf("$ctxmenu$divpop") != -1)
 processRCMenuPopup(el); if (url.indexOf("bTarget") != -1)
 SetTargetFocus(el); } else 
 this.processGrouplet(el); freeWorker(worker); if (typeof nIndex == 'undefined') {
 sScript = "processing_" + document.forms[0].name + "(0,3000);"; eval(sScript); }
 }, null, null, "application/x-www-form-urlencoded");}

function doGrouplet(data)
{
 for (var i = 0; i < nMaxWorkers; i++) {
 if (workers[i].bBusy && workers[i].data == data) {
 groupletQueue.push(data); return; }
 }
 for (var i = 0; i < nMaxWorkers; i++) {
 if (!workers[i].bBusy) {
 workers[i].bBusy = true; workers[i].data = data; workers[i].postMessage(data); return; }
 }
 var bFound = false; for (var i = 0; i < groupletQueue.length; i++) {
 if (groupletQueue[i] == data) {
 return; }

 }
 groupletQueue.push(data);}

function anyLiveTiles(nMax, objGroupletList) {
 if (typeof objGroupletList == 'undefined' || objGroupletList.length == 0) return false; var bReturn = false; var nLiveTile = 0; for (var i = 0; i < objGroupletList.length; i++) { 
 var url = objGroupletList[i][2]; if (url.length != 0) {
 bReturn = true; nLiveTile++; }
 }
 if (nLiveTile < nMax && nLiveTile > 0)
 nMaxWorkers = nLiveTile; else
 nMaxWorkers = nMax; return bReturn;}


function eventMsgCallback(EventName, EventData) {
 doGrouplet("eventMsg@"+EventName);}

function DoReloadGrouplets(objGroupletList, bRefresh) {
 if (typeof objGroupletList == 'undefined' || objGroupletList.length == 0)
 objGroupletList = groupletList; reloadGrouplets(objGroupletList, false, bRefresh);}


function reloadGrouplets(objGroupletList, bPairing, bRefresh) {
 if (typeof objGroupletList == 'undefined' || objGroupletList.length == 0) return; if (typeof bRefresh == 'undefined') bRefresh = false; if (typeof bPairing == 'undefined') bPairing = true; for (var i = 0; i < objGroupletList.length; i++) {
 var id = objGroupletList[i][0]; var gType = objGroupletList[i][1]; var url = objGroupletList[i][2]; var aUrl = objGroupletList[i][3]; var aType = objGroupletList[i][4]; var mOptions = objGroupletList[i][5]; var tid = objGroupletList[i][6]; var nTimer = objGroupletList[i][7];  var nReload = objGroupletList[i][10]; if (bRefresh && isClass(el, "psc_inactive") && url.length != 0)
 objGroupletList[i][10] = 1; else if ((bRefresh || nReload==1) && !isClass(el, "psc_inactive") && url.length != 0) {
 objGroupletList[i][10] = ''; if (url.indexOf("bReload=y") == -1) {
 if (url.indexOf("?") != -1)
 url = url + "&bReload=y"; else
 url = url + "?bReload=y"; }
 }
 else if (nTimer != 0 && url.length != 0) {
 if (nTimer < 10) { nTimer = 10; objGroupletList[i][7] = 10; }
 if (nTimer * 1000 < nControllerTimer || nControllerTimer == 0) nControllerTimer = nTimer * 1000; objGroupletList[i][8] = (new Date()).valueOf(); if (url.indexOf("bReload=y") == -1) {
 if (url.indexOf("?") != -1)
 url = url + "&bReload=y"; else
 url = url + "?bReload=y"; }
 }
 else
 objGroupletList[i][8] = 0; var sEventName = objGroupletList[i][9]; if (typeof sEventName != 'undefined' && sEventName.length != 0) {
 Subscribe(sEventName, eventMsgCallback); }
 var el = document.getElementById(id); if (aUrl.length > 0 && el != null && el.parentNode) {
 var grpid = id.replace('grouplet','div'); var elg = document.getElementById(grpid); var elgz = document.getElementById(grpid + '$gzoom'); if (elg && elgz) {
 elgz.setAttribute("onclick", "javascript:cancelBubble(event);"); elgz.setAttribute("href", "javascript:LaunchURL(this,'" + aUrl + "'," + aType + ",'" + mOptions + "','" + tid + "')"); elgz.setAttribute("role", "button"); }
 else if (aUrl != ""){
 el.parentNode.setAttribute("onclick", "javascript:LaunchURL(this,'" + aUrl + "'," + aType + ",'" + mOptions + "','" + tid + "')"); el.parentNode.setAttribute("role", "button"); }
 } else if (url.length != 0 && el != null && el.parentNode) {
 var elP = el.parentNode; elLabel = elP.querySelector('.ps_groupleth .ps-label'); elP.setAttribute('role', 'region'); if (elLabel)
 elP.setAttribute('aria-labelledby', elLabel.id); }
 var bLoaded = true; if (el && el.children.length == 1 && (el.children[0].tagName == "IMG" || isClass(el.children[0], 'psc_processing')))
 bLoaded = false; if (url.length != 0 && !isClass(el, "psc_inactive") && (!bLoaded || url.indexOf("bReload=y") != -1)) {
 if (url.indexOf("nWidth=") == -1) {
 var nWidth = el.clientWidth; var nHeight = el.clientHeight; if (url.indexOf("?") == -1)
 url += "?nWidth=" + nWidth + "&nHeight=" + nHeight; else
 url += "&nWidth=" + nWidth + "&nHeight=" + nHeight; objGroupletList[i][2] = url; }

 if (ptConsole2.isActive())
 ptConsole2.append((new Date()).valueOf() + " grouplet content url: " + url); if (checkGroupletNode(url, id, i))
 doGrouplet(url + ',' + id + ',' + i); }
 else if (bPairing && el)
 moveGroup(id, gType); }
}
function loadGrouplets(url,nMax) {
 initWorkers(url,nMax); if (typeof groupletList != 'undefined' && groupletList.length > 0) {
 reloadGrouplets(groupletList); bAnyLiveTiles = anyLiveTiles(nMax, groupletList); if (bAnyLiveTiles)
 initWorkerControllerTimer(); }
 else if (typeof agGroupletList != 'undefined' && agGroupletList.length > 0) {
 reloadGrouplets(agGroupletList); }
 if (!gFocusObj) {
 var objWrap = document.getElementById("PT_WRAPPER"); if (isClass(objWrap, "ps_modal")) {
 DoTabbing(null, null, true); }
 }
 else
 ptCommonObj2.tryFocus0(gFocusObj); if (typeof PTNavBar == 'undefined') return;}


function addToPSTOOLSHIDDENS(id, objXML) {
 if (id == (winName + "hdrdivPTS_SRCHGROUPS_GLB")) 
 return; var objHidden = document.getElementById(winName + "divPSTOOLSHIDDENS"); if (objHidden) {

 var oObj = document.createElement("div"); var attrs = objXML.attributes; oObj.setAttribute("id", id); if (attrs.getNamedItem("class"))
 oObj.setAttribute("class", attrs.getNamedItem("class").value); oObj.innerHTML = objXML.firstChild.data; addHide(oObj); objHidden.appendChild(oObj); }
}

function moveGroup(id, gType)
{ 
 var hId = ""; switch (gType) {
 case "7":
 hId = winName + "hdrdivPT_CUSTOM_LEFT"; break; case "8":
 hId = winName + "hdrdivPT_CUSTOM_RIGHT"; break; case "9":
 hId = winName + "hdrdivPT_CUSTOM_MIDDLE"; break; case "10":
 hId = winName + "hdrdivPT_CUSTOM_BOTTOM"; break; case "15":
 hId = winName + "hdrdivPT_CUSTOM_ACTION"; break; case "17":
 hId = winName + "hdrdivPT_CUSTOM_SEARCH"; break; case "18":
 hId = winName + "divPSPANELTABS"; break; case "19":
 hId = winName + "hdrdivPT_CUST_HEADER_AG"; break; case "20":
 hId = winName + "hdrdivPT_SEARCH_ACTION"; break; default:
 return; }
 var gObj = document.getElementById(id); if (!gObj) return; var hObj = document.getElementById(hId); if (!hObj || gType == "18" && hObj.innerHTML =="") return; if (gType == "18") {
 var objWrapper = document.getElementById("PT_WRAPPER"); if(objWrapper.querySelector("#"+hId))
 objWrapper.removeChild(hObj); gObj.innerHTML = ""; removeHide(hObj); gObj.appendChild(hObj); }
 else {
 var tmp = hObj.innerHTML; hObj.innerHTML = ""; gObj = document.getElementById(id); if (gObj)
 hObj.appendChild(gObj); else
 hObj.innerHTML = tmp; }
}


function clearCustomGroup() {
 var hId = ""; hId = winName + "hdrdivPT_CUSTOM_LEFT"; var hObj = document.getElementById(hId); if (hObj) hObj.innerHTML = ""; hId = winName + "hdrdivPT_CUSTOM_RIGHT"; var hObj = document.getElementById(hId); if (hObj) hObj.innerHTML = ""; hId = winName + "hdrdivPT_CUSTOM_MIDDLE"; var hObj = document.getElementById(hId); if (hObj) hObj.innerHTML = ""; hId = winName + "hdrdivPT_CUSTOM_BOTTOM"; var hObj = document.getElementById(hId); if (hObj) hObj.innerHTML = ""; hId = winName + "hdrdivPT_CUSTOM_ACTION"; var hObj = document.getElementById(hId); if (hObj) hObj.innerHTML = "";}

function getGroupletId(id, nLoc) {
 var nGId = winName; switch (nLoc) {
 case 0: 
 nGId += "hdrgrouplet"; break; case 1://side left 1
 nGId += "sidegrouplet"; break; case 2://side right 2
 nGId += "side2grouplet"; break; case 3://footer
 nGId += "ftrgrouplet"; break; default: 
 nGId += "grouplet"; }
 nGId += id; return nGId;}


function getGroupletParentId(id, nLoc) {
 var nGId = winName; switch (nLoc) {
 case 0: 
 nGId += "hdrdiv"; break; case 1://side left 1
 nGId += "sidediv"; break; case 2://side right 2
 nGId += "side2div"; break; case 3://footer
 nGId += "ftrdiv"; break; default: 
 nGId += "div"; }
 nGId += id; return nGId;}

function setGroupletActiveById(id, nLoc) {
 var nGId = getGroupletParentId(id, nLoc); setGroupletActive(document.getElementById(nGId));}

function setGroupletInactiveById(id, nLoc) {
 var nGId = getGroupletParentId(id, nLoc); setGroupletInactive(document.getElementById(nGId));}

function setGroupletActive(objG) {
 if (!objG) return; removeInvisible(objG); removeClass(objG, "psc_inactive");}

function setGroupletInactive(objG, bFlag) {
 if (!objG) return; addInvisible(objG); addClass(objG, "psc_inactive");}


function reloadGroupletById(id, nLoc) {
 var nGId = getGroupletId(id, nLoc); if (!document.getElementById(nGId)) return; var nIndex = getGrouletIndexById(nGId); if (nIndex == -1) return; var url = groupletList[nIndex][2]; if (url.indexOf("bReload=y") == -1)
 url += "&bReload=y"; doGrouplet(url + ',' + nGId + ',' + nIndex);}

function reloadAGGroupletById(id, nLoc) {
 var nGId = getGroupletId(id, nLoc); if (!document.getElementById(nGId)) return; var nIndex = getAGGrouletIndexById(nGId); if (nIndex == -1) return; var url = agGroupletList[nIndex][2]; if (url.indexOf("bReload=y") == -1)
 url += "&bReload=y"; doGrouplet(url + ',' + nGId + ',' + nIndex);}



function LaunchURL(obj, url, nType, options, tid, bSave, bWarning, sScriptAfter) {

 closeLastModal(); var sScriptAfter = (typeof sScriptAfter == "undefined") ? null : sScriptAfter; var bLaunchScript = (url.indexOf("http") == -1); var bAutoSave = (typeof bSave == "undefined" || !bSave) ? false : true; var bWarning = (typeof bWarning == "undefined" || bWarning) ? true : false; oWin = top.window; var bTopFluid = oWin.isFModeLayout(); if (!bTopFluid) {
 var objFrame = top.frames['TargetContent']; if (objFrame)
 oWin = objFrame; } else {
 var oTFrame = document.querySelector(".ps_target-iframe"); if (oTFrame)
 oWin = oTFrame.contentWindow; }
 var sScript = ""; var bChanged = false; if (!bLaunchScript) { 
 bChanged = checkFrameChanged(oWin); if (bTopFluid) {
 sScript = "processing_" + window.document.forms[0].name + "(1,3000);"; if (bChanged)
 sScript = "processing_" + top.window.document.forms[0].name + "(1,3000);"; }
 }
 switch (nType) {
 case 1:
 window.open(url); break; case 2:
 if (options.indexOf("@.ps_tabh") != -1) {
 var bFound = false; var pObj = obj.parentNode.parentNode; for (var j = 0; j < pObj.children.length; j++) {
 var cObj = pObj.children[j].children[0]; if (isSelected(cObj))
 bFound = true; if (cObj == obj)
 addSelected(obj); else
 removeSelected(cObj); }

 var cObj = document.querySelector(".ps_tab_content"); var nHeight = cObj.clientHeight; if (!bFound)
 nHeight = cObj.clientHeight - 3; options += "height@" + nHeight; }
 if (options.indexOf("bCrossDomain@1") == -1) {
 if (isModeless(MTop().modlessId)) {
 if (url.indexOf('?') == -1)
 url += '?ICDoModeless=1'; else
 url += '&ICDoModeless=1'; sScript = "window.location.href ='" + url+"';"; }
 else
 sScript = "doModeless(\"" + url + "\", \"" + options + "\");"; }
 else {
 showModalDialog_pt(url, window, options); return; }
 break; case 3:
 if (url.indexOf("bReload=y") == -1)
 url += "&bReload=y"; if (url.indexOf("bTarget=y") == -1)
 url += "&bTarget=y"; closeLastModal(); var sScript2 = "processing_" + document.forms[0].name + "(1,3000);"; eval(sScript2); loadGrouplet(url , tid); if (obj != null)
 PTNavBar.SelectTile(obj); break; case 4:
 if (typeof(top.PTNavBar)=="object")
 if (top.PTNavBar.IsOpen)
 top.PTNavBar.Toggle(); var sTopUrl = top.location.href; url = url.replace('/'+getPSHome0(url)+getPSHomeSuffix(url)+'/', '/'+getPSHome0(url)+getPSHomeSuffix(sTopUrl)+'/'); sScript += "top.location = \"" + url + "\";"; break; case 5:
 var sTopUrl = window.location.href; url = url.replace('/' + getPSHome0(url) + getPSHomeSuffix(url) + '/', '/' + getPSHome0(url) + getPSHomeSuffix(sTopUrl)+'/'); sScript += "window.location = \"" + url + "\";"; break; case 6:
 if (!bLaunchScript)
 url = AddMDSystemParams(url, nType); if (SingleComponentAGStep(url)) {
 if (sScriptAfter)
 eval(sScriptAfter); return; }
 if (!bAutoSave && bChanged) {
 sScript += "DoAJAXTransfer(\"" + url + "\");"; if (sScriptAfter)
 sScript += sScriptAfter; }
 else {
 if (!bChanged && !bLaunchScript) {
 var sScript = "processing_" + window.document.forms[0].name + "(1,3000);"; eval(sScript); }
 if (bChanged) {
 var winname = oWin.document.forms[0].name; sScript += "oWin.submitAction_" + winname + "(document.forms[0], \"#ICSave\", null,\"" + url + "\","+ bWarning+",\""
 +sScriptAfter+"\","+nType+");";; eval(sScript); } else {
 if (bLaunchScript)
 eval(url); else
 DoAJAXTransfer(url); if (sScriptAfter && !bLaunchScript)
 eval(sScriptAfter); }
 return; }
 break; case 7:
 if (!bChanged)
 eval("processing_" + window.document.forms[0].name + "(1,3000);");  url = AddMDSystemParams(url, nType); if (bChanged) {
 sScript += "DoAJAXTransfer(\"" + url + "\");SetSearchSelectedRow(\"" + tid + "\");"; }
 else {
 DoAJAXTransfer(url); SetSearchSelectedRow(tid); return; }
 break; case 8:
 cleareSide1Bottom(); url = AddMDSystemParams(url, nType); if (isMDListPopup())
 disableSide1(); if (bChanged) {
 sScript += "DoTargetIFrame(\"" + url + "\");SetSearchSelectedRow(\"" + tid + "\");SetPrevNext(\"PT_SIDE$content\");"; }
 else {
 DoTargetIFrame(url); SetSearchSelectedRow(tid); SetPrevNext('PT_SIDE$content'); return; }
 break; case 9:
 cleareSide1Bottom(); if (!bLaunchScript)
 url = AddMDSystemParams(url, nType); if (isMDListPopup())
 disableSide1(); if (!bAutoSave && bChanged) {
 sScript = "DoTargetIFrame(\"" + url + "\");"; if (sScriptAfter)
 sScript += sScriptAfter; }
 else {
 if (bChanged) {
 var winname = oWin.document.forms[0].name; sScript = "oWin.submitAction_" + winname + "(document.forms[0], \"#ICSave\", null,\"" + url + "\"," + bWarning + ",\""
 + sScriptAfter + "\"," + nType + ");";; eval(sScript); } else {
 if (bLaunchScript)
 eval(url); else
 DoTargetIFrame(url); if (sScriptAfter)
 eval(sScriptAfter); }
 return; }
 break; default:
 var sTopUrl = document.location.href;  url = url.replace('/' + getPSHome0(url) + getPSHomeSuffix(url)+'/', '/' + getPSHome0(url) + getPSHomeSuffix(sTopUrl)+'/'); sScript += "document.location = \"" + url + "\";";  }
 if (nType !=3 && nType != 1) {
 if (bChanged && nType != 2)
 oWin.psConfirmSW("", sScript.replace(/'/g, '\"'), top.winodw); else
 eval(sScript); }
}

function SingleComponentAGStep(url) {
 var thisUrl = url.split("?")[0].split("/"); var lastUrl = strCurrUrl.split("?")[0].split("/"); if (thisUrl[thisUrl.length - 1] != lastUrl[lastUrl.length - 1])
 return false; if (url.indexOf("ICSingleComp=Y") == -1)
 return false; var regExp = /[\?&]PAGE=([^\?&]+)/; var pageName = regExp.exec(url)[1]; if (pageName == null || pageName == "")
 return false; var winname = oWin.document.forms[0].name; loader = null; var sScript = "oWin.submitAction_" + winname + "(document.forms[0], \"#ICPageName=" + pageName + "\")"; eval(sScript); return true;}

function AddMDSystemParams(url, nType) {
 if (isMDListAccordion())
 expandAcc("PT_SIDE_TOP0", true, true); var sWinCnt = getPSHomeSuffix(top.location.href); var sGWinCnt = getPSHomeSuffix(url); url = url.replace('/'+getPSHome0(url) + sGWinCnt+'/', '/'+getPSHome0(url) + sWinCnt+'/'); var paramsAdd = ""; if (url.indexOf('?') == -1)
 paramsAdd += '?'; if (nType == 6 || nType == 7)
 paramsAdd += "&ICAJAX=1"; if (nType == 6 || nType == 9)
 paramsAdd += "&ICAGTarget=start"; if (nType == 7 || nType == 8)
 paramsAdd += "&ICMDTarget=start"; if (isMDListPopup())
 paramsAdd += "&ICMDListPopup=true"; else if (isMDListAccordion())
 paramsAdd += "&ICMDListAccordion=true"; if (isMDGuided())
 paramsAdd += "&ICGuided=true"; if (isSUOW())
 paramsAdd += "&ICUOW=Y"; if (isSingleComponentAG())
 paramsAdd += "&ICSingleComp=Y"; url += paramsAdd; var objTarget = document.getElementById("divPAGECONTAINER_TGT"); if (nType == 9 || nType == 8)
 addClass(objTarget, "psc_has_iframe"); else
 removeClass(objTarget, "psc_has_iframe"); return url;}


function ResizeTargetIFrame() {
 if (!isClass(document.getElementById('PT_WRAPPER'), "psc_target-iframe")) return; var objTargetMain = document.querySelector(".ps_ag-maincontent"); var objTargetIframe = document.querySelector(".ps_target-iframe"); if (objTargetIframe && objTargetMain)
 objTargetIframe.style.height= (objTargetMain.clientHeight - 10) + "px";}

function DoTargetIFrame(url) {
 document.getElementById("PT_SIDE2").innerHTML = ""; document.getElementById('PT_FOOTER').innerHTML = "";  var objWrapper = document.getElementById('PT_WRAPPER'); if (sMDWrapperStyle.indexOf("pst_side1-open") == -1) {
 removeClass(objWrapper, "pst_side1-open"); }
 addClass(objWrapper, "psc_target-iframe"); var objTarget = document.getElementById("divPAGECONTAINER_TGT"); var objTargetMain = document.querySelector(".ps_ag-maincontent"); objTarget.innerHTML = "<iframe title='\u4e3b\u5185\u5bb9' class='ps_target-iframe' frameborder=0 src='" + url + "'></iframe>"; ResizeTargetIFrame(); var sScript = "processing_" + window.document.forms[0].name + "(0,3000);"; eval(sScript);}

function DoAJAXTransfer(url) {
 removeClass(document.getElementById('PT_WRAPPER'), "psc_target-iframe"); document.forms[0].action = url; var loaderTrf = new net2.ContentLoader(url, document.forms[0], "ICAGTarget", "GET", null, null, null, null, true);}

function keyHandlerRAMenu(e, objH){
 var key = (window.event)? window.event.keyCode: e.keyCode; if(key==9){ 
 var mhid = "ptModHeader_"+ MTop().modId;  var headobj = document.getElementById(mhid); var firstchild = headobj.children[0];  if(firstchild.getAttribute("class").indexOf("ps_popup-back") >-1 && firstchild.innerHTML !="") {
 firstchild.getElementsByTagName('a')[0].focus(); }
 else{ 
 var headlen = headobj.children.length; var lastchild = headobj.children[headlen-1]; if( lastchild.getAttribute("id").indexOf("ptModClose") >-1){
 lastchild.getElementsByTagName('a')[0].focus(); }
 }
 e.preventDefault(); return; }
 if(key==39) { 
 
 var objType = objH.parentNode.getAttribute("class"); if (!objType.localeCompare("ps_menu_folder"))
 expandMenu(objH); return; }
 if(key==37) { 
 var obj = objH.parentNode; var objP = obj.parentNode; if (objP.getAttribute("class") == "ps_menu_content")
 objP = objP.parentNode; var tempid = objP.getAttribute("class").split(/\s+/)[0]; var len = tempid.length; var level = (tempid.charAt(len-1))-0; var backid="."+ tempid.slice(0,len-1) + (level); backMenu(backid);  return; }
 if(key==40) { 
 var obj = objH.parentNode; var objP = obj.parentNode;  for (var j = 0; j < objP.children.length; j++) {
 if (obj == objP.children[j]) {
 objF = objP.children[j + 1]; if (!objF) return; objF.getElementsByTagName('a')[0].focus(); }
 }
 return; }
 if(key ==38){ 
 var obj = objH.parentNode; var objP = obj.parentNode;  for (var j = 0; j < objP.children.length; j++) {
 if (obj == objP.children[j]) {
 objB = objP.children[j-1]; if (!objB) return; if (objB.getAttribute("class").indexOf("psc_hidden")>-1) return; objB.getElementsByTagName('a')[0].focus(); }
 }
 return; } 

}




function expandMenu(objH,event) {
 var obj = objH.parentNode; var objP = obj.parentNode; if (objP.getAttribute("class") == "ps_menu_content")
 objP = objP.parentNode; var objGP = objP.parentNode; replaceClass(objP, "ps_menu_open", "ps_menu_close"); for (var j = 0; j < objP.children.length; j++) {
 addHide(objP.children[j]); }
 for (var j = 0; j < objGP.children.length; j++) {
 if (objP == objGP.children[j]) {
 objF = objGP.children[j + 1]; if (!objF) return; objF.innerHTML = obj.innerHTML; replaceClass(objF, "ps_menu_close", "ps_menu_open"); objF.removeEventListener('webkitTransitionEnd', clearTargetGroupBox, false); objFHeader = objF.children[0]; objFContent = objF.children[1]; removeHide(objFContent); addHide(objFHeader); objPHeader = objP.children[0]; var aClass = objF.getAttribute("class").split(" "); setModalDialogTitle(objFHeader.children[0].children[0].innerHTML, "."+aClass[0], objPHeader.children[0].innerHTML);  objFHeader.onclick = ""; for (var i = 0; i < objFContent.children.length; i++) {
 removeHide(objFContent.children[i]); var sid = (objFContent.children[i].getAttribute("id")) ? objFContent.children[i].getAttribute("id") : ""; if (sid != ""){
 sid = sid + "."+ i; objFContent.children[i].setAttribute("id", sid); }
 }
 
 if(typeof event != "undefined" && event != null && typeof event.preventDefault != "undefined" && event.preventDefault)
 event.preventDefault(); objGP.style.height = ''; resizeModalAll(); scrollInitDivPopup(objGP.id); objFContent.children[0].getElementsByTagName('a')[0].focus(); return; }
 }
}

function backMenu(sBackIdQS) {
 var obj = MTop().document.querySelector(sBackIdQS); var objP = obj.parentNode; for (var j = 0; j < objP.children.length; j++) {
 if (obj == objP.children[j]) {
 objF = objP.children[j -1]; if (!objF) return;  objB = null; if (j > 1) objB = objP.children[j - 2];  objFHeader = objF.children[0]; objFContent = objF.children[1]; var aClass = objF.getAttribute("class").split(" "); if (j == 1)
 setModalDialogTitle(objFHeader.children[0].innerHTML); else if (objB)
 setModalDialogTitle(objFHeader.children[0].children[0].innerHTML, "." + aClass[0], objB.children[0].children[0].innerHTML); for (var j = 1; j < objF.children.length; j++) {
 removeHide(objF.children[j]); }
 replaceClass(objF, "ps_menu_close", "ps_menu_open"); replaceClass(obj, "ps_menu_open", "ps_menu_close"); obj.addEventListener('webkitTransitionEnd',clearTargetGroupBox, false); var objContent = obj.children[1]; var objContentClass = objContent.getAttribute("class") + " psc_hidden"; objContent.setAttribute("class", objContentClass);  objP.style.height = ''; resizeModalAll(); scrollInitDivPopup(objP.id); if(objContent.children[0].getAttribute("class").indexOf("ps_menu_link")!=-1)
 objFContent.getElementsByTagName('a')[0].focus(); else
 objFContent.children[0].getElementsByTagName('a')[0].focus(); return; }
 }
}

function resetMenu(mDivObj) {

 if (!mDivObj.getAttribute('options') || mDivObj.getAttribute('options').indexOf("ctxmenu") == -1) return; var objGP = mDivObj.children[0]; objP = objGP.children[0]; replaceClass(objP, "ps_menu_close", "ps_menu_open"); for (var i = 1; i < objP.children.length; i++) {
 removeHide(objP.children[i]); }
 for (var j = 1; j < objGP.children.length; j++) {
 objF = objGP.children[j]; replaceClass(objF, "ps_menu_open", "ps_menu_close"); objF.innerHTML = ""; }
}window.onresize = function (event) {
 try {
 initScrolls0();  autoCloseTypeAhead(); var modObj = MTop().document.getElementById(MTop().PTMOD_ + MTop().modId); if (typeof modObj !== "undefined" && modObj != null && modObj && !modObj.bFullScreen) 

 doCloseLocalModals(); cleanupCalendar(); if (window.top == window)
 resizeModalAll(); ResizeTargetIFrame(); ResizeAccordions()
 } catch (e) {}
}

function setScrollStyle(obj)
{
 if (!isClass(obj, 'ps_scrollable')) {
 addClass(obj, "ps_scrollable"); if (obj.bCarousel)
 addClass(obj, "psc_carousel nbar"); else {
 if (obj.bVScroll && obj.bHScroll)
 addClass(obj, "ps_scrollable_both"); else if (obj.bVScroll)
 addClass(obj, "ps_scrollable_v"); else if (obj.bHScroll)
 addClass(obj, "ps_scrollable_h"); if (obj.bNoBar)
 addClass(obj, "nbar"); else {
 if (obj.bVScroll)
 addClass(obj, "sbar sbar_v"); if (obj.bHScroll)
 addClass(obj, "sbar sbar_h"); }
 }
 }
}

function clearScrollStyle(obj) {
 if (isClass(obj, 'ps_scrollable')) {
 removeClass(obj, 'psc_carousel nbar'); removeClass(obj, 'ps_scrollable_both'); removeClass(obj, 'ps_scrollable_v'); removeClass(obj, 'ps_scrollable_h'); removeClass(obj, 'ps_scrollable'); removeClass(obj, 'nbar'); removeClass(obj, 'sbar sbar_v'); removeClass(obj, 'sbar sbar_h'); return true; }
 return false;}

function clearAllScrollStyle() {
 if (typeof scrollFieldList == 'undefined' || scrollFieldList.length == 0) return; var bAnyScrollSet = false; for (var i = 0; i < scrollFieldList.length; i++) {
 var id = scrollFieldList[i][0]; var obj = document.getElementById(scrollFieldList[i][0]); bAnyScrollSet = clearScrollStyle(obj); }
 return bAnyScrollSet;}

function isScrollable(obj)
{
 if (!obj) return false; if (isClass(obj, 'ps_scrollable')) return true; if (typeof obj.id == "undefined" || !obj.id) return false; if (typeof scrollFieldList == 'undefined' || scrollFieldList.length == 0) return; for (var i = 0; i < scrollFieldList.length; i++) { 
 var id = scrollFieldList[i][0]; if (obj.id == id)
 return true; }
 return false;}

function initScrolls0(bAJAX) {
 if (isPSPhone() || browserInfoObj2.isIE || browserInfoObj2.isFF)
 doGrouplet('initScrolls@100'); else 
 doGrouplet('initScrolls@10');}

function initScrolls() {
 if (typeof scrollFieldList == 'undefined' || scrollFieldList.length == 0) return; for (var i = 0; i < scrollFieldList.length; i++) {
 var id = scrollFieldList[i][0]; var obj = document.getElementById(id); if (!obj) continue; if (obj && isClass(obj, "psc_scroll")) {
 removeClass(obj, "ps_scrollable"); removeClass(obj, "sbar_v"); removeClass(obj, "sbar"); continue; }
 obj.bVScroll = scrollFieldList[i][1]; obj.bHScroll = scrollFieldList[i][2]; obj.bCarousel = scrollFieldList[i][3]; if (isPSTablet() || isPSPhone())
 scrollFieldList[i][4] = 1; obj.bNoBar = scrollFieldList[i][4]; obj.bModal = scrollFieldList[i][5]; obj.bAutoSize = scrollFieldList[i][6]; obj.nTop = scrollFieldList[i][7]; obj.nLeft = scrollFieldList[i][8]; obj.bPopup = scrollFieldList[i][9]; setScrollStyle(obj); var nMaxHeight = 0; if (obj.bCarousel)
 carouselInit(id); else if (!obj.bPopup)
 scrollInit(id, obj.bAutoSize, nMaxHeight, obj.nTop, obj.nLeft); }
 this.bLazyLoading = false; this.nLazyTime = (new Date()).valueOf();}


function updateScrollFieldList(arrObj) { 
 if (typeof scrollFieldList == 'undefined') {
 scrollFieldList = arrObj; return;  } 
 for (var i = 0; i < arrObj.length; i++) {
 var id = arrObj[i][0]; var bFound = false; for (var j = 0; j < scrollFieldList.length; j++) {
 if (scrollFieldList[j][0] == id) {
 bFound = true; if (arrObj[i][7] == -1) {
 var nTop = scrollFieldList[j][7]; var nLeft = scrollFieldList[j][8]; scrollFieldList[j] = arrObj[i]; scrollFieldList[j][7] = nTop; scrollFieldList[j][8] = nLeft; }
 break; }
 }
 if (!bFound) 
 scrollFieldList[j] = [arrObj[i][0], arrObj[i][1], arrObj[i][2], arrObj[i][3], arrObj[i][4], arrObj[i][5], arrObj[i][6], arrObj[i][7], arrObj[i][8], arrObj[i][9]]; }
}

function IsAutoResize(id) {
 if (typeof scrollFieldList == 'undefined' || scrollFieldList.length == 0) return false; for (var i = 0; i < scrollFieldList.length; i++) {
 if (scrollFieldList[i][0] == id && scrollFieldList[i][2] == 1)
 return true; }
 return false;}

function carouselInit(id) {
 var obj = this.document.getElementById(id); if (!obj) return; obj.bCarousel = true; var objC = obj.children[1]; if (objC.getAttribute('class') &&
 objC.getAttribute('class').indexOf("ps_box-scrollarea") == -1)
 return; var objP = obj.parentNode; var objMore = GetLazyScrollObj(obj); var objPrev = GetLazyScrollObj(obj, true); var nCWidth = objC.children[0].clientWidth; var nCHeight = objC.children[0].clientHeight;  for (var i = 1; i < objC.children.length; i++) {
 if (objC.children[i].clientHeight > nCHeight)
 nCHeight = objC.children[i].clientHeight; }
 var nMaxWidth = obj.clientWidth; var nMaxCnt = parseInt(nMaxWidth / nCWidth + 1); if (nMaxCnt > objC.children.length) nMaxCnt = objC.children.length; var nSpace = (nMaxWidth - (nMaxCnt - 1) * objC.children[0].clientWidth) / 2; var pos = obj.getBoundingClientRect(); var objLeft = obj.children[0]; var objRight = obj.children[2]; removeHide(objLeft); removeHide(objRight); objLeft.style.height = nCHeight + 'px'; objLeft.children[0].style.height = objLeft.clientWidth + 'px'; objLeft.children[0].style.width = objLeft.clientWidth * 0.9 + 'px'
 objRight.style.height = nCHeight + 'px'; objRight.children[0].style.height = objRight.clientWidth + 'px'; objRight.children[0].style.width = objRight.clientWidth * 0.9 + 'px'; var posL = objLeft.getBoundingClientRect(); objRight.style.left = posL.right + nCWidth - posL.left + 'px'; objLeft.style.top = nCHeight / 2 - 20 + 'px'; objRight.style.top = nCHeight / 2 - 20 + 'px'; obj.bCarousel = true; obj.nCWidth = nCWidth; obj.nCHeight = nCHeight; obj.nMaxCnt = nMaxCnt; obj.nSpace = nSpace; obj.nCurPos = 0; var nCnt = parseInt(nMaxCnt / 2); if (nSpace > 0) {
 var nLastPos = objC.children.length - 1; if (objMore)
 nLastPos = objC.children.length - 2; for (var i = 0; i < nCnt; i++) {
 var objLast = objC.children[nLastPos]; objC.removeChild(objLast); objC.insertBefore(objLast, objC.firstChild); }
 var objChild = objC.children[0]; if (nCWidth > nSpace)
 objChild.style.marginLeft = nSpace + 'px'; else
 objChild.style.marginLeft = nSpace - nCWidth + 'px'; }
 
}

function carouselLeft(objL)
{
 var obj = objL.parentNode; var nMaxCnt = obj.nMaxCnt; var nCWidth = obj.nCWidth; var nSpace = obj.nSpace; var objC = obj.children[1]; var nCurPos = obj.nCurPos; var objMore = GetLazyScrollObj(obj); var objPrev = GetLazyScrollObj(obj, true); var objFirst = objC.children[0]; if (objPrev) objFirst = objC.children[1]; objFirst.style.marginLeft = ""; var nCnt = parseInt(nMaxCnt / 2); var nLastPos = objC.children.length - 1; if (objMore)
 nLastPos = objC.children.length - 2; var objLast = objC.children[nLastPos]; objC.removeChild(objLast); objC.insertBefore(objLast, objFirst); var objChild = objC.children[0]; if (objPrev) objChild = objC.children[1]; if (nCWidth > nSpace)
 objChild.style.marginLeft = nSpace + 'px'; else
 objChild.style.marginLeft = nSpace - nCWidth + 'px'; obj.nCurPos = nCurPos + 1; if (objMore)
 objMore.onclick();}


function carouselRight(objL) {
 var obj = objL.parentNode; var nMaxCnt = obj.nMaxCnt; var nCWidth = obj.nCWidth; var nSpace = obj.nSpace; var objC = obj.children[1]; var nCurPos = obj.nCurPos; var objPrev = GetLazyScrollObj(obj, true); var objRemove = objC.children[nCurPos]; if (objPrev) objRemove = objC.children[1]; objRemove.style.marginLeft = ""; objC.removeChild(objRemove); objC.appendChild(objRemove); var objChild = objC.children[0]; if (objPrev) objChild = objC.children[1]; if (nCWidth > nSpace)
 objChild.style.marginLeft = nSpace + 'px'; else
 objChild.style.marginLeft = nSpace - nCWidth + 'px'; if (objMore)
 objMore.onclick();}

function doScroll(objWrap, bLazyScroll) {
 if (bLazyScroll)
 doLazyScroll(objWrap); var id = objWrap.id; var idHeader = id.replace("grid", "colhdr"); var objWrapHeader = document.getElementById(idHeader); if (objWrapHeader && (typeof(objWrapHeader.firstChild.style) != "undefined")) 
 objWrapHeader.firstChild.style.marginLeft = -objWrap.scrollLeft+'px'; for (var j = 0; j < scrollFieldList.length; j++) {
 if (scrollFieldList[j][0] == id) {
 if (objWrap.scrollTop > 0)
 scrollFieldList[j][7] = objWrap.scrollTop; if (objWrap.scrollLeft > 0)
 scrollFieldList[j][8] = objWrap.scrollLeft; }
 }
 if (isIOS()) 
 objWrap.style.zIndex = 11;}

function initAllGrids() {
 if (typeof scrollFieldList == 'undefined' || scrollFieldList.length == 0) return; for (var i = 0; i < scrollFieldList.length; i++) {
 var id = scrollFieldList[i][0]; if (id.indexOf("grid") == -1) continue; gridInit(id); }
}

function gridInit(id) {
 var objWrap = document.getElementById(id); if (!objWrap) return; setRowSelectedAll(id.replace("$grid", ""));  var nLastWidth = objWrap.clientWidth; var idHeader = id.replace("grid", "colhdr"); var objWrapHeader = document.getElementById(idHeader); if (!objWrapHeader) return; var objTable = objWrap.querySelector(".ps_grid-flex"); var objHead = objWrap.querySelector(".ps_grid-head"); var objTableHeader = objWrapHeader.querySelector(".ps_grid-flex-head");  if (!objHead || !objTable || !objTableHeader) return; if (objTable.clientWidth == 0) return; var lst = objWrap.querySelectorAll(".ps_grid-col"); var lst2 = objWrapHeader.querySelectorAll(".ps_grid-col"); objTableHeader.style.width = ''; objWrapHeader.style.width = ''; for (var i = 0; i < lst2.length; i++) {
 if (i == 0 && isClass(lst[i], 'psc_checkbox'))
 { }
 else
 lst2[i].style.width = ''; } 

 
 objTable.style.marginTop = -objHead.clientHeight + 'px';  var bBar = (isClass(objWrap, "sbar_v") && objWrap.scrollHeight > objWrap.clientHeight) ? true : false; var nHeadW = objTable.clientWidth + 2; var objVBar = objTableHeader.querySelector(".psc_gridvbar"); if (bBar) {
 if (browserInfoObj2.isIE || browserInfoObj2.isFF) {
 nHeadW = objHead.clientWidth + 18; if (objVBar) objVBar.style.width = 17 + 'px'; }
 else if (browserInfoObj2.isEdge) {
 nHeadW = objHead.clientWidth + 13; if (objVBar) objVBar.style.width = 14 + 'px'; }
 else {
 nHeadW = objHead.clientWidth + 14; if (objVBar) objVBar.style.width = 15 + 'px'; }
 removeHide(objVBar); setAriaAttr(objVBar, "aria-hidden", "true"); }
 else if (!isHidden(objVBar))
 addHide(objVBar); objTableHeader.style.width = nHeadW + 'px'; objWrapHeader.style.width = nHeadW + 'px';  var nWidths = []; var nColCount = lst.length -1; for (var i = 0; i < nColCount; i++) 
 nWidths.push(lst[i].clientWidth); for (var i = 0; i < nColCount; i++) 
 lst2[i].style.width = nWidths[i] + "px"; }


function getScrollContentContainer(obj)
{
 if (!obj) return null;  var objC = obj; if (isClass(objC,'ps_box-grid') && !isClass(obj.children[0], 'ps_grid-div'))
 objC = obj.children[0]; else if (isClass(objC, 'ps_header-group') && obj.children.length == 2)
 objC = obj.children[1]; return objC;}

function scrollInitDivPopup(scrollId) {
 var otb = MTop().document.getElementById("ptModTable_" + MTop().modId); var nMaxHeight = otb.clientHeight; var objPHeader = otb.querySelector(".ps_header-group.psc_side1"); if (objPHeader && !isHidden(objPHeader))
 nMaxHeight -= objPHeader.clientHeight + 13; else if (!objPHeader) {
 objPHeader = otb.querySelector(".ps_modal_header"); if (objPHeader && !isHidden(objPHeader))
 nMaxHeight -= objPHeader.clientHeight; }

 var obj = document.getElementById(scrollId); if (!isClass(obj, 'ps_scrollable'))
 initScrolls(); scrollInit(scrollId, true, nMaxHeight, 0, 0, otb.clientWidth, true);}

function scrollInit(id, bAutoSize, nMaxHeight, nTop, nLeft, nMaxWidth, bDivPopup) {
 var gid = id.replace("$grid", ""); var gobj = this.document.getElementById(gid); if (gobj && isClass(gobj, "psc_noscroll")) bAutoSize = false; if (!bAutoSize) {
 gridInit(id); return; }
 var obj = this.document.getElementById(id); if (!obj) return; if (typeof nTop == 'undefined' || !nTop)
 nTop = 0; if (typeof nLeft == 'undefined' || !nLeft)
 nLeft = 0; if (typeof bDivPopup == 'undefined')
 bDivPopup = false; obj.bCarousel = false; objP = obj.parentNode; objC = getScrollContentContainer(obj);  objC.style.height = ""; objC.style.width = ""; var bVScroll = obj.bVScroll || isVScroll(obj); var bHScroll = obj.bHScroll || isHScroll(obj); var objMore = GetLazyScrollObj(obj); var objPrev = GetLazyScrollObj(obj, true); var bGrid = (id.indexOf("grid") != -1)? true:false; var nCHeight = objC.clientHeight; var nBarHeight = Math.round(nCHeight /10); if (bGrid) {
 var objHead = obj.querySelector(".ps_grid-head"); if (objHead)
 nCHeight -= objHead.clientHeight; }

 var objS = this.document.getElementById('PT_SIDE'); var fullWidth = Math.min(document.body.scrollWidth,ptCommonObj2.getViewportWidth(window)); var pos = ptCommonObj2.getPosition(obj); var posS = ptCommonObj2.getPosition(objS); if (objS == null || objS.innerHTML.length <= 10)
 posS = { x: 0, y: 0 }; var nMaxW = fullWidth - pos.x - posS.x; var fullHeight = ptCommonObj2.getViewportHeight(window); var nMaxH = fullHeight - pos.y - 1;  if (nMaxH < fullHeight*.20)
 nMaxH = fullHeight; else if (isPSPhone() && nMaxH < fullHeight * .50 && fullHeight < 350)
 nMaxH = fullHeight/2; var objAppC = document.querySelector(".ps_apps_content"); if (objAppC) nMaxH -= 13; var gid = id.replace("$grid", ""); var gobj = this.document.getElementById(gid); var sMarginBottom = gobj ? window.getComputedStyle(gobj).marginBottom : "0px"; var nMarginBottom = sMarginBottom.replace("px", ""); nMaxH -= nMarginBottom; if (id.indexOf("$SORTLIST") != -1) {
 nMaxHeight = getModObjHeight(MTop().modId) - getModObjHeaderHeight(MTop().modId); if (objC.clientHeight == nMaxHeight)
 nMaxHeight += 2; }

 if (typeof nMaxHeight != 'undefined' && nMaxHeight && nMaxHeight > 0) {
 fullHeight = nMaxHeight; nMaxH = nMaxHeight; } 
 if (typeof nMaxWidth != 'undefined' && nMaxWidth && nMaxWidth > 0) {
 fullWidth = nMaxWidth; nMaxW = nMaxWidth; }
 if (nCHeight == 0)
 nCHeight = nMaxH; else
 nCHeight = nCHeight + 3; var objF = this.document.getElementById('PT_FOOTER'); if (!isPSPhone() && !bDivPopup && !isClass(obj, "ps_box-grid-typeahead") && objF) {
 var posF = objF.getBoundingClientRect(); nMaxH = nMaxH - (posF.bottom - posF.top); }
 if (bHScroll) nMaxH = nMaxH - 5; if (bVScroll && objP.clientWidth > 0) {
 var nHeight = 0; if (objMore && (nMaxH > (nCHeight - 15))) {
 nHeight = nCHeight - nBarHeight; }
 else if (objC.clientHeight >= nMaxH) {
 nHeight = nMaxH; }
 else
 nHeight = nCHeight; if (nHeight == 0)
 nHeight = nMaxH; obj.style.height = nHeight +'px'; resetScroll(obj); }
 if (bHScroll && objP.clientHeight > 0) { 
 if (!bVScroll) {
 if ((objC.clientHeight + 5) > nMaxH) {
 objC.style.height = nMaxH + 'px'; obj.style.height = nMaxH + 'px'; }
 else {
 var nHeight = objC.clientHeight; objC.style.height = nHeight + 'px'; obj.style.height = nHeight + 'px'; }
 } 
 
 var nWidth = 0; if (objC.clientWidth >= nMaxW) 
 nWidth = nMaxW; if (nWidth > 0) 
 obj.style.width = nWidth + 'px'; else {
 obj.style.width = ""; }

 if (id.indexOf("grid") != -1) {
 var idHeader = id.replace("grid", "colhdr"); var objWrapHeader = document.getElementById(idHeader); if (objWrapHeader)
 objWrapHeader.style.width = obj.clientWidth + 'px'; }
 resetScroll(obj); }

 if (bGrid)
 gridInit(id);  obj.scrollTop = nTop; obj.scrollLeft = nLeft; if (isIOS()) {
 if (obj.style.zIndex == 11)
 obj.style.zIndex = 0; else
 obj.style.zIndex = 11; }
}

function isVScroll(obj) {
 var sClass = obj.getAttribute('class'); var bVScroll = (sClass && (sClass.indexOf("ps_scrollable_v") != -1 || sClass.indexOf("ps_scrollable_both") != -1)) ? true : false; return bVScroll;}

function isHScroll(obj) {
 var sClass = obj.getAttribute('class'); var bHScroll = (sClass && (sClass.indexOf("ps_scrollable_h") != -1 || sClass.indexOf("ps_scrollable_both") != -1)) ? true : false; return bHScroll;}

function resetScroll(obj) {
 var objMore = GetLazyScrollObj(obj); var objPrev = GetLazyScrollObj(obj, true); var bVScroll = isVScroll(obj); var bHScroll = isHScroll(obj); var nOff = 10; var objC = getScrollContentContainer(obj); if (objMore) {
 if (bVScroll) 
 {
 var objHead = obj.querySelector(".ps_grid-head"); nOff = (objC.clientHeight - obj.clientHeight) - obj.scrollTop; if (objHead) nOff -= objHead.clientHeight; }
 else if (bHScroll) nOff = (objC.clientWidth - obj.clientWidth) - obj.scrollLeft; if (nOff < 5) {
 if (bVScroll)
 obj.scrollTop -= 10; else if (bHScroll)
 obj.scrollLeft -= 10; }
 }
 if (objPrev && bVScroll && obj.scrollTop < 5)
 obj.scrollTop = 5; else if (objPrev && bHScroll && obj.scrollLeft < 5)
 obj.scrollLeft = 5; obj.curScrollLeft = obj.scrollLeft;}

function doOnScroll(obj) {
 var objWrap = obj; if (!objWrap.parentNode) return; var objTrack = objWrap.parentNode.children[1], objContent = objWrap.children[0], objGripper = objTrack.children[0]; var t = objWrap.clientHeight, u = objContent.offsetHeight, v = objTrack.offsetHeight, w = t / u * v; if (w < v) {
 objGripper.style.height = w + 'px'; var x = objWrap.scrollTop / u * v; objGripper.style.top = x + 'px'; objTrack.style.opacity = 1; }
 else
 objTrack.style.opacity = 0;}

function showTrack(obj) {
 var objWrap = obj; var objContent = objWrap.children[0]; var objTrack = objWrap.parentNode.children[1]; var objGripper = objTrack.children[0]; var t = objWrap.clientHeight,
 u = objContent.offsetHeight,
 v = objTrack.offsetHeight,
 w = t / u * v; if (w < v)
 objGripper.style.height = w + 'px'; if (objWrap.clientHeight < objContent.clientHeight)
 objTrack.style.opacity = 1;}

function hideTrack(obj) {
 var objWrap = obj; var objTrack = objWrap.parentNode.children[1]; objTrack.style.opacity = 0;}

this.objGripper = null;this.bLazyLoading = false;this.nLazyTime = null;function scrollingStart(obj) {
 this.objGripper = null; event = event || window.event; if (!((event.which && event.which === 1) || (event.button && event.button === 1))) return; var eObj = ptCommonObj2.getEO(event); if (eObj && eObj.tagName == "INPUT") return; event.preventDefault(); this.objGripper = ptCommonObj2.getMouseCoords(event);}

function scrolling(obj) {
 if (!this.objGripper) return; event = event || window.event; if (!((event.which && event.which === 1) || (event.button && event.button === 1))) return; var eObj = ptCommonObj2.getEO(event); if (eObj && eObj.tagName == "INPUT") return; event.preventDefault(); var objMore = GetLazyScrollObj(obj); var objPrev = GetLazyScrollObj(obj, true); var ePos = ptCommonObj2.getMouseCoords(event); if ((this.objGripper.y - ePos.y) != 0) {
 obj.scrollTop += this.objGripper.y - ePos.y; }
 if ((this.objGripper.x - ePos.x) != 0)
 obj.scrollLeft += this.objGripper.x - ePos.x; this.objGripper = ePos; doLazyScroll(obj, true);}

function scrollingEnd(obj) {
 this.objGripper = null; event.preventDefault();}

function IsAppendScroll(obj) {
 if (obj.getAttribute('action')) return true; return false;}

function GetLazyScrollObj(obj, bPrev) {
 if (!obj || obj.children.length == 0) return null; var bMore = true; if (typeof bPrev != "undefined" && bPrev)
 bMore = false; var objWrap = obj;  var objGridWrap = objWrap; if (obj.bCarousel)
 objGridWrap = objWrap.children[1]; if (objGridWrap) {
 for (var i = 0; i < objGridWrap.children.length; i++) {
 var obj = objGridWrap.children[i]; if (bMore && obj.getAttribute('class') && obj.getAttribute('class').indexOf("ps_box-more") != -1)
 return obj; if (!bMore && obj.getAttribute('class') && obj.getAttribute('class').indexOf("ps_box-prev") != -1)
 return obj; }
 }

 var objGridWrap = objWrap.children[0]; for (var i = 0; i < objGridWrap.children.length; i++) {
 var obj = objGridWrap.children[i]; if (bMore && obj.getAttribute('class') && obj.getAttribute('class').indexOf("ps_box-more") != -1)
 return obj; if (!bMore && obj.getAttribute('class') && obj.getAttribute('class').indexOf("ps_box-prev") != -1)
 return obj; }
 return null;}

function doLazyScroll(objWrap, bMouse) {
 
 

 if (objWrap.curScrollLeft != objWrap.scrollLeft)
 {
 objWrap.curScrollLeft = objWrap.scrollLeft; return; }
 var objMore = GetLazyScrollObj(objWrap); var objPrev = GetLazyScrollObj(objWrap, true); if (!objMore && !objPrev) return; var objContent = objWrap.children[0]; var sClass = objWrap.getAttribute('class'); var bVScroll = (sClass.indexOf("ps_scrollable_v") != -1 || sClass.indexOf("ps_scrollable_both") != -1); var bHScroll = (sClass.indexOf("ps_scrollable_h") != -1 || sClass.indexOf("ps_scrollable_both") != -1); var nOff = 10; if (objMore && bVScroll)
 {
 var objHead = objWrap.querySelector(".ps_grid-head"); nOff = (objContent.clientHeight - objWrap.clientHeight) - objWrap.scrollTop; if (objHead) nOff -= objHead.clientHeight; }
 
 if (objMore && nOff < 5) 
 {
 this.bLazyLoading = true; this.nLazyTime = (new Date()).valueOf(); resetScroll(objWrap); objMore.onclick(); return; }
 else if (objPrev && (bVScroll && objWrap.scrollTop < 1 || bHScroll &&
 objWrap.scrollLeft < 1)) {
 this.bLazyLoading = true; this.nLazyTime = (new Date()).valueOf(); resetScroll(objWrap); objPrev.onclick(); return; }
}

function OnRowAction(obj, sRowActionId) {
 if (typeof sRowActionId != 'undefined' && sRowActionId.length > 0) {
 if (!isAccessibleLayout())
 gFFocusObjId = obj.id; var sEvent = "submitAction_" + winName + "(document." + winName + " ,'" + sRowActionId + "')"; eval(sEvent); }
}
function selectAllRows(obj) {
 var sScript = ""; var winName0 = getPageFormName(obj); var id = obj.id; var hid = id.replace("$selall$0$", "$selallh$0$"); var hobj = document.getElementById(hid); hobj.value = (obj.checked ? obj.getAttribute('ptchecked_val') : obj.getAttribute('ptunchecked_val')); hobj.className = (obj.checked ? 'psc_on' : 'psc_off');  var gid = id.replace("$selall$0$", ""); var objGrid = document.getElementById(winName0 + "div" + gid); var qs = ".psc_rowselect"; var arrObj = objGrid.querySelectorAll(qs); for (var i = 0; i < arrObj.length; i++) {
 arrObj[i].checked = obj.checked; arrObj[i].onclick(); sScript = sScript + "addchg_" + winName + "(null,'" + arrObj[i].id + "');"; }
 eval(sScript);}

function setRowSelected(obj, gid, rowid, event, sRowActionId) {
 cancelBubble(event); var winName0 = getPageFormName(obj); var objGrid = document.getElementById(winName0 + "div" + gid); var objRow = null; if (rowid)
 objRow = document.getElementById(rowid); var hid = obj.id.replace("$selm$", "$selmh$"); var hobj = document.getElementById(hid); hobj.value = (obj.checked ? obj.getAttribute('ptchecked_val') : obj.getAttribute('ptunchecked_val')); hobj.className = (obj.checked ? 'psc_on' : 'psc_off'); if (obj.checked) {
 addClass(objGrid, "psc_has_selected"); if (objRow)
 addClass(objRow, "psc_selected"); }
 else {
 if (objRow)
 removeClass(objRow, "psc_selected"); var qs = ".ps_box-gridc .ps_grid-row.psc_selected"; var arrObj = objGrid.querySelectorAll(qs); if (arrObj.length == 0)
 removeClass(objGrid, "psc_has_selected"); }

 setRowSelectedAll(winName0 + "div" + gid); if (typeof sRowActionId != 'undefined' && sRowActionId.length > 0) {
 gFFocusObjId = obj.id; var sEvent = "addchg_" + winName + "(null,'" + obj.id + "');submitAction_" + winName + "(document." + winName + " ,'" + sRowActionId + "')"; eval(sEvent); }
}

function setRowSelectedAll(gid)
{
var objGrid = document.getElementById(gid);if (!objGrid) return;var qs = ".ps_box-gridc .ps_grid-row.psc_selected";var qs2 = ".ps_grid-row";var arrObj = objGrid.querySelectorAll(qs);var arrObj2 = objGrid.querySelectorAll(qs2);if (arrObj.length == 0)
 removeClass(objGrid, "psc_has_selected");else
 addClass(objGrid, "psc_has_selected");if (arrObj.length > 0 && arrObj.length == arrObj2.length) {
 var obj = objGrid.querySelector(".psc_rowselectall"); if (!obj) return; obj.checked = true; var id = obj.id; var hid = id.replace("$selall$0$", "$selallh$0$"); var hobj = document.getElementById(hid); hobj.value = (obj.checked ? obj.getAttribute('ptchecked_val') : obj.getAttribute('ptunchecked_val')); hobj.className = (obj.checked ? 'psc_on' : 'psc_off');}
}

function selectGridTab(gridName, gridNameTab, tabStyleName, tabName)
{
 autoCloseGridSort(); var objGrid = document.getElementById(gridName); var objTab = document.getElementById(gridNameTab); var sSelTabId = ""; var obj = document.getElementById(tabName); if (obj && isSelected(obj.parentNode)) return; for (var i = 0; i < objTab.children.length; i++) {
 if (isSelected(objTab.children[i])) {
 if (isClass(objTab.children[i], "tab_a"))
 sSelTabId = "tab_a"; else
 sSelTabId = "tab_" + i; removeSelected(objTab.children[i]); objTab.children[i].children[0].tabIndex = -1; objTab.children[i].children[0].setAttribute("href","javascript:void(0);"); }
 else if (isClass(objTab.children[i], tabStyleName)) {
 addSelected(objTab.children[i]); objTab.children[i].children[0].tabIndex = 0; objTab.children[i].children[0].removeAttribute("href"); }

 }
 replaceClass(objGrid, sSelTabId, tabStyleName); var id = gridName.replace('$', '$grid$'); scrollInit(id, IsAutoResize(id));}


function initDropdowns() {
 if (typeof dropdownIDs == 'undefined' || dropdownIDs.length == 0) return; for (var i = 0; i < dropdownIDs.length; i++) {
 var id = dropdownIDs[i]; setDropDown(id); }
}

function setDropDown(id) {
 var obj = document.getElementById(id); if (!obj) return; var bFound = false; for (var i = 0; i < obj.options.length; ++i) {

 if (obj.options[i].selected && obj.parentNode.querySelector(".ps_facade-value")) {
 obj.parentNode.querySelector(".ps_facade-value").innerHTML = obj.options[i].innerHTML; }
 }
}



function isTriggerField(fldname) {
 var obj = document.getElementById(winName + "div" + fldname); if (!obj) return false; var objP = obj.parentNode; if (objP &&!isClass(objP, "psc_rowact"))
 objP = objP.parentNode; if (isClass(obj, "psc_trigger")) {
 if (!gFFocusObjId && isAccessibleLayout() && objP.tagName != 'DIV')
 return false; if (gFFocusObjId)
 gFocusObj = document.getElementById(gFFocusObjId); else if (isClass(objP,"psc_rowact"))
 gFocusObj = objP; ptCommonObj2.tryFocus0(gFocusObj); if (isClass(gFocusObj, "ps-radio"))
 gFocusObj.checked = true; if (!isAnyModal()) gFFocusObjId = null; return true; }
 return false;}


function DoRowSelect(oRow, event, sRowActionId) {
 var oSelect = oRow.querySelector(".ptgrid-singleselect .ps-radio"); if (!oSelect) {
 oSelect = oRow.querySelector(".ptgrid-multiselect .ps-checkbox"); if (!oSelect) return; oSelect.checked = !oSelect.checked; }
 oSelect.onclick(); var sEvent = "addchg_" + winName + "(null,'" + oSelect.id + "');"; eval(sEvent); ptCommonObj2.tryFocus0(oSelect); if (typeof sRowActionId != 'undefined' && sRowActionId.length > 0) {
 gFFocusObjId = oSelect.id; var sEvent = "submitAction_" + winName + "(document." + winName + " ,'" + sRowActionId + "')"; eval(sEvent); }
}

function onClickRadio(obj, gid, rowid, event, sRowActionId) {
 cancelBubble(event);  if (gFFocusObjId) return; obj.checked = true;  setRowSelectedAllRadio(obj, rowid, gid); if (typeof sRowActionId != 'undefined' && sRowActionId.length > 0) {
 gFFocusObjId = obj.id; var sEvent = "addchg_" + winName + "(null,'" + obj.id + "');submitAction_" + winName + "(document." + winName + " ,'" + sRowActionId + "')"; eval(sEvent); }
}

function setRowSelectedAllRadio(obj, rowid, gid) {
 
 var winName0 = getPageFormName(obj); var objGrid = document.getElementById(winName0 + "div" + gid); addClass(objGrid, "psc_has_selected"); var objSel = objGrid.querySelector(".ps_grid-row.psc_selected"); removeClass(objSel, "psc_selected"); addClass(document.getElementById(rowid), "psc_selected");}

function doCtrlClick(id) {
 var obj = this.document.getElementById(id); if (obj.type == "radio") { 
 var pgobj = obj.parentNode.parentNode.parentNode; var qs = "#" + pgobj.id + " input"; var arrObj = document.querySelectorAll(qs); for (var j = 0; j < arrObj.length; j++) {
 if (arrObj[j].type == "radio" && arrObj[j] != obj)
 arrObj[j].checked = false; }
 }
 eval(obj.onclick);}


function doRadioOuterClick(obj)
{
var objCtrl = obj.querySelector('.ps-checkbox'); objCtrl.focus();}

function doRadioClick(obj, id) {
 setupTimeout2(); var objHidden = document.getElementById(id); objHidden.value = (obj.checked ? obj.getAttribute('ptchecked_val') : obj.getAttribute('ptunchecked_val')); objHidden.className = (obj.checked ? 'psc_on' : 'psc_off');}

function setOutline(src, tgt) {
 
 if (!src || !tgt) return;   var cssProp = window.getComputedStyle(src, null); var lineStyle = cssProp.getPropertyValue("outline-style"); var lineWidth = cssProp.getPropertyValue("outline-width");  var lineColor = cssProp.getPropertyValue("outline-color");  if (lineColor.toLowerCase() == "transparent")
 tgt.style.outlineColor = "rgb(0,0,0)";  else
 tgt.style.outlineColor = lineColor; if (lineStyle.toLowerCase() == "none")
 tgt.style.outlineStyle = "dotted"; else
 tgt.style.outlineStyle = lineStyle;  if (lineWidth.toLowerCase() == "0px")
 tgt.style.outlineWidth = "1px"; else
 tgt.style.outlineWidth = lineWidth; tgt.style.outlineOffset = cssProp.getPropertyValue("outline-offset");}

function clearOutline(tgt) {
 if (!tgt) return; tgt.style.outlineColor = ""; tgt.style.outlineStyle = ""; tgt.style.outlineWidth = ""; tgt.style.outlineOffset = "";}

function setOutlineTimer(srcElementName) {
 if (!srcElementName) return; setTimeout("setOutlineTrigger('" + srcElementName + "');", 0);}

function setOutlineTrigger(srcElementName) {
 if (!srcElementName) return; var obj = document.getElementById(srcElementName); if (!obj) return; setOutline(obj, obj.nextElementSibling);}


function ptDisableHiddenRadio() {
 var aobj = document.querySelectorAll(".ps_box-radio.psc_hidden .ps-radio:not(:disabled),.ps_box-radio.psc_force-hidden .ps-radio:not(:disabled)"); for (var i=0; i < aobj.length; i++)
 aobj[i].disabled="disabled"; }





function toggleGroup(fname, fname0, sCollapsTile, sExpandTitle) {
 var objP = document.getElementById(fname); var obj = document.getElementById(fname0); if (!objP && !obj) return; var objD = objP.querySelector(".ps_detail-group"); if (isClose(objD)) {
 removeClose(objP); removeClose(objD); removeClose(obj); setTitle(obj, sExpandTitle)
 }
 else {
 addClose(objP); addClose(objD); addClose(obj); setTitle(obj, sCollapsTile)
 }
 initScrolls0();}




function ResizeAccordions() {
 ResizeSide1Accordion();}



function ResizeSide1Accordion() {
 var objSideC = document.getElementById("PT_SIDE$content"); if (!objSideC || !isClass(objSideC, "ps_accordion")) return false; for (var j = 0 ; j < objSideC.children.length; j++) {
 if (!isClose(objSideC.children[j])) 
 expandAccMD(objSideC.children[j].id, true, true); }
 return true;}

function expandAccMD(fname, bMaxH) {
 var obj = document.getElementById(fname); if (obj.children.length !=2) return; var objP = obj.parentNode;  var arrCont = objP.querySelectorAll("section"); if (arrCont[1].children[1].innerHTML.length == 0) {
 addHide(arrCont[1]); return; }
 else
 removeHide(arrCont[1]); expandAcc(fname, bMaxH, true);}

function expandAcc(fname, bMaxH, bDefault) {
 if (typeof bMaxH == "undefined")
 bMaxH = false; if (typeof bDefault == "undefined")
 bDefault = false; var nfname = fname.replace(/\$/g, "\\$");  nfname = nfname.replace(/\\\\/g, "\\");  var obj = document.querySelector(".ps_accordion > #" + nfname);  if (!obj) return; var objP = obj.parentNode;  var objOpen = null; var arrCont = objP.querySelectorAll("section");  if (!arrCont || arrCont.length == 0) return; var nCur = 0; for (var j = 0 ; j < arrCont.length; j++) {
 var cobj = arrCont[j].querySelector(".ps_accordion_content"); if (!isClose(arrCont[j])) {
 objOpen = arrCont[j]; cobj.style.height = cobj.clientHeight + "px"; }
 if (arrCont[j] == obj)
 nCur = j;  }
 var fullHeight = ptCommonObj2.getViewportHeight(window) -10; if (bMaxH) {
 var objF = document.getElementById('PT_FOOTER');  if (objF) {
 var posF = objF.getBoundingClientRect(); fullHeight = fullHeight - (posF.bottom - posF.top)+10; }
 }
 var nHeaderHeight = arrCont[0].children[0].clientHeight+3;  if (objOpen == obj) 
 {
 var pos = ptCommonObj2.getPosition(obj); var nMaxH = fullHeight - (pos.y + (arrCont.length - nCur) * nHeaderHeight); if (arrCont.length == 2 && (isHidden(arrCont[1]) || isHidden(arrCont[0])))
 nMaxH = fullHeight - (pos.y + nHeaderHeight); var cobj = obj.querySelector(".ps_accordion_content");  if (isClose(obj)) {
 if (!bMaxH)
 cobj.style.height = "0px"; removeClose(obj); removeClose(obj.children[1]); setAriaAttr(obj.children[0], "aria-expanded", "true"); if (bMaxH) {
 removeHide(obj); cobj.style.height = nMaxH + "px"; var sObj = cobj.querySelector('.ps_scrollable'); if (sObj)
 scrollInit(sObj.id, true, nMaxH, 0, 0, cobj.clientWidth, true); } else
 cobj.style.height = cobj.clientHeight + "px"; return; } else if (bMaxH && bDefault) {
 removeHide(obj); cobj.style.height = nMaxH + "px"; var sScript = "var cobj=document.getElementById('" + cobj.id + "');\n if (cobj) {\nvar sObj = cobj.querySelector('.ps_scrollable');\n"; sScript += "if (sObj)\n scrollInit(sObj.id, true, " + nMaxH + ", 0, 0, " + cobj.clientWidth + ", true);\n}"; doGrouplet("runScript@" + sScript); return; } else if (!bDefault && arrCont.length == 2 && (!isHidden(arrCont[1]))) {
 objOpen = obj; if (nCur == 0) {
 obj = arrCont[1]; nCur = 1; }
 else {
 obj = arrCont[0]; nCur = 0; }
 }
 else
 return; }
 removeClose(obj); removeClose(obj.children[1]); setAriaAttr(obj.children[0], "aria-expanded", "true"); var pos = ptCommonObj2.getPosition(obj); var nMaxH = fullHeight - (pos.y + nHeaderHeight+(nCur+1) * nHeaderHeight); if (arrCont.length == 2 && (isHidden(arrCont[1]) || isHidden(arrCont[0])))
 nMaxH = fullHeight - (pos.y + nHeaderHeight);  var cobj = obj.querySelector(".ps_accordion_content"); if (bMaxH) {
 removeHide(cobj); cobj.style.height = nMaxH + "px"; var sScript = "var cobj=document.getElementById('" + cobj.id + "');\n if (cobj) {\nvar sObj = cobj.querySelector('.ps_scrollable');\n"; sScript += "if (sObj)\n scrollInit(sObj.id, true, " + nMaxH + ", 0, 0, " + cobj.clientWidth + ", true);\n}"; if (bDefault)
 doGrouplet("runScript@" + sScript); else
 eval(sScript); } else {

 cobj.style.height = ""; cobj.style.height = cobj.clientHeight + "px"; }

 if (objOpen) {
 addClose(objOpen); setAriaAttr(objOpen.children[0], "aria-expanded", "false"); addClose(objOpen.children[1]); var cobj = objOpen.querySelector(".ps_accordion_content"); if (bMaxH) {
 cobj.style.height = ""; addHide(cobj); }

 if (!bMaxH)
 cobj.style.height = "0px"; }
 
}

function expandHAcc(fname, bBack) {
 var nfname = fname.replace(/\$/g, "\\$");  nfname = nfname.replace(/\\\\/g, "\\");  var obj = document.querySelector(".ps_accordionH > #" + nfname);  if (!obj) return; var bCloseAll = (typeof bBack != 'undefined' && bBack) ? true : false; var objP = obj.parentNode; var objH = objP.children; for (var j = 0; j < objP.children.length; j++) {
 var objG = objH[j].children[1]; if (!objG) continue; var objG0 = objH[j]; var gId = objG0.id; var objHeader = objG.children[0]; var objC = objG.children[1]; var objC0 = objC.children[0]; if (gId == fname && !bCloseAll) {
 objG0.children[0].setAttribute("class", "ps_back"); objG.setAttribute("class", "ps-box_groupExpand"); objG.children[0].setAttribute("class", "ps_header-groupExpand"); objG.children[1].children[0].setAttribute("class", "ps_accordion_content0Expand"); if (objG0)
 objG0.setAttribute("class", "ps-box_groupExpand"); }
 else if (bBack) {
 if (objG0.children.length == 2)
 objG0.children[0].setAttribute("class", "ps_back_hidden"); objG.setAttribute("class", "ps-box_group"); objG.children[0].setAttribute("class", "ps_header-group"); objG.children[1].children[0].setAttribute("class", "ps_accordion_content0"); if (objG0)
 objG0.setAttribute("class", "ps-box_group"); }
 else {
 objG.setAttribute("class", "ps-box_group_hide"); objG.children[0].setAttribute("class", "ps_header-group"); objG.children[1].children[0].setAttribute("class", "ps_accordion_content0"); if (objG0)
 objG0.setAttribute("class", "ps-box_group_hide"); }
 }
}

function expandParent(obj) {
 return;  if (browserInfoObj2.isIE || !document.querySelectorAll(".ps_accordion")) return; var objC = document.querySelectorAll(".ps_accordion_content"); var objC0 = document.querySelectorAll(".ps_accordion_content0"); if (!obj || objC.length == 0) {
 return; }
 objParent = obj.parentNode; var i = -1; while (objParent) {
 for (var j = 0; j < objC.length; j++) {
 if (objParent == objC[j])
 i = j; }
 objParent = objParent.parentNode; }
 for (var j = 0; j < objC.length; j++) {
 if (j == i)
 objC[j].style.height = objC0[j].clientHeight + 'px'; else
 objC[j].style.height = '0px'; }
}


function isAccessibleLayout() {
 if (typeof bAccessibleLayout == 'undefined' || !bAccessibleLayout) return false; return true;}

function hidePtWrapper() {
 var pWin = window; if (oParentWin)
 pWin = oParentWin; addHide(pWin.document.getElementById("PT_WRAPPER"));}

function unhidePtWrapper(){ 
 var pWin = window; if (oParentWin)
 pWin = oParentWin; if (isHidden(pWin.document.getElementById("PT_WRAPPER"))) {
 removeHide(pWin.document.getElementById("PT_WRAPPER")); ptCommonObj2.tryFocus0(pWin.gFocusObj); }
}

function clearTargetGroupBox(evt) {
 var target = ptCommonObj2.getEO(evt); if (target) target.innerHTML = "";}

function hasClass(obj, sClass0) {
 if (!obj) return false; var sStr = " " + sClass0; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; var pos = sClass.indexOf(sStr); if (sClass0.length == sClass.length && sClass.indexOf(sClass0) == 0)
 return true; if (pos > -1) {
 if ((pos + sStr.length == sClass.length))
 return true; else {
 if (sClass.charAt(pos+sStr.length) == " ")
 return true; }
 }
 return false;}

function replaceClass(obj, sClass0, sClass1) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; sClass = sClass.replace(sClass0, sClass1); obj.setAttribute("class", sClass);}

function removeClass(obj, sClass0) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; sClass = sClass.replace(" " + sClass0, ""); sClass = sClass.replace(sClass0, ""); obj.setAttribute("class", sClass);}


function addClass(obj, sClass0) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" "+sClass0) != -1) return; obj.setAttribute("class", sClass + " "+sClass0);}

function toggleClass(obj, sClass0) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" "+sClass0) != -1)
 removeClass(obj, sClass0); else
 addClass(obj, sClass0);}

function getPageFormName(obj) {
 var pageFormName = winName; var id = obj.id; if (typeof id == 'undefined' || !id || id.indexOf(winName) == -1) {
 if (!obj.parentNode) return pageFormName; id = obj.parentNode.id;  if (typeof id == 'undefined' || !id || id.indexOf(winName) == -1) 
 return pageFormName; }
 var pos = id.indexOf("div"); pageFormName = id.substring(0, pos); return pageFormName;}

function getObjFromContainer(obj) {
 var id = obj.id; var winName0 = getPageFormName(obj); if (typeof id != undefined && id.indexOf(winName0 + 'div') != -1)
 {
 var idPreFix = winName0+'div'; id = obj.id.substring(idPreFix.length, id.length); var obj2 = document.getElementById(id); if (obj2)
 return obj2; else
 return obj; }
 else
 return obj;}

function removeStateAttr(obj, sState0) {
 if (!obj || !isClass(obj,"ps_box-group")) return; obj = getObjFromContainer(obj); var sState = (obj.getAttribute("ps_state")) ? obj.getAttribute("ps_state") : ""; sState = sState.replace(" " + sState0, ""); sState = sState.replace(sState0, ""); obj.setAttribute("ps_state", sState); var sScript = "addchg_" + winName + "(null,'" + obj.id + "');"; eval(sScript);}


function addStateAttr(obj, sState0) {
 if (!obj || !isClass(obj,"ps_box-group")) return; obj = getObjFromContainer(obj); var sState = (obj.getAttribute("ps_state")) ? obj.getAttribute("ps_state") : ""; if (sState.indexOf(" "+sState0) != -1) return; obj.setAttribute("ps_state", sState + " "+sState0); var sScript = "addchg_" + winName + "(null,'" + obj.id + "');"; eval(sScript);}

function toggleClass(obj, sClass0) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" "+sClass0) != -1)
 removeClass(obj, sClass0); else
 addClass(obj, sClass0);}

function removeHide(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; sClass = sClass.replace(" psc_hidden", ""); sClass = sClass.replace("psc_hidden", ""); obj.setAttribute("class", sClass); setAriaAttr(obj, "aria-hidden", "false"); removeStateAttr(obj, "psc_hidden");}


function addHide(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_hidden") !=-1) return; obj.setAttribute("class", sClass + " psc_hidden"); setAriaAttr(obj, "aria-hidden", "true"); addStateAttr(obj, "psc_hidden");}

function isHidden(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_hidden") != -1 || sClass.indexOf("psc_hidden") == 0) return true; return false;}

function removeInvisible(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; sClass = sClass.replace(" psc_invisible", ""); sClass = sClass.replace("psc_invisible", ""); obj.setAttribute("class", sClass); setAttr(obj, "aria-hidden", "false"); removeStateAttr(obj, "psc_invisible");}


function addInvisible(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_invisible") != -1) return; obj.setAttribute("class", sClass + " psc_invisible"); setAriaAttr(obj, "aria-hidden", "true"); addStateAttr(obj, "psc_invisible");}

function isInvisible(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_invisible") != -1) return true; return false;}

function removeClose(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; sClass = sClass.replace(" psc_close", ""); sClass = sClass.replace("psc_close", ""); obj.setAttribute("class", sClass); setAriaAttr(obj, "aria-expanded", "true"); removeStateAttr(obj, "psc_close");}


function addClose(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_close") != -1) return; obj.setAttribute("class", sClass + " psc_close"); setAriaAttr(obj, "aria-expanded", "false"); addStateAttr(obj, "psc_close");}

function isClose(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_close") != -1) return true; return false;}

function isSelected(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_selected") != -1) return true; return false;}

function addSelected(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_selected") != -1) return; obj.setAttribute("class", sClass + " psc_selected"); setAriaAttr(obj, "aria-selected", "true"); addStateAttr(obj, "psc_selected");}

function removeSelected(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; sClass = sClass.replace(" psc_selected", ""); sClass = sClass.replace("psc_selected", ""); obj.setAttribute("class", sClass); setAriaAttr(obj, "aria-selected", "false"); removeStateAttr(obj, "psc_selected");}

function isDisabled(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_disabled") != -1) return true; return false;}

function addDisabled(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_disabled") != -1) return; obj.setAttribute("class", sClass + " psc_disabled"); setAriaAttr(obj, "aria-disabled", "true"); addStateAttr(obj, "psc_disabled");}

function removeDisabled(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; sClass = sClass.replace(" psc_disabled", ""); sClass = sClass.replace("psc_disabled", ""); obj.setAttribute("class", sClass); setAriaAttr(obj, "aria-disabled", "false"); removeStateAttr(obj, "psc_disabled");}

function removeInvisible(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; sClass = sClass.replace(" psc_invisible", ""); sClass = sClass.replace("psc_invisible", ""); obj.setAttribute("class", sClass);}


function addInvisible(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_invisible") != -1) return; obj.setAttribute("class", sClass + " psc_invisible");}

function isInvisible(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_invisible") != -1) return true; return false;}

function removeOn(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; sClass = sClass.replace(" psc_on", ""); sClass = sClass.replace("psc_on", ""); obj.setAttribute("class", sClass);}

function addOn(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_on") != -1) return; obj.setAttribute("class", sClass + " psc_on");}

function isOn(obj) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" psc_on") != -1) return true; return false;}

function isClass(obj, sClass0) {
 if (!obj) return false; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(sClass0) != -1) return true; return false;}

function isDraggable(obj) {
 if (!obj) return false; var sValue = (obj.getAttribute('draggable')) ? obj.getAttribute('draggable') : ""; if (sValue.indexOf('true') != -1) return true; return false;}

function isDroppable(obj) {
 if (!obj) return false; var sValue = (obj.getAttribute('droppable')) ? obj.getAttribute('droppable') : ""; if (sValue.indexOf('true') != -1) return true; return false;}

function setAriaAttr(obj, sAttrName, sAttrValue) {
 setAttr(obj, sAttrName, sAttrValue);}

function setAttr(obj, sAttrName, sAttrValue) {
 if (!obj) return; obj.setAttribute(sAttrName, sAttrValue);}

function setTitle(obj, sTitle) {
 if (!obj) return; obj.setAttribute('title', sTitle);}

function getGridTabClass(gObj) {
 
 for (var j = 0 ; j < 10; j++) {
 if (isClass(gObj,"tab_"+j)) return "tab_"+j; }
 if (isClass(gObj, "tab_a")) return "tab_a"; return "";}

function isTouchKeyboard() {
 if (!isFModeLayout()) return false; var obj = document.getElementById("pt_envinfo"); var sDeviceType = obj.getAttribute("devicetype"); if (sDeviceType.indexOf("tablet") != -1 || sDeviceType.indexOf("phone") != -1)
 return true; else
 return false;}

function cleanupCalendar() {
 if (isFModeLayout() && isModalPage(winName)) {
 var cal = window._PS_popupCalendar; if (cal != null) {
 cal.onClose(cal);  window.dateBoxOpen = false;  }
 }
}

function isPSPhone() {
 var obj = document.getElementById("pt_envinfo"); var sDeviceType = obj.getAttribute("devicetype"); if (sDeviceType.indexOf("phone") != -1)
 return true; else
 return false;}

function isIPhone() {
 if (isPSPhone() && browserInfoObj2.isSafari)
 return true; else
 return false;}

function isIPhoneInModal(obj) {
 if (isIPhone() && obj.bModal)
 return true; else
 return false;}

function isPSTablet() {
 var obj = document.getElementById("pt_envinfo"); var sDeviceType = obj.getAttribute("devicetype"); if (sDeviceType.indexOf("tablet") != -1)
 return true; else
 return false;}

function isIPad() {
 if (isPSTablet() && browserInfoObj2.isSafari)
 return true; else
 return false;}

function isIPadInModal(obj) {
 if (isPSTablet() && obj.bModal)
 return true; else
 return false;}

function isIOS() {
 return isClass(document.querySelector('html'), "ios");}

function isAndriod() {
 return isClass(document.querySelector('html'), "android");}

function isRTL() {
 return isClass(document.querySelector('html'), "psc_dir-rtl");}

function isMDListPopup() {
 return isClass(document.querySelector('html'), "psc_mdlistpopup");}

function isMDListAccordion() {
 return isClass(document.querySelector('html'), "psc_mdlistaccordion");}

function isSUOW() {
 return isClass(document.querySelector('html'), "psc_mode-suow");}

function isSingleComponentAG() {
 return isClass(document.querySelector('html'), "psc_mode-singleag");}

function isMDGuided() {
 return isClass(document.querySelector('html'), "psc_mode-guided");}

function getHTMLObjectByClass(obj, sClass) {
 try {
 if (typeof obj == 'undefined' || obj == null) return null; while (!hasClass(obj, sClass)) {
 obj = obj.parentElement; if (obj == null) return null; }
 if (hasClass(obj, sClass)) return obj; } catch (event) {
 return null; }
 return null;}

function getHTMLObjectByAttrVal(obj, attr, val) {
 try {
 if (typeof obj == 'undefined' || obj == null) return null; while (obj.getAttribute(attr) != val)
 obj = obj.parentElement; if (obj.getAttribute(attr) == val) return obj; } catch (event) {
 return null; }
 return null;}

function getHTMLObject(obj, attr) {
 try {
 if (typeof obj == 'undefined' || obj == null) return null; while (obj.getAttribute(attr) != "true")
 obj = obj.parentElement; if (obj.getAttribute(attr) == "true") return obj; } catch (event) {
 return null; }
 return null;}

function getLayerXY(evt, el, elGes) {
 var x = 0,
 y = 0; while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
 x += el.offsetLeft - el.scrollLeft; y += el.offsetTop - el.scrollTop; el = el.offsetParent; }

 x = evt.targetTouches[0].clientX - x;  y = evt.targetTouches[0].clientY - y;  return { x: x, y: y };}



function getJSONCookie(cookieName) {
 var deviceCookie = getCookieValue(cookieName); if (deviceCookie != null && deviceCookie != "") {
 deviceCookie = '{"' + deviceCookie + '}'; deviceCookie = deviceCookie.replace(/ /g, ',"'); deviceCookie = deviceCookie.replace(/:/g, '":'); }
 return deviceCookie;}



function doAppKeyEnter(evt, id){
 var key = getKeyCode(evt); if (key == 13 && isFModeLayout()) {
 var tObj = document.getElementById(id); if (tObj) {
 var sScript = tObj.getAttribute('href'); var bSubmitScript = (sScript != null) ? true : false; if (bSubmitScript) eval(sScript); }
 }
 return;}


function DoTabbing(evt, id, bReset) {
 var objWrap = document.getElementById("PT_WRAPPER"); if (typeof id != "undefined" && id)
 objWrap = document.getElementById(id); else if (!(isClass(objWrap, "ps_modal") || isDialog(objWrap))) 
 return; var target = getEventTarget(evt); var isTab = !isShiftKey(oLastKeyEvent) && getKeyCode(oLastKeyEvent) == 9 ? true : false; var isShiftTab = isShiftKey(oLastKeyEvent) && getKeyCode(oLastKeyEvent) == 9 ? true : false; if (bReset || target.id.indexOf("ICLastAnchor") != -1 && isTab) {
 var objs = objWrap.querySelectorAll(".psc_rowact, INPUT, A, SELECT, BUTTON, TEXTAREA"); for (var i = 0; i < objs.length; i++) {
 if (objs[i].tagName == 'INPUT' && objs[i].type == 'HIDDEN') continue; var position = ptCommonObj2.getPosition(objs[i]); if (position.x == 0 && position.y == 0) continue; if (!ptCommonObj2.tryFocus0(objs[i])) return; }
 return; }
 if (target.id.indexOf("ICFirstAnchor") != -1 && isShiftTab) {
 var objs = objWrap.querySelectorAll(".psc_rowact, INPUT, A, SELECT, BUTTON, TEXTAREA"); for (var i = objs.length-1; i > -1; i--) {
 if (objs[i].tagName == 'INPUT' && objs[i].type == 'HIDDEN') continue; var position = ptCommonObj2.getPosition(objs[i]); if (position.x == 0 && position.y == 0) continue; if (!ptCommonObj2.tryFocus0(objs[i])) return; }
 return; }
}


function ptCloseConfirmation() {
 var gbxobj = document.getElementById(document.forms[0].name + "hdrdivPT_CONFIRMATION"); if (!gbxobj) return; gbxobj.classList.remove("psc_open-alt","psc_open");}

function ptSetConfirmationMessage(msg, noautoclose, styles) {
 
 var gbxobj = document.getElementById(document.forms[0].name + "hdrdivPT_CONFIRMATION"); var txtobj = document.getElementById("PT_CONFIRM_MSG"); var btnobj = document.getElementById("PT_CONFIRM_CLOSE");  if (!gbxobj) return;  if (!msg || !styles) {
 ptCloseConfirmation(); return; }
 
 txtobj.innerHTML = msg;  var astyles = styles.split(" "); for (var i=0; i< astyles.length; i++) {
 var x = astyles[i]; if (x == "psc_open") {
 if (gbxobj.classList.contains(x)) {
 x = "psc_open-alt"; } 
 gbxobj.classList.remove("psc_open","psc_open-alt"); }
 gbxobj.classList.add(x); }
 
 btnobj.setAttribute("href","javascript:ptCloseConfirmation();");  if (noautoclose) btnobj.focus();}


function SetTargetFocus(oWrap) {
 if (oWrap) {
 var elements = oWrap.querySelectorAll(".psc_rowact, INPUT, A, SELECT, BUTTON"); for (var i = 0; i < elements.length; i++) {
 var el = elements[i]; if (!ptCommonObj2.tryFocus0(el)) return el; } 
 }
 return;}
function SetMainConentFocus(bSet)
{
 var oTFrame = document.querySelector(".ps_target-iframe"); if (oTFrame && (typeof bSet == "undefined" || bSet)) {
 oWin = oTFrame.contentWindow; oWin.ptCommonObj2.skipToMainContent(); skipLnk = top.document.getElementById("PT_SKIPNAV_CONT"); if (skipLnk) 
 addHide(skipLnk); return; }
 var mainObj = document.getElementById("PT_MAIN"); var panelObj = mainObj.querySelector(".psc_panel-contentinterior"); if (isClass(document.querySelector('html'), "psc_mode-fscreen-search")) {
 mainObj = document.getElementById("PT_SEARCH_SIDE"); if (!mainObj)
 mainObj = document.getElementById("PT_SEARCH"); panelObj = mainObj.querySelector(".psc_panel-contentinterior"); if (panelObj)
 mainObj = panelObj; } else if (isSide1FullScreen())
 mainObj = document.getElementById("PT_SIDE"); else if (isSide2FullScreen())
 mainObj = document.getElementById("PT_SIDE2"); else if (panelObj)
 mainObj = panelObj; skipLnk = top.document.getElementById("PT_SKIPNAV_CONT"); if (skipLnk) 
 addHide(skipLnk); if (typeof bSet == "undefined" || bSet) {
 if (typeof mainObj.tabIndex == "undefined" || mainObj.tabIndex == "" || mainObj.tabIndex == -1)
 mainObj.tabIndex = "-1"; ptCommonObj2.tryFocus0(mainObj); }

}

function isSide1FullScreen() {
 var objWrapper = document.getElementById('PT_WRAPPER'); if (isClass(objWrapper, 'pst_side1-fullsize') && isClass(objWrapper, 'pst_side1-open'))
 return ture; else
 return false;}


function isSide2FullScreen() {
 var objWrapper = document.getElementById('PT_WRAPPER'); if (isClass(objWrapper, 'pst_side2-fullsize') && isClass(objWrapper, 'pst_side2-open'))
 return ture; else
 return false;}
function showPromptCriteria() {
var criteriaElem = document.querySelector(".ps_prompt-criteria")
if (criteriaElem.querySelectorAll(".ps_detail-group .psc_fld-prompt").length == 0)
 addClass(criteriaElem, 'psc_hidden');}

function openIOSAttachment(url) {
if (window.navigator.standalone) return;if (isMAF() == "1") return;var win = window.open();if (win)
 win.document.location = url;}


function psAnnounceText(str) {
 if (loader) {
 psAnnounceText0(str); } else {
 top.window.doGrouplet("runScript@setTimeout(function () { psAnnounceText0('"+str+"'); }, 500);"); }
}

function psAnnounceText0(str) {
 var obj = document.querySelector(".ps_box-announce.ps_alert-normal"); if (obj) psPostText(obj, str);}

function psPostText(obj,str) {
 var t = document.createTextNode(str);  if (!t) return; obj.appendChild(t);}


function showKeyFieldsOnly(objSG, bFlag){ 
 for (var j = 0 ; j < objSG.children.length; j++) {
 if (bFlag && !isClass(objSG.children[j], "psc_key"))
 addHide(objSG.children[j]); else if (!bFlag && !isClass(objSG.children[j], "psc_key"))
 removeHide(objSG.children[j]); }
}


function changeOperator(obj) {
 var wrapObj = obj.parentElement.parentElement; var sClass = (wrapObj.getAttribute("class")) ? wrapObj.getAttribute("class") : ""; if (obj.value == 9 || sClass.indexOf("psc_op-between") > 0)
 toggleClass(wrapObj, "psc_op-between"); var opId = obj.id.split("$")[0] + "_OP"; document.getElementById(opId).innerHTML = obj.options[obj.selectedIndex].text; if (obj.value == 10) 
 obj.parentElement.nextSibling.firstChild.removeAttribute("maxlength")
 else
 obj.parentElement.nextSibling.firstChild.setAttribute("maxlength", obj.parentElement.nextSibling.firstChild.getAttribute("maxlengthnui"));} 

function SearchPageOpen() {
 SetSearchPrevNext(); var searchObj = document.getElementById("PT_SEARCH"); if (!searchObj) return; removeClose(searchObj); var objC = document.getElementById("PT_CONTENT"); addHide(objC);}

function SearchPageClose() {
 SetSearchPrevNext(); var searchObj = document.getElementById('PT_SEARCH'); if (!searchObj) return; addClass(searchObj, 'side'); addClose(searchObj); var objC = document.getElementById("PT_CONTENT"); removeHide(objC); if (searchObj.children.length == 0) {
 var nextInListObj = document.querySelector('.ps_menuitem.ps_header-retlist'); addHide(nextInListObj); }
}


function SearchPageInModal(id, bAdd, moptions) {
 var mDivObj = document.getElementById(winName + "div" + id); if (!mDivObj) return; moptions += "sCacheParentId@" + mDivObj.parentNode.id + ";"; addDivPopup(mDivObj, window, moptions); playDivPopup(); doGrouplet("initScrolls@100"); if (typeof bAdd != 'undefined' && bAdd) 
 selectSearchTab(document.getElementById("PTLAYOUT_SEARCHPAGETAB2")); else
 selectSearchTab(document.getElementById("PTLAYOUT_SEARCHPAGETAB1"));}

function SearchPageInFullSreen(id, bAdd) {
 openSide1FullScreen(); removeClass(document.querySelector('html'), "psc_mode-search"); addClass(document.querySelector('html'), "psc_mode-fscreen-search"); removeHide(document.querySelector('.ps_button_backnav.psc_toolaction-back')); addHide(document.querySelector('.ps_button_backnav.psc_toolaction-backs')); var objTop = document.getElementById('PT_SIDE_TOP0'); if (objTop && isClass(objTop.firstChild, 'ps_header-group'))
 addHide(objTop.firstChild); var objBottom0 = document.getElementById('PT_SIDE_BOTTOM0'); if (objBottom0) {
 if (isClass(objBottom0.firstChild, 'ps_header-group'))
 addHide(objBottom0.firstChild); addHide(objBottom0); }
 if (typeof bAdd != 'undefined' && bAdd)
 selectSearchTab(document.getElementById("PTLAYOUT_SEARCHPAGETAB2")); else
 selectSearchTab(document.getElementById("PTLAYOUT_SEARCHPAGETAB1")); doGrouplet("initScrolls@100");}

function DoSearch(bMSearch, id, bAdd, moptions) {
 closeLastModal(); if (typeof moptions != 'undefined' && moptions.length > 0)
 SearchPageInModal(id, bAdd, moptions); else
 SearchPageInFullSreen(id, bAdd); if (typeof bMSearch == 'undefined' || !bMSearch) {
 SearchPageOpen(); var objRtnSrchHdr = document.getElementById(winName + "srchdivPTS_RTNSRCH_HDR"); if (objRtnSrchHdr)
 removeClass(objRtnSrchHdr, 'psc_force-hidden'); initScrolls0(); var objCancel = document.getElementById(winName + "srchdivPT_SEARCHCANCEL"); if (objCancel)
 removeHide(objCancel); }
}

function DoSearchCancel(){
 var searchObj = document.getElementById("PT_SEARCH"); if (!searchObj) return; SearchPageClose(); var saveObj = document.getElementById(winName + "hdrdivPT_SAVE"); if (saveObj)
 removeHide(saveObj); var prevObj = document.querySelector('.ps_menuitem.ps_header-previous'); removeHide(prevObj); var nextObj = document.querySelector('.ps_menuitem.ps_header-next'); removeHide(nextObj);}

function selectSearchTab(objLink) {
 var idTabBox = winName + "srchdivPT_SEARCHTABBOX"; var objP = document.getElementById(idTabBox); if (!objP || objP.children.length != 2) return; var obj = objLink.parentNode.parentNode.parentNode; if (isSelected(obj)) return; var idSGrp = winName + "srchdivPT_SEARCHITEMBOX"; var idAGrp = winName + "srchdivPT_ADDITEMBOX"; var idSRGrp = winName + "srchdivPT_SEARCHRESULT"; if (objP.children[0] == obj) {
 removeSelected(objP.children[1]); addHide(document.getElementById(idAGrp)); addSelected(objP.children[0]); removeHide(document.getElementById(idSGrp)); removeHide(document.getElementById(idSRGrp)); }
 else {

 addHide(document.getElementById(idSGrp)); removeSelected(objP.children[0]); removeHide(document.getElementById(idAGrp)); addSelected(objP.children[1]); addHide(document.getElementById(idSRGrp)); }

}


function DoBackToSearchEvent() {
 removeClass(document.querySelector('html'), "psc_mode-guided"); var oWin = top.window; var retListObjC = oWin.document.querySelector('.ps_menuitem.ps_header-returnlist'); if (!retListObjC) return; var retListObj = retListObjC.querySelector('A'); var sScript = retListObj.getAttribute('href');  var pt_history = getHistoryObject(); if (pt_history != null) {
 thisRec = pt_history.pop();  var backRec = pt_history.updatedBack();   for (var i = pt_history.backIndex - 1; i >= 0; i--) {
 if (pt_history.nodes[i].valid == 1) {
 pt_history.backIndex = i; break;  }
 } 
 pt_history.save(); fixUpBackButton(); }

 var bScript = (isOnClickCancelBubble(retListObj) && sScript != null && sScript.indexOf("javascript:") != -1) ? true : false; if (bScript)
 eval(sScript); else
 retListObj.onclick();}

function DoBackToSearch() {
 var bChanged = checkFrameChanged(window); var agTarget = typeof document.getElementById("ICAGTarget") != 'undefined' && document.getElementById("ICAGTarget"); var agChanged = agTarget ? (typeof document.getElementById("ICUOW") != 'undefined' && document.getElementById("ICUOW") != null && document.getElementById("ICUOW").value != "N" ? true : false) : false; if (bChanged || agChanged) {
 var sJS = 'javascript:DoBackToSearchEvent()';  psConfirmSW("", sJS, window); } else {
 DoBackToSearchEvent(); }
}

function DoBackToSearch0() {
 removeClass(document.querySelector('html'), "psc_mode-guided"); var oWin = top.window; var retListObjC = oWin.document.querySelector('.ps_menuitem.ps_header-returnlist'); if (!retListObjC) return; bSearchDialog_empty = true; var retListObj = retListObjC.querySelector('A'); var sScript = retListObj.getAttribute('href'); var bScript = (isOnClickCancelBubble(retListObj) && sScript != null && sScript.indexOf("javascript:") != -1) ? true : false; if (bScript)
 eval(sScript); else
 retListObj.onclick();}




function toggleGBLSearchTray(buttonid) {
 var obj; if (!buttonid) buttonid="PT_GSEARCH_BTN"; obj = document.getElementById(buttonid); if (!obj) return; toggleClass(obj.parentElement.parentElement.nextElementSibling,'psc_closed');  obj.setAttribute('aria-expanded',(obj.getAttribute('aria-expanded') == 'true')?'false':'true');}

function closeGBLSearchTray(evt,buttonid) {
 if (evt && getKeyCode(evt) == 27) { 
 toggleGBLSearchTray(buttonid); cancelBubble(evt); }
}
function closeSide1FullScreen() {
 var objWrapper = document.getElementById('PT_WRAPPER'); removeClass(objWrapper, 'pst_side1-fullsize'); removeClass(objWrapper, 'pst_side1-open');}

function openSide1FullScreen() {
 var objWrapper = document.getElementById('PT_WRAPPER'); addClass(objWrapper, 'pst_side1-fullsize'); addClass(objWrapper, 'pst_side1-open');}

function disableSide1() {
 var objWrapper = document.getElementById('PT_WRAPPER'); addClass(objWrapper,'pst_side1-disabled');}

function cleareSide1Bottom() {
 var objSide1Bottom = document.getElementById('PT_SIDE_BOTTOM'); objSide1Bottom.innerHTML = ""; addHide(document.getElementById('PT_SIDE_BOTTOM0'));}

function enableSide2() {
 var objSide2 = document.getElementById('PT_SIDE2'); removeClass(objSide2, 'psc_force-hidden');}

function selectSide2Tab(obj, idGrp1, idGrp2)
{
 var objC = document.getElementById(winName + "side2div" + obj.id); var objP = objC.parentNode; if (!objP || objP.children.length != 2) return; if (isSelected(objP)) return; var idGrp1 = winName + "side2div" + idGrp1; var idGrp2 = winName + "side2div" + idGrp2; if (objP.children[0] == objC) {
 removeSelected(objP.children[1]); addHide(document.getElementById(idGrp2)); addSelected(objP.children[0]); removeHide(document.getElementById(idGrp1)); }
 else {

 addHide(document.getElementById(idGrp1)); removeSelected(objP.children[0]); removeHide(document.getElementById(idGrp2)); addSelected(objP.children[1]); }
}





function toggleTwoChildGroups(fname, nIndex) {
 var objP = document.getElementById(fname); if (!objP || objP.children.length != 2) return; if (typeof nIndex == "undefined") nIndex = -1; if (nIndex == 1) {
 addHide(objP.children[0]); removeHide(objP.children[1]); return; }
 if (nIndex == 0) {
 addHide(objP.children[1]); removeHide(objP.children[0]); return; }
 if (isHidden(objP.children[0])) {
 addHide(objP.children[1]); removeHide(objP.children[0]); }
 else {
 addHide(objP.children[0]); removeHide(objP.children[1]); }
 return;}

function toggleSideTab(fname, nSide) {
 var objWrapper = document.getElementById("PT_WRAPPER");  var objSide = document.getElementById(fname);  var sClassOpen = 'pst_side' + nSide + '-open'; var sClassClose = 'pst_side' + nSide + '-closed'; var bOpen = isClass(objWrapper, sClassOpen); if (bOpen) {
 removeClass(objWrapper, sClassOpen); addClass(objWrapper, sClassClose); setAriaAttr(objSide, "aria-expanded", "false"); } else {
 removeClass(objWrapper, sClassClose); addClass(objWrapper, sClassOpen); setAriaAttr(objSide, "aria-expanded", "true"); }

 if (typeof(SetGridSize) == "function") SetGridSize(); if (ResizeAccordions())
 initScrolls0();}


function closeSidePanel(nSide, objSide) {
 if (nSide < 1 || nSide > 2) return; if (typeof objSide == "string") {
 if (objSide) {
 objSide = document.getElementById(objSide); } else {
 objSide = document.querySelector(".pst_panel-side"+nSide+" .pst_panel-tabcontainer .ps-button"); }
 }
 if (!objSide) return; var objWrapper = document.getElementById("PT_WRAPPER");  var sClassOpen = 'pst_side' + nSide + '-open'; var sClassClose = 'pst_side' + nSide + '-closed'; var bOpen = isClass(objWrapper, sClassOpen); if (bOpen) {
 removeClass(objWrapper, sClassOpen); addClass(objWrapper, sClassClose); bOpen = (!bOpen); }
 
 setAriaAttr(objSide, "aria-expanded", String(bOpen));}


function openSidePanel(nSide, objSide, forceMode) {
 if (nSide < 1 || nSide > 2) return; var objSidePanel = document.querySelector(".pst_panel-side"+nSide); if (!objSidePanel) return; if (typeof objSide == "string") {
 if (objSide) {
 objSide = document.getElementById(objSide); } else {
 objSide = objSidePanel.querySelector(".pst_panel-tabcontainer .ps-button"); }
 }
 if (!objSide) return; var objWrapper = document.getElementById("PT_WRAPPER");  var sClassOpen = 'pst_side' + nSide + '-open'; var sClassClose = 'pst_side' + nSide + '-closed'; var bOpen = isClass(objWrapper, sClassOpen); var bInOverlay = (window.getComputedStyle(objSidePanel, null).getPropertyValue("position") == "absolute"); var bTabVisible = (objSide.offsetParent != null); if (!bOpen && ((bInOverlay && forceMode) || (!bInOverlay && (bTabVisible || forceMode)))) {
 removeClass(objWrapper, sClassClose); addClass(objWrapper, sClassOpen); bOpen = (!bOpen); }
 
 setAriaAttr(objSide, "aria-expanded", String(bOpen));}


function syncSideTabAria(nSide,objSide) {
 if (nSide < 1 || nSide > 2) return; if (typeof objSide == "string") {
 if (objSide) {
 objSide = document.getElementById(objSide); } else {
 objSide = document.querySelector(".pst_panel-side"+nSide+" .pst_panel-tabcontainer .ps-button"); }
 }
 if (!objSide) return; var objWrapper = document.getElementById("PT_WRAPPER");  var sClassOpen = "pst_side" + nSide + "-open"; var bOpen = isClass(objWrapper, sClassOpen);  setAriaAttr(objSide, "aria-expanded", String(bOpen));}

function toggle2PanelTab(fname) {

 var objWrapper = document.getElementById(winName+fname); var sClassOpen = 'psc_open'; var sClassClose = 'psc_closed'; removeClass(objWrapper, 'psc_initial'); var bOpen = isClass(objWrapper, sClassOpen); if (bOpen) {
 removeClass(objWrapper, sClassOpen); addClass(objWrapper, sClassClose); setAriaAttr(objWrapper, "aria-expanded", "false"); } else {
 removeClass(objWrapper, sClassClose); addClass(objWrapper, sClassOpen); setAriaAttr(objWrapper, "aria-expanded", "true"); }
}

function expandSideTab(fname) {
 if (browserInfoObj2.isIE) return; var obj = document.getElementById(fname);  var bDoOpen = true; if (obj.getAttribute("class").indexOf(" open") != -1)
 bDoOpen = false; var objP = obj.parentNode; for (var j = 0; j < objP.children.length; j++) {
 var objC = objP.children[j]; if (bDoOpen) {
 if (objC.id != fname)
 addHide(objC); else {
 removeClose(objP); removeClose(objC); addClass(objC, "open"); }
 } else {
 if (objC.id != fname)
 removeHide(objC); else {
 addClose(objP); addClose(objC); removeClass(objC, "open"); }
 }
 }

}




function DoMDListPopup(id, moptions0) {
 var mDivObj = document.getElementById("PT_SIDE_TOP"); if (!mDivObj) return; var objTitle = document.getElementById("PT_SIDE_TOP0$h"); if (objTitle && objTitle.innerHTML != "")
 removeHide(objTitle.parentNode); var moptions = ''
 moptions += "sPopupParentId@" + id; moptions += ";sCacheParentId@PT_SIDE_TOP0;"; moptions += "bPIA@1;bPopup@1;bMask@0;bClose@1;bHeader@1;bCache@1;bHeader@0;bVertical@1;bMask@1;sTitle@Master List;bAutoClose@1;sStyle@ps_popup-menu ps_menutype-grid lpselbtn;"
 moptions += moptions0; var sObj = mDivObj.querySelector('.ps_scrollable'); if (sObj)
 addDivPopup(mDivObj, window, moptions, sObj.id); else
 addDivPopup(mDivObj, window, moptions); playDivPopup();}

function DoRowAction(nRow, gid)
{
 if (typeof nRow == "undefined") nRow = 0; var gObj = null; var bSA = false; if (typeof gid == "undefined") {
 gObj = document.querySelector('.ps_masterlist-group .ps_box-scrollarea'); if (gObj) bSA = true; if (!gObj)
 gObj = document.querySelector('.ps_masterlist-group .ps_box-grid-list'); if (!gObj)
 gObj = document.querySelector('.ps_masterlist-group .ps_box-grid-flex');   if (!gObj) return; var id = gObj.id; if (bSA)
 gid = id.substring(0, id.indexOf("$")); else {
 var pos = id.indexOf("div"); gid = id.substring(pos + 3, id.length); }
 }
 else
 gObj = document.getElementById(gid);  var rObj = document.getElementById(gid + "_row_" + nRow); if (!rObj)
 rObj = document.getElementById(gid + "_row$" + nRow); if (rObj)
 rObj.onclick();}

function SetSearchSelectedRow(id)
{
 fixUpBackButton();  var objBottom = document.getElementById('PT_SIDE_BOTTOM'); if (objBottom && objBottom.innerHTML != "")
 removeHide(document.getElementById('PT_SIDE_BOTTOM0')); if (isClass(document.querySelector('html'), "psc_mode-fscreen-search")) {
 removeClass(document.querySelector('html'), "psc_mode-fscreen-search"); addClass(document.querySelector('html'), "psc_mode-search"); var objTop = document.getElementById('PT_SIDE_TOP0'); if (objTop && isClass(objTop.firstChild, 'ps_header-group'))
 removeHide(objTop.firstChild);  if (objBottom && objBottom.innerHTML != "") {
 var objBottom0 = document.getElementById('PT_SIDE_BOTTOM0'); if (objBottom0 && isClass(objBottom0.firstChild, 'ps_header-group'))
 removeHide(objBottom0.firstChild); }
 else
 addHide(document.getElementById('PT_SIDE_BOTTOM0')); }
 var objBack = document.querySelector('.ps_button_backnav.psc_toolaction-backs'); if (objBack) {
 addHide(document.querySelector('.ps_button_backnav.psc_toolaction-back')); removeHide(objBack); }
 if (gcurSearchRowId == "" && typeof id == "undefined") return; var curObj = document.getElementById(gcurSearchRowId); if (curObj)
 removeSelected(curObj); if (typeof id != "undefined" && id) gcurSearchRowId = id; curObj = document.getElementById(gcurSearchRowId); if (!curObj) return; var objP = curObj.parentNode; removeSelected(objP.querySelector('.psc_selected')); addSelected(curObj);}

function SetCurSelectedRow() {

 if (gcurSearchRowId == "" && typeof id == "undefined") return; var curObj = document.getElementById(gcurSearchRowId); if (curObj)
 removeSelected(curObj); if (typeof id != "undefined" && id) gcurSearchRowId = id; curObj = document.getElementById(gcurSearchRowId); if (!curObj || isSelected(curObj)) return; addSelected(curObj);}

function SetSearchStatus(obj, form) {
 DoSearchCancel(); if (gcurSearchRowId != "") {
 var curObj = document.getElementById(gcurSearchRowId); if (curObj)
 removeSelected(curObj); }
 addSelected(obj); gcurSearchRowId = obj.id; SetSearchPrevNext();}

function SetSearchPrevNext(bGuided)
{
 if (typeof bGuided != "undefined" && bGuided)
 addClass(document.querySelector('html'), "psc_mode-guided"); var oWin = top.window; removeHide(oWin.document.querySelector('.ps_menuitem.ps_header-returnadd')); var prevObj = null; var nextObj = null; if (isMDGuided()) {
 prevObj = oWin.document.querySelector('.psc_image_only.ps_header-previous'); nextObj = oWin.document.querySelector('.psc_image_only.ps_header-next'); }
 else {
 prevObj = oWin.document.querySelector('.ps_menuitem.ps_header-previous'); nextObj = oWin.document.querySelector('.ps_menuitem.ps_header-next'); }
 
 if (oWin.gcurSearchRowId == "") return; var obj = oWin.document.getElementById(oWin.gcurSearchRowId); if (!obj)
 {
 addHide(prevObj); addHide(nextObj); return; }
 var objP = obj.parentNode; for (var j = 0; j < objP.children.length; j++) {
 if (objP.children[j] == obj) {
 oWin.gcurSearchRowNo = j; break; }
 } 
 if (objP.children.length > 1) {
 if (gcurSearchRowNo == 0)
 addHide(prevObj); if (gcurSearchRowNo > 0)
 removeHide(prevObj); if (gcurSearchRowNo == (objP.children.length - 1)) 
 addHide(nextObj);  else if (gcurSearchRowNo < (objP.children.length - 1))
 removeHide(nextObj); }
 else {
 if (objP.children.length = 1) {
  addHide(prevObj);  addHide(nextObj); }
 }
}

function SetPrevNext(pid) {
 SetSearchPrevNext();  if (typeof pid != "undefined") {
 var objP = document.getElementById(pid); if (objP && objP.children.length == 2 && objP.children[1].children.length > 0) {
 removeHide(document.querySelector('.ps_menuitem.ps_header-retlist')); }
 else
 addHide(document.querySelector('.ps_menuitem.ps_header-retlist')); }
}

function SetAGAction(sPrev, sNext, sSubmit, sExit) {
 var oWin = top.window; var prevObj = null; var nextObj = null; var submitObj = oWin.document.querySelector('.ps_process-submit.ps_header-submit'); var exitObj = oWin.document.getElementById("PT_WORK_PT_BUTTON_BACK"); if (exitObj && typeof sExit != "undefined" && sExit != null && sExit.length != 0) {
 exitObj.setAttribute("onclick", sExit); exitObj.setAttribute("href", 'javascript:void(0);'); }
 if (isMDGuided()) {
 prevObj = oWin.document.querySelector('.ps_box-button.ps_header-previous'); nextObj = oWin.document.querySelector('.ps_box-button.ps_header-next'); }
 else {
 prevObj = oWin.document.querySelector('.ps_menuitem.ps_header-previous'); nextObj = oWin.document.querySelector('.ps_menuitem.ps_header-next'); }
 if (prevObj && typeof sPrev != "undefined" && sPrev != null && sPrev.length != 0) {
 var aObj = prevObj.querySelector('A'); aObj.setAttribute("onclick", sPrev); aObj.setAttribute("href", 'javascript:void(0);'); removeHide(prevObj); }
 else
 addHide(prevObj); if (nextObj && typeof sNext != "undefined" && sNext != null && sNext.length != 0) {
 var aObj = nextObj.querySelector('A'); aObj.setAttribute("onclick", sNext); aObj.setAttribute("href", 'javascript:void(0);'); removeHide(nextObj); }
 else
 addHide(nextObj); if (submitObj && typeof sSubmit != "undefined" && sSubmit != null && sSubmit.length != 0) {
 var aObj = submitObj.querySelector('A'); aObj.setAttribute("onclick", sSubmit); aObj.setAttribute("href", 'javascript:void(0);'); removeHide(submitObj); }
 else
 addHide(submitObj);}


function DoPrevInList(obj) {
 var bChanged = checkFrameChanged(window); if (!bChanged)
 return DoPrevInList0(obj); var sScript = "DoPrevInList0(document.getElementById('" + obj.id + "'));"; psConfirmSW('', sScript.replace(/'/g, '\"'), window);}

function DoPrevInList0(obj) {
 if (gcurSearchRowId == "" || gcurSearchRowNo == 0) return; bSearchDialog_empty = true; var curObj = document.getElementById(gcurSearchRowId); var objP = curObj.parentNode; var prevObj = objP.children[gcurSearchRowNo - 1]; closeLastModal(); if (prevObj.onclick == null) {
 if (isClass(prevObj, "psc_close"))
 prevObj = prevObj.querySelector('A'); if (!prevObj || prevObj.onclick == null) {
 var objPrevRowActAll = prevObj.querySelectorAll('.psc_rowact'); if (objPrevRowActAll.length > 1) {
 for (var j = 0; j < objPrevRowActAll.length; j++) {
 if (objPrevRowActAll[j].onclick) {
 prevObj = objPrevRowActAll[j]; break; }
 }
 }
 }

 }
 var sScript = prevObj.getAttribute('href');  if (sScript == null && prevObj.onclick == null) {
 prevObj = prevObj.querySelector('.psc_trigger'); prevObj = prevObj.querySelector('a'); sScript = prevObj.getAttribute('href'); }
 var bScript = (isOnClickCancelBubble(prevObj) && sScript != null && sScript.indexOf("javascript:") != -1) ? true : false; if (bScript)
 eval(sScript); else 
 prevObj.onclick();}


function DoNextInList(obj) {
 var bChanged = checkFrameChanged(window); if (!bChanged)
 return DoNextInList0(obj); var sScript = "DoNextInList0(document.getElementById('" + obj.id + "'));"; psConfirmSW('', sScript.replace(/'/g, '\"'), window);}

function DoNextInList0(obj) {
 if (gcurSearchRowId == "") return; bSearchDialog_empty = true; var curObj = document.getElementById(gcurSearchRowId); var objP = curObj.parentNode; if (gcurSearchRowNo == (objP.children.length - 1)) return; if ((objP.children.length -gcurSearchRowNo) < 3) {
 var sTmpId = gcurSearchRowId.substring(0,gcurSearchRowId.indexOf("_row")); var sWrapId = winName+"srchdiv"+sTmpId.replace("$", "$grid$"); var objWrap = document.getElementById(sWrapId); if (objWrap) {
 objMore = GetLazyScrollObj(objWrap); if (objMore) {
 objMore.onclick(); doLazyScroll(objWrap); g_bDoNextInList = true; return; }
 }
 }

 var nextObj = objP.children[gcurSearchRowNo + 1]; closeLastModal(); if (nextObj.onclick == null) {
 if (isClass(nextObj, "psc_close"))
 nextObj = nextObj.querySelector('A'); if (!nextObj || nextObj.onclick == null) {
 var objNextRowActAll = nextObj.querySelectorAll('.psc_rowact'); if (objNextRowActAll.length > 1) {
 for (var j = 0; j < objNextRowActAll.length; j++) {
 if (objNextRowActAll[j].onclick) {
 nextObj = objNextRowActAll[j]; break; }
 }
 }
 }

 }
 var sScript = nextObj.getAttribute('href');  if (sScript == null && nextObj.onclick == null) {
 nextObj = nextObj.querySelector('.psc_trigger'); var objNextAll = nextObj.querySelectorAll('a'); for (var j = 0; j < objNextAll.length; j++) {
 if (objNextAll[j].onclick) {
 nextObj = objNextAll[j]; break; }
 }
 sScript = nextObj.getAttribute('href'); }
 var bScript = (isOnClickCancelBubble(nextObj) && sScript != null && sScript.indexOf("javascript:") != -1) ? true : false; if (bScript)
 eval(sScript); else
  nextObj.onclick();}

function SetSideTopTitle(sTitle)
{
 var objTitle = document.getElementById('PT_SIDE_TOP0$h'); if (!objTitle) return; removeHide(objTitle.parentNode); objTitle.innerHTML = sTitle;}

function SetSideBottomTitle(sTitle)
{ 
 var objTitle = document.getElementById('PT_SIDE_BOTTOM0$h'); objTitle.innerHTML = sTitle;}


function SetSide1TabButtonLabel(sTitle) 
{
 var objC = document.getElementById('PT_SIDE$tab$buttton'); if (!objC) return; setTitle(objC.querySelector('.ps-button-wrapper'), sTitle); var objS2 = objC.querySelector('.ps-button-wrapper .ps-text'); if (objS2)
 objS2.innerHTML = sTitle;}


function DoPin() {

} 


function initHelp() {
 var oWin = window; var oTFrame = top.window.document.querySelector(".ps_target-iframe"); if (oTFrame)
 oWin = oTFrame.contentWindow; var oHelpUrl = ((typeof oWin.document.forms[0] != "undefined") ? oWin.document.forms[0].ICPanelHelpUrl : null); var url = ""; if (oHelpUrl)
 url = oHelpUrl.value; var oHelp = top.window.document.querySelector('.ps_header-help'); if (oHelpUrl && url.length > 0)
 top.window.removeHide(oHelp); else
 top.window.addHide(oHelp);}


function DoHelp(helpTile) {
 var mOption = "bCrossDomain@1;sStyle@frame-pt_help;sTitle@" + helpTile + ";bClose@1;bFullScreen@1;"; var oWin = window; var oTFrame = document.querySelector(".ps_target-iframe"); if (oTFrame)
 oWin = oTFrame.contentWindow; var oHelpUrl = ((typeof oWin.document.forms[0] != "undefined") ? oWin.document.forms[0].ICPanelHelpUrl : null); var url = ""; if (oHelpUrl)
 url = oHelpUrl.value; var bIOSFullScreen = false; if (("standalone" in window.navigator) && window.navigator.standalone)
 bIOSFullScreen = true; if (url.length > 0){
 if (bIOSFullScreen)
 LaunchURL(null, url, 2, mOption); else
 window.open(url, 'help'); }
}

function DoHome(url) {
 
 var addressLoc = getPortalNodePart(location.href); if (addressLoc != null) {
 var temp = getPortalNodePart(url); if (temp != null)
 url = String(url).replace(temp, addressLoc);  }

 DoURLWarning(url);}

function DoLogout(url) {
 if (url.indexOf('cmd=logout') != -1) 
 url = stripNewWin(url);   initWorkers(); sessionStorage.clear(); var cstlogouturl = getCookie("cstlogouturl"); if (!cstlogouturl) {
 } else {
 url = decodeURIComponent(cstlogouturl) + "?service=" + encodeURIComponent (url); }

 DoURLWarning(url);}

function DoNavBar(url) {
PTNavBar.Toggle(url);};function SetPageTitle(sTitle)
{
var objPageTitle = document.getElementById("PT_PAGETITLE");if (!objPageTitle || sTitle.length == 0) return;var objLabel = objPageTitle.querySelector(".ps-text");if (objLabel)
 objLabel.innerHTML = sTitle;}

function doPopupRequest(form, name, formname) {
 isPopupRequest(form, name, formname);}

function isPopupRequest(form,name,formname) {
 var winName0 = (typeof form!= 'undefined' && form)?form.name:formname; var tObj = document.getElementById(winName0 + 'div' + name); if (isDraggable(tObj) || isDroppable(tObj)) return false; var addClass = null; var sname = null; if (name.indexOf("$srt") != -1) {
 var sTmp = name.substring(name.indexOf("$srt") + 1, name.length); var sname = name.substring(0, name.indexOf("$srt")) + "$SORT" + sTmp.substring(sTmp.indexOf("$"), sTmp.length); var sObj = document.getElementById(winName0 + 'div' + sname); if (sObj) {
 addOn(sObj); sObj = document.getElementById(sname); sObj.setAttribute("aria-pressed", "true"); }
 }
 else
 doCloseLocalModals(); var tmp = name.split("$"); var id1 = "", id2 = "", id3 = ""; var nLen = tmp.length; if (nLen >=3 && name.indexOf("$SORT") == -1)
 {
 id2 = 'div'; for (var i = 0; i < nLen-1; i++){
 id2 += tmp[i] + '$'; }
 id2 += 'divpop$' + tmp[nLen-1]; id1 = winName0 + id2; }

 else {
 id1 = winName0 + 'div' + name + '$divpop'; id2 = name + '$divpop'; id3 = id2 + '$scroll'; if (!sname && document.getElementById(id3))
 sname = id3; }
 var mDivObj = document.getElementById(id1); if (!mDivObj)
 mDivObj = document.getElementById(id2); if (!mDivObj) {
 var pObj = document.getElementById(winName0 + 'div' + name); if (pObj) {
 var gname = name.replace("$SORT", ""); var gObj = document.getElementById(winName0 + 'div' + gname); if (gObj)
 addClass = "ps_modal-gridsort ps_box-grid-flex " + getGridTabClass(gObj); mDivObj = pObj.querySelector(".ps_box-menu"); }
 }
 if (!mDivObj) { 
 if(name.indexOf("PTS_RELACTIONS") >-1)setLocalModal(true);  return false;  }
 if (isClass(mDivObj, 'psc_disabled')) {
 var sScript = "processing_" + winName0 + "(0, 3000);"; eval(sScript); return true; }

 var moptions = mDivObj.getAttribute('options'); var pos = moptions.indexOf("sRCParams@"); if (pos != -1 && mDivObj.innerHTML == "") {
 var url = sRCRequestURL + "?"; var params = moptions.substring(pos); var params = params.substring(params.indexOf("@") + 1, params.indexOf(";")); url += params; loadGrouplet(url, mDivObj.id); return true; }
 
 var nBulkActionExist = moptions.indexOf("bBulkAction"); if (nBulkActionExist == -1 && mDivObj.innerHTML != "") {
 displayPopup(mDivObj, sname, addClass, winName0, name); return true; }
 return false;}

function displayPopup(mDivObj, sname, addClass, winName0, name)
{ 
 if (isAnyDivPopup()) return; if (mDivObj.innerHTML != "") {
 var sScript = "if (document."+winName0+") processing_" + winName0 + "(0, 3000);"; eval(sScript); resetMenu(mDivObj); removeHide(mDivObj); var moptions = mDivObj.getAttribute('options'); if (addClass) moptions += "sStyle@" + addClass + ";"
 if (typeof name != "undefined") moptions += "sortid@" + name + ";"; setLocalModal(true); if (!sname)
 sname = mDivObj.firstChild.id; addDivPopup(mDivObj, window, moptions, sname); var objC = document.getElementById(sname); objC.style.height = ""; objC.style.width = ""; playDivPopup(); return true; }
}



function processRCMenuPopup(el)
{
 var winName0 = getPageFormName(el);  var sRCMenu = el.innerHTML; if (sRCMenu != "" && sRCMenu.indexOf("ps_menu") != -1)
 displayPopup(el, null, "", winName0); else
 {
 addMsg(sRCMenu); playMsg(); }
 
 if (sRCMenu == "" || sRCMenu.indexOf("ps_menu") == -1)
 {
 
 var sScript = "processing_"+winName0+"(0, 3000);"; eval(sScript); var pObj = el.parentNode; iOjbWrap = pObj.querySelector(".ps-icon-wrapper"); if (iOjbWrap)
 addClass(iOjbWrap, "psc_disabled"); else
 addClass(pObj, "psc_disabled"); addClass(el, "psc_disabled"); }
}


function uploadFile(obj)
{
 var formObject = new FormData();  var fileField = document.getElementById('#ICOrigFileName');  var file = fileField.files[0]; formObject.append("file", file); loader=new net2.ContentLoader(postUrl_win0,fileField.form,'#ICOrigFileName',null,null,null,null,null,null,null);}

function scrollCloudListL(divid,pixels)
{
 var scroller = document.getElementById(divid); scroller.scrollLeft -= pixels;}

function scrollCloudListR(divid,pixels)
{
 var scroller = document.getElementById(divid); scroller.scrollLeft += pixels;}


function FileAttachment(fList, dropArea, field, uploadBT, clistBT, numFiles) {

 var fileList = fList,
 fileField = field,
 dropZone = dropArea,
 okBT = document.getElementById("#ICOK"),
 wrapper = document.getElementById("PT_WRAPPER"); fileQueue = new Array(),
 cloudFileQueue = new Array(),
 preview = null; var numFilesAllowed = 1; var numCloudFilesSelected = 0; if (typeof numFiles != "undefined")
 numFilesAllowed = numFiles; var hrefUpload,
 hrefOK,
 hrefClear,
 formname; var userLanguageISO="en"; var isMobile = { Android: function() { return navigator.userAgent.match(/Android/i);},
 iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);}}; var icoMydevice ="",
 icoImage ="",
 icoPDF="",
 icoDoc="",
 icoPPT ="",
 icoXLS="",
 icoTXT="",
 icoUnknown ="",
 icoCloud ="";  this.init = function () {
 fileField.onchange = this.addFiles; dropZone.addEventListener("dragenter", this.stopProp, false); dropZone.addEventListener("dragleave", this.dragExit, false); dropZone.addEventListener("dragover", this.dragOver, false); dropZone.addEventListener("drop", this.showDroppedFiles, false); uploadBT.href = "javascript:void(0)"; formname = field.form.name; hrefUpload = this.uploadFiles; hrefClear = this.clearList; hrefOK = okBT.href; enableControl(uploadBT, false);  enableControl(clistBT, false, hrefClear); addClass(wrapper, "ps_popup-attach psc_attach-selecting"); if (numFilesAllowed > 1)
 addClass(wrapper, "psc_attach-multiple"); }

 this.loadDefaultIconUrls = function ( picoMydevice,picoImage,picoPDF,picoDoc,picoPPT,picoXLS,picoTXT,picoUnknown,picoCloud) {

 icoMydevice= picoMydevice; icoImage = picoImage; icoPDF = picoPDF; icoDoc = picoDoc; icoPPT = picoPPT; icoXLS = picoXLS; icoTXT = picoTXT; icoUnknown = picoUnknown; icoCloud = picoCloud; }

 this.displayProvider = function(provider_id,display_option){
 var provider = document.getElementById(provider_id); if(isMobile.Android()){
 if( display_option != "A" && display_option != "F")
 provider.setAttribute("style","display:none;"); }
 else if(isMobile.iOS()){
 if( display_option != "I" && display_option != "F")
 provider.setAttribute("style","display:none;"); }
 }

 this.addFiles = function () {
 addFileListItems(this.files); }

 this.showDroppedFiles = function (ev) {
 ev.stopPropagation(); ev.preventDefault(); var files = ev.dataTransfer.files; if (files.length > 1 && numFilesAllowed == 1)
 alert("AddAttachment only allows single file. For multiple files use MAddAttachment")
 else
 addFileListItems(files); }

 this.clearList = function (ev) {
 ev.preventDefault(); while (fileList.childNodes.length > 0) {
 fileList.removeChild(
 fileList.childNodes[fileList.childNodes.length - 1]
 ); }
 enableControl(uploadBT, false);  removeClass(wrapper, "psc_attach-selected"); addClass(wrapper, "psc_attach-selecting"); field.value = ""; field.removeAttribute("disabled"); fileQueue = []; cloudFileQueue = []; EnableAllFileAdd(); }

 this.dragOver = function (ev) {
 ev.stopPropagation(); ev.preventDefault(); this.style["backgroundColor"] = "#F0FCF0"; this.style["borderColor"] = "#3DD13F"; this.style["color"] = "#3DD13F"
 }

 this.dragExit = function (ev) {
 ev.stopPropagation(); ev.preventDefault(); dropZone.style["backgroundColor"] = "#FEFEFE"; dropZone.style["borderColor"] = "#CCC"; dropZone.style["color"] = "#CCC"
 }

 this.stopProp = function (ev) {
 ev.stopPropagation(); ev.preventDefault(); }

 this.uploadQueue = function (ev) {
 ev.preventDefault(); while (fileQueue.length > 0) {
 var item = fileQueue.pop(); var p = document.createElement("p"); p.className = "loader"; var pText = document.createTextNode("Uploading..."); p.appendChild(pText); item.li.appendChild(p); if (item.file.size < 10485760) {
 uploadFile(item.file, item.li); } else {
 p.textContent = "File to large"; p.style["color"] = "red"; }
 }
 }
 
 this.isFull = function()
 {
 if ( (fileQueue.length + cloudFileQueue.length ) < numFilesAllowed) {return Boolean(0);}
 return Boolean(1); }

 this.AddCloudFileListItems = function(fname, fsize, furl, fprovider ,fthumbnail, pauthtoken){

 var li = document.createElement("li"); if (typeof(fthumbnail ) !== 'undefined' ) {
 var thumb = new Image(); thumb.src = fthumbnail; thumb.className = "ps_attach-img"; thumb.alt = ""; li.appendChild(thumb); }

 else {
 var fileExt = fname.split('.').pop(); var fileExtUpperCase = fileExt.toUpperCase(); var iconName = ""; var word =["DOC", "DOCX", "DOTX"]; var powerpoint = ["PPT", "PPTX", "PPSX", "SLDX","PPTM","PSM","PPSM"]; var excel = ["XLS", "XLSX", "XLSM", "XLTX","CSV"]; var pdf = ["PDF"]; var image = ["JPG","JPEG","GIF","BMP","PNG","TTF"]; var textfiles = ["TXT","RTF","ODT"]; if ( word.indexOf(fileExtUpperCase) > -1 ) iconName = icoDoc; else if ( powerpoint.indexOf(fileExtUpperCase) > -1 ) iconName = icoPPT; else if ( excel.indexOf(fileExtUpperCase) > -1 ) iconName = icoXLS; else if ( pdf.indexOf(fileExtUpperCase) > -1 ) iconName = icoPDF; else if ( image.indexOf(fileExtUpperCase) > -1 ) iconName = icoImage; else if ( textfiles.indexOf(fileExtUpperCase) > -1 ) iconName = icoTXT; else iconName = icoUnknown; if( iconName != "") {
 var thumb = new Image(); thumb.src = iconName; thumb.className = "ps_attach-img"; thumb.alt = ""; li.appendChild(thumb); }
 }

 var h2 = document.createElement("h2"); var h2Text = document.createTextNode(fname); h2.appendChild(h2Text); li.appendChild(h2)
 var p = document.createElement("p"); var pText = document.createTextNode("File Size: " + fsize + " Bytes"); if(fsize != "") p.appendChild(pText);  li.appendChild(p); fileList.appendChild(li); cloudFileQueue.push({ name: fname, url: furl, li: li , authtoken: pauthtoken }); enableControl(uploadBT, true, hrefUpload); replaceClass(wrapper, "psc_attach-selecting", "psc_attach-selected"); enableControl(clistBT, true, hrefClear); if (numFilesAllowed <= fileList.childElementCount ) {
 DisableAllFileAdd(); }

 }


 var enableControl = function (fldObj, bEnable, hrefString) {
 var getType = {}; if (bEnable) {

 fldObj.style.display = "block"; if (getType.toString.call(hrefString) == '[object Function]') {
 fldObj.href = "javascript:cancelBubble(event);"; fldObj.onclick = hrefString; }
 else {
 fldObj.href = hrefString; fldObj.onclick = function () { cancelBubble(event); }; }


 }
 else {
 fldObj.style.display = "none"; fldObj.href = "javascript:void(0)"; fldObj.onclick = "#"; }
 }

 var addFileListItems = function (files) {
 if (numFilesAllowed == 1) {
 while (fileList.childNodes.length > 0) {
 fileList.removeChild(
 fileList.childNodes[fileList.childNodes.length - 1]
 ); }
 }
 for (var i = 0; i < files.length; i++) {
 var fr = new FileReader(); fr.file = files[i]; fr.onloadend = showFileInList; fr.readAsDataURL(files[i]); }
 if (numFilesAllowed <= fileList.childElementCount + files.length) {
 field.disabled = "disabled"; DisableAllFileAdd(); }
 enableControl(uploadBT, true, hrefUpload); replaceClass(wrapper, "psc_attach-selecting", "psc_attach-selected"); enableControl(clistBT, true, hrefClear); }

 var showFileInList = function (ev) {
 var file = ev.target.file; if (file) {
 var li = document.createElement("li"); if (file.type.search(/image\/.*/) != -1) {
 var thumb = new Image(); thumb.src = ev.target.result; thumb.className = "ps_attach-img"; thumb.alt = ""; li.appendChild(thumb); }
 else
 {
 var fileExt = file.name.split('.').pop(); var fileExtUpperCase = fileExt.toUpperCase(); var iconName = ""; var word =["DOC", "DOCX", "DOTX"]; var powerpoint = ["PPT", "PPTX", "PPSX", "SLDX","PPTM","PSM","PPSM"]; var excel = ["XLS", "XLSX", "XLSM", "XLTX","CSV"]; var pdf = ["PDF"]; var image = ["JPG","JPEG","GIF","BMP","PNG","TTF"]; var textfiles = ["TXT","RTF","ODT"]; if ( word.indexOf(fileExtUpperCase) > -1 ) iconName = icoDoc; else if ( powerpoint.indexOf(fileExtUpperCase) > -1 ) iconName = icoPPT; else if ( excel.indexOf(fileExtUpperCase) > -1 ) iconName = icoXLS; else if ( pdf.indexOf(fileExtUpperCase) > -1 ) iconName = icoPDF; else if ( image.indexOf(fileExtUpperCase) > -1 ) iconName = icoImage; else if ( textfiles.indexOf(fileExtUpperCase) > -1 ) iconName = icoTXT; else iconName = icoUnknown; if( iconName != "") {
 var thumb = new Image(); thumb.src = iconName; thumb.className = "ps_attach-img"; thumb.alt = ""; li.appendChild(thumb); }
 }

 var h2 = document.createElement("h2"); var h2Text = document.createTextNode(file.name); h2.appendChild(h2Text); li.appendChild(h2)
 var p = document.createElement("p"); var pText = document.createTextNode(
 "File Size: " + Math.round(file.size / 1024) + "KB"
 ); p.appendChild(pText); li.appendChild(p); fileList.appendChild(li); fileQueue.push({ file: file, li: li }); }
 }

 var showImagePreview = function (ev) {
 var div = document.createElement("div"); div.style["top"] = (ev.pageY + 10) + "px"; div.style["left"] = (ev.pageX + 10) + "px"; div.style["opacity"] = 0; div.className = "imagePreview"; var img = new Image(); img.src = ev.target.src; div.appendChild(img); document.body.appendChild(div); document.body.addEventListener("mousemove", movePreview, false); preview = div; fadePreviewIn(); }

 var movePreview = function (ev) {
 if (preview) {
 preview.style["top"] = (ev.pageY + 10) + "px"; preview.style["left"] = (ev.pageX + 10) + "px"; }
 }

 var removePreview = function (ev) {
 document.body.removeEventListener("mousemove", movePreview, false); document.body.removeChild(preview); }

 var fadePreviewIn = function () {
 if (preview) {
 var opacity = preview.style["opacity"]; for (var i = 10; i < 250; i = i + 10) {
 (function () {
 var level = i; setTimeout(function () {
 preview.style["opacity"] = opacity + level / 250; }, level); })(); }
 }
 }

 var DisableAllFileAdd = function()
 {
 var divToDisable = document.getElementById("FILEATTACH_SOURCELIST_DIV"); divToDisable.className += " ps_attach_prvdr-btn-disabled"; var listOfAnchorTags=divToDisable.getElementsByTagName("a"); for(i=0;i<listOfAnchorTags.length;i++)
 {
 listOfAnchorTags.item(i).setAttribute("tabindex","-1"); }
 }

 var EnableAllFileAdd = function ()
 {
 var divToEnable = document.getElementById("FILEATTACH_SOURCELIST_DIV"); divToEnable.className = "ps_attach-source-list"; divToEnable.removeAttribute("style"); var listOfAnchorTags=divToEnable.getElementsByTagName("a"); for(i=0;i<listOfAnchorTags.length;i++)
 {
 listOfAnchorTags.item(i).setAttribute("tabindex","0"); }
 }
 this.uploadFiles = function (ev) {
 ev.preventDefault(); var xhr = new XMLHttpRequest(),
 upload = xhr.upload; replaceClass(wrapper, "psc_attach-selected", "psc_attach-uploading"); field.disabled = "disabled"; DisableAllFileAdd(); upload.addEventListener("progress", function (ev) {
 if (ev.lengthComputable) {
 var loader = document.getElementById("divIndicater"); loader.style["width"] = (ev.loaded / ev.total) * 100 + "%"; }
 }, false); upload.addEventListener("load", function (ev) {
 
 replaceClass(wrapper, "psc_attach-uploading", "psc_attach-completed"); var div = document.getElementById("divIndicater"); div.style["width"] = "100%"; }, false); upload.addEventListener("error", function (ev) { console.log(ev); }, false);  var pUrl = eval("postUrl_" + fileField.form.name); xhr.open("POST", pUrl); if (typeof xhr.withCredentials != 'undefined')
 xhr.withCredentials = "true"; document.getElementById("prompts").value = numFiles; var hiddenObj = document.getElementById(fileField.form.name + 'divPSHIDDENFIELDS'); var formObject = new FormData(); formObject.append('ICAJAX', '1'); var params = "ICAJAX=1&"; for (var i = 0; i < hiddenObj.childNodes.length; i++) {
 var eObj = hiddenObj.childNodes[i]; if (eObj && typeof eObj.id != 'undefined' && eObj.id != ""){
 params += ptCommonObj2.getNV(eObj); formObject.append(eObj.id, encodeURIComponent(eObj.value)); }
 }
 if (ptConsole2.isActive() && !bPerf)
 ptConsole2.append((new Date()).valueOf() + " params:" + params.length + "\n" + params); for (var i = 0; i < numFiles; i++) {
 if (!i)
 fldid = fileField.id
 else
 fldid = fileField.id + i; if (typeof fileQueue[i] != 'undefined' && fileQueue[i] != null) {
 formObject.append(fldid, fileQueue[i].file); }
 else {
 var emptyFile = new Blob();  formObject.append(fldid, emptyFile); xhr.setRequestHeader("X-File-Name", ""); } 
 }

 for (var i = 0; i < cloudFileQueue.length ; i++) {
 var str = cloudFileQueue[i].name; var enc = ""; str = str.replace(/ |@|#|\$|%|&|\|+|;/g, "_"); for (j = 0; j < str.length; j++) {
 enc += str.charCodeAt(j)+ "_"; }

 xhr.setRequestHeader("X-CloudFile-Name", enc); xhr.setRequestHeader("X-CloudFile-URL", cloudFileQueue[i].url); if(typeof(cloudFileQueue[i].authtoken) !== 'undefined')
 xhr.setRequestHeader("X-Provider-Token", cloudFileQueue[i].authtoken); else
 xhr.setRequestHeader("X-Provider-Token","NR"); }
 xhr.setRequestHeader("X-CloudFile-Count", cloudFileQueue.length); fileQueue = []; cloudFileQueue = []; var fileTileAnchors = document.getElementsByName("fileStorage_provider_a"); for (var i = 0; i < fileTileAnchors.length; i++) {
 fileTileAnchors[i].onclick = "javascript:void(0)"; }


 xhr.setRequestHeader("Cache-Control", "no-cache"); xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); xhr.send(formObject); }
}

function loadAttachment(allowMultiple) {
 if (typeof FileReader == "undefined") alert("Sorry your browser does not support the File API"); fileAttachment = new FileAttachment(
 document.getElementById("fileList"),
 document.getElementById("divFILESLIST"),
 document.getElementById("#ICOrigFileName"),
 document.getElementById("#ICUpload"),
 document.getElementById("#ICClear"),
 allowMultiple
 ); fileAttachment.init();}

function AddFileToArray(Array, fileName, fileSize, fileURL, provider, thumbnailLink, authtoken)
{
 var elementIndex = Array.length; Array.push(new Object()); if (typeof(fileName) !== 'undefined') Array[elementIndex].name = fileName; if (typeof(fileSize) !== 'undefined') Array[elementIndex].size = fileSize; if (typeof(fileURL) !== 'undefined') Array[elementIndex].url = fileURL; if (typeof(provider) !== 'undefined') Array[elementIndex].provider = provider; if (typeof(thumbnailLink) !== 'undefined') Array[elementIndex].thumbnailLink = thumbnailLink; if (typeof(authtoken) !== 'undefined') Array[elementIndex].authtoken = authtoken;}



function CloudAttachFile(fileListArray) 
 {
 var elementIndex; for (elementIndex = 0; elementIndex < fileListArray.length; elementIndex++) { 
 var fileName; var fileSize; var fileURL; var provider; var icon; var thumbnailLink; var authtoken; if (typeof(fileListArray[elementIndex].name) === 'undefined' || typeof(fileListArray[elementIndex].url ) === 'undefined' ) {
 alert('Adding files failed , please verify provider configuration'); return; } 
 
 if (fileAttachment.isFull() ) {
 alert('Adding files skipped after reached limit, try clearing list for adding more '); return; } 
 
 fileName = fileListArray[elementIndex].name; fileSize = fileListArray[elementIndex].size; fileURL = fileListArray[elementIndex].url; provider = fileListArray[elementIndex].provider; icon = fileListArray[elementIndex].icon; thumbnailLink = fileListArray[elementIndex].thumbnailLink ; authtoken = fileListArray[elementIndex].authtoken; fileAttachment.AddCloudFileListItems(fileName,fileSize,fileURL,provider,thumbnailLink,authtoken); }
 }

function setUserLanguageISO(lngISO)
{
 fileAttachment.userLanguageISO = lngISO;}

function getUserLanguageISO()
{
 return fileAttachment.userLanguageISO;}

function isJSLoaded(jsSrc)
{
 var myStringArray = document.getElementsByTagName("script"); var arrayLength = myStringArray.length; for (var i = 0; i < arrayLength; i++)
 {
 if(typeof(myStringArray[i].src) !== 'undefined')
 {
 if(myStringArray[i].src==jsSrc) return "YES"; }
 }
 return "NO";}
if (!(typeof removeClass == 'function')) {
 removeClass = function (obj, sClass0) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; sClass = sClass.replace(" " + sClass0, ""); sClass = sClass.replace(sClass0, ""); obj.setAttribute("class", sClass); }
}

if (!(typeof addClass == 'function')) {
 addClass = function (obj, sClass0) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" "+sClass0) != -1) return; obj.setAttribute("class", sClass + " "+sClass0); }
}

if (!(typeof toggleClass == 'function')) {
 toggleClass = function (obj, sClass0) {
 if (!obj) return; var sClass = (obj.getAttribute("class")) ? obj.getAttribute("class") : ""; if (sClass.indexOf(" "+sClass0) != -1)
 removeClass(obj, sClass0); else
 addClass(obj, sClass0); }
}

if (!(typeof DoNavBar == 'function')) {
 DoNavBar = function (url) {
 PTNavBar.Toggle(url); }
}

var PTNavBar = {
 Url: "",
 CurTileEl: null,
 OpenState: "",
 StartPersState: "",
 IsOpen: false,
 IsLoaded: false,
 IframeDoc: null,
 IsSFF: false,
 IsAccessible: false,
 Delay: 1000,
 bDirty: false,
 unmruCref: "false", 
 hasMRU : false, 
 nMaxMRU : 5, 
 ptBaseURI : "",
 Load: function() {
 var psNBMask = document.createElement("div"); psNBMask.id = "psNavBarMask"; psNBMask.setAttribute('onclick', 'javascript:DoNavBar();'); var navBarEl = document.createElement("div"); navBarEl.id = "psNavBar"; navBarEl.setAttribute("class", "psNavBar PTNavBarModal"); var nBifel = document.createElement("iframe"); nBifel.id = "psNavBarIFrame"; nBifel.name = "psNavBarIFrame"; nBifel.onload = PTNavBar.FirstLoad; nBifel.title = "\u5bfc\u822a\u680f"; nBifel.frameBorder = "0"; nBifel.setAttribute("onmousewheel", "");  if (typeof(sessionStorage) != "undefined") {
 var CachedUrl = sessionStorage.getItem("NavBarUrl"); if (CachedUrl != null)
 PTNavBar.Url = CachedUrl; }

 if (typeof(bFMode) == "undefined")
 bFMode = false; nBifel.src = encodeURI(PTNavBar.Url); navBarEl.appendChild(nBifel); var el = document.querySelector('body'); el.appendChild(psNBMask); el.appendChild(navBarEl); var sScript = "processing_empty"; if (eval ("typeof " + sScript + " !== 'function'")) {
 if (document.forms.length > 0)
 sScript = "processing_" + document.forms[0].name; if (bFMode == false) {
 if (typeof ptLoadingStatus_empty === 'function')
 sScript = "ptLoadingStatus_empty"; else {
 var tcFrame = "window.frames['TargetContent']"; if (window.frames['TargetContent'])
 if (window.frames['TargetContent'].document.forms.length > 0)
 sScript = tcFrame + ".processing_" + eval(tcFrame + ".document.forms[0].name"); }
 }
 }
 if (eval ("typeof " + sScript + " === 'function'")) {
 eval(sScript + "(1,1000);"); var rcTimeOutId = setInterval( function() {
 if (PTNavBar.IsLoaded == true) {
 eval(sScript + "(0,1000);"); clearInterval(rcTimeOutId); }
 }, 100); }
 PTNavBar.bDirty = false; PTNavBar.ptBaseURI = getptBaseURI(); },
 Refresh: function() {
 var el = document.querySelector('.PTNavBarModal'); if (el != null) {
 var elIF = el.querySelector('#psNavBarIFrame'); elIF.src = PTNavBar.IframeDoc.document.location.href; if (PTNavBar.IframeDoc.document.getElementById("PTNB$PTNUI_NB_MRU"))
 PTNavBar.hasMRU = true;  }
 PTNavBar.bDirty = false; },
 FirstLoad: function() {
 var el = document.querySelector('.PTNavBarModal'); removeClass(el, PTNavBar.OpenState); addClass(el, PTNavBar.OpenState); PTNavBar.Delay = 0; var nbFrame = window.frames['psNavBarIFrame']; if (typeof nbFrame != 'undefined') {
 PTNavBar.IframeDoc = nbFrame; nbFrame.PTNavBar.SetHeaderLabel(''); }
 if (nbFrame.document.getElementById("PTNB$PTNUI_NB_MRU")) {
 PTNavBar.hasMRU = true;  PTNavBar.synchHNAVMRU(); }

 try {
 if (typeof(sessionStorage) != "undefined")
 sessionStorage.setItem("NavBarUrl", nbFrame.location.href); } catch(ex) {
 }
 },
 Toggle: function(navBarUrl) {
 if (typeof(navBarUrl) != 'undefined') {
 PTNavBar.Url = navBarUrl; }

 var el = document.querySelector('.PTNavBarModal'); if (el == null) {
 this.Load(); el = document.querySelector('.PTNavBarModal'); }else if (PTNavBar.bDirty) {
 PTNavBar.Refresh(); }else {
 
 PTNavBar.synchHNAVMRU(); }
 this.IsOpen = !this.IsOpen; this.IsSFF = (document.querySelector('html').getAttribute('class').indexOf('psc_form-small') >= 0); this.IsAccessible = (getCookieValue('ps_theme').indexOf('accessibility:A') != -1); if (this.OpenState == '') {
 if (this.CurTileEl == null || this.IsSFF)
 this.OpenState = 'slidein'; else {
 this.OpenState = 'slidein_full'; }
 }

 var elBody = document.querySelector('body'); var nbMask = document.querySelector('#psNavBarMask'); var nbIF = document.querySelector('#psNavBarIFrame'); if (this.IsOpen) {
 nbMask.style.cssText = "display:block"; elBody.style.cssText = "position: fixed; width: 100%; height: 100%; overflow: hidden; -webkit-backface-visibility: hidden; -webkit-transform: translateZ(0);"; if (this.IsAccessible) {
 if (typeof hidePtWrapper == "function") hidePtWrapper(); addClass(nbMask, 'acs_mode'); addClass(el, 'acs_mode'); }
 this.SetFocus(); nbIF.tabIndex = 0; elBody.tabIndex = -1; }
 else {
 nbMask.style.cssText = "display:none"; elBody.style.cssText = ""; if (this.IsAccessible) {
 if (typeof unhidePtWrapper == "function") unhidePtWrapper(); removeClass(nbMask, 'acs_mode'); removeClass(el, 'acs_mode'); }
 nbIF.tabIndex = -1; elBody.tabIndex = -1; this.SetBlur(); }

 if (this.Delay == 0)
 toggleClass(el, this.OpenState);  if (this.IframeDoc != null && this.IsOpen && this.OpenState == 'slidein') {
 this.IframeDoc.PTNavBar.SelectTile(this.IframeDoc.PTNavBar.CurTileEl); }

 
 if (typeof(doCloseLocalModals) == 'function') {
 doCloseLocalModals(); if (this.IframeDoc != null && typeof(this.IframeDoc.doCloseLocalModals) == 'function')
 this.IframeDoc.doCloseLocalModals(); }
 },
 OpenInContentArea: function(url, cacheId) {
 var cacheHTML = null; if (typeof(cacheId) == "string" && typeof(sessionStorage) != "undefined") {
 var tCacheId = "psNavBarCont_" + cacheId; cacheHTML = sessionStorage.getItem(tCacheId); }
 var nbContEl = document.querySelector('.nbcontarea'); if (cacheHTML == null) {
 LaunchURL(null, url,3,'bGrouplet@1;','NB_CONTENT_TGT'); } else {
 if (url.indexOf("PTNUI_MENU_COMP") > -1)
 PTNavBarNavigator.SetLastNavFolder(cacheId); nbContEl.innerHTML = cacheHTML; }
 },
 OpenInWindow: function(url, crefID) {
 if ((typeof crefID != "undefined") && window.top.PTNavBar.hasMRU){
 PTNavBar.saveMRU(crefID);  }
 LaunchURL(null, url, 4); },
 saveMRU: function (crefID) {
 if (top.PTNavBar.ptBaseURI === "")
 top.PTNavBar.ptBaseURI = getptBaseURI(); var ajaxUrl = top.PTNavBar.ptBaseURI + "s/WEBLIB_PT_NAV.ISCRIPT1.FieldFormula.IScript_PT_NAV_MRU_Update"; var isUnav = "false";  var sVal = "", s = ptUtil.id("PTNUI_NB_WRK_PTNUI_SSID"); if (s) { sVal = "&ptnbsid=" + encodeURIComponent(s.value); }

 if (top.PTNavBar.unmruCref == "false"){
 var iFrmObj = top.document.getElementById("ptifrmatfdescr"); if (iFrmObj) {
 var isUnav = iFrmObj.attributes['uninav'].value; if(isUnav == "true"){
 var UniNavTgtMRUval = iFrmObj.attributes['uninavtargetfav'].value; var Unavcref = iFrmObj.attributes['uninavcrefname'].value; var Unavcreflbl = iFrmObj.attributes['uninavcreflbl'].value; var UnavcrefLnode = iFrmObj.attributes['lnode'].value; var UnavcrefRnode = iFrmObj.attributes['rnode'].value; var NodeUpdate = String(ajaxUrl).indexOf('\/'+UnavcrefRnode+'\/'); if(NodeUpdate != -1)
 ajaxUrl = String(ajaxUrl).replace('\/'+UnavcrefRnode+'\/','\/'+UnavcrefLnode+'\/');  top.PTNavBar.unmruCref = Unavcref + "$$$" + Unavcreflbl;  top.PTNavBar.unmruCrefhref = UniNavTgtMRUval; } 
 } 
 } 

 var params = "mrulist=" + encodeURIComponent(crefID) + "&mruAction=ptmruinst&maxMRU="+ top.PTNavBar.nMaxMRU + sVal; if (isUnav == "true") 
 params = params + "&unmruCref=" + top.PTNavBar.unmruCref + "&unmruCrefhref=" + encodeURIComponent(top.PTNavBar.unmruCrefhref);  var mruLoader = new net2.ContentLoader(ajaxUrl,null,null,"post",function(){},
 null,params,"application/x-www-form-urlencoded",1,0,null,false); mruLoader = null; },

 synchHNAVMRU: function() { 
 if (!PTNavBar.hasMRU)
 return;   if ((typeof top.pthNav != "undefined") && top.pthNav.mruRoot && !top.pthNav.mru.dbSaved && top.pthNav.mruRoot.childNodes.length > 0) { 
 top.pthNav.mru.save();  } 
 },
 
 SetContentAreaCache: function(cacheId) {
 try {
 if (typeof(sessionStorage) != "undefined") {
 cacheId = "psNavBarCont_" + cacheId; var nbContEl = document.querySelector('.nbcontarea'); sessionStorage.setItem(cacheId, nbContEl.innerHTML); }
 } catch(ex) {
 }
 },
 SetHeaderLabel: function(lbl) {
 var nbHdrLabelEl = document.querySelector('.nbhdr .nbhdr_lbl > span'); if (nbHdrLabelEl) {
 var nbHdrLabel = nbHdrLabelEl.innerHTML; var needle = ": "; var lblArr = nbHdrLabel.split(needle); if (lbl == "")
 nbHdrLabel = lblArr[0]; else
 nbHdrLabel = lblArr[0] + needle + lbl; nbHdrLabelEl.innerHTML = nbHdrLabel; if (nbHdrLabel == lblArr[0]) {
 if (top.PTNavBar.IsAccessible && top.PTNavBar.OpenState == 'slidein') {
 addClass(nbHdrLabelEl, 'psc_hidden-readable'); } else {
 removeClass(nbHdrLabelEl, 'psc_hidden-readable'); }
 } else {
 removeClass(nbHdrLabelEl, 'psc_hidden-readable'); }
 }
 },
 SelectTile: function(el) {
 if (PTNavBar.CurTileEl != null) {
 toggleClass(PTNavBar.CurTileEl, 'sel'); PTNavBar.CurTileEl.setAttribute("aria-selected", "false"); }

 window.top.PTNavBar.IframeDoc = window.self; if (PTNavBar.CurTileEl == el || el == null) {
 PTNavBar.CurTileEl = null; PTNavBar.HideContentArea(); PTNavBar.SetHeaderLabel(''); } else {
 var label = el.querySelector('.ps_groupleth .ps-label'); if (label) {
 PTNavBar.SetHeaderLabel(label.innerHTML); }
 this.CurTileEl = el; toggleClass(PTNavBar.CurTileEl, 'sel'); PTNavBar.CurTileEl.setAttribute("aria-selected", "true"); PTNavBar.ShowContentArea(); }; },
 ShowContentArea: function() {
 if (top.PTNavBar.OpenState != 'slidein_full') {
 var el = top.document.querySelector('.PTNavBarModal'); if (window.top != window.self) {
 window.top.PTNavBar.OpenState = 'slidein_full'; PTNavBar.OpenState = 'slidein_full'; var hdr_el = document.querySelector('.ptnavbar'); removeClass(hdr_el, 'nbmin'); }; replaceClass(el, 'slidein', this.OpenState); }; },
 HideContentArea: function() {
 if (top.PTNavBar.OpenState != 'slidein_full') {
 
 return; }; if (window.top != window.self) {
 window.top.PTNavBar.OpenState = 'slidein'; PTNavBar.OpenState = 'slidein'; var hdr_el = document.querySelector('.ptnavbar'); addClass(hdr_el, 'nbmin'); }; var el = top.document.querySelector('.PTNavBarModal'); replaceClass(el, 'slidein_full', this.OpenState); },
 StartPersonalization: function() {
 window.top.PTNavBar.StartPersState = PTNavBar.OpenState; PTNavBar.ShowContentArea(); setPSTouchHandlerDraggbles(); },
 StopPersonalization: function() {
 if (window.top.PTNavBar.StartPersState == 'slidein')
 PTNavBar.HideContentArea(); window.top.PTNavBar.StartPersState = ''; window.top.PTNavBar.IsLoaded = true; },
 InitDefaultTile: function() {
 var hdr_el = document.querySelector('.ptnavbar'); if (window.top.PTNavBar.OpenState == 'slidein_full')
 removeClass(hdr_el, 'nbmin'); else
 addClass(hdr_el, 'nbmin'); this.HideContentArea(); },
 SetBlur: function() {
 var el = top.document.querySelector('#PT_NAVBAR'); if (el == null)
 el = top.document.querySelector('#pthdr2navbar'); if (el != null)
 el.focus(); },
 SetFocus: function() {
 var fInterval = setInterval(function() {
 try {
 var fEl = window.frames['psNavBarIFrame'].document.querySelector('#PTNUI_NB_HDRWRK_PTNUI_NB_ACTION'); if (fEl) {
 clearInterval(fInterval); fEl.focus(); }
 } catch(e) {
 }; }, 200); },
 kbHandler: function(e) {
 var kbSetFocus = function(el, e) {
 if (el) {
 el.focus(); e.preventDefault(); e.stopPropagation(); }
 }; var e = window.event || e;  var fEl = document.activeElement; if (typeof fEl == "undefined" || fEl == null) return; var nbContEl = document.querySelector(".nbcacont"); if (nbContEl == null) return; var fElClass = fEl.getAttribute("class"); if (typeof fElClass == "undefined" || fElClass == null) return; var isTile = (fElClass.indexOf("nuinb") > -1); var inCont = (nbContEl.compareDocumentPosition(fEl) & Node.DOCUMENT_POSITION_CONTAINED_BY); var isListItem = false; var isFolder = false; var menuRowEl; if (inCont > 0) {
 menuRowEl = fEl.parentElement.parentElement; isListItem = (menuRowEl.getAttribute("class").indexOf("lplistitem") > -1); isFolder = (menuRowEl.getAttribute("class").indexOf("fldr") > -1); }

 switch (e.keyCode) {
 case 9: 
 break; case 27: 
 top.PTNavBar.Toggle(); PTNavBar.SetBlur(); e.preventDefault(); break; case 35: 
 var nextEl = null; if (isListItem) {
 var nextRowEl = fEl.parentElement.parentElement.parentElement.parentElement.querySelector("li:last-child"); if (nextRowEl) {
 nextEl = nextRowEl.querySelector(".lplistitem a"); }
 }
 if (isTile) {
 nextEl = document.querySelector(".nbtilegrid .ps_grid-body>li:last-child .nuinb"); }
 if (nextEl) {
 nextEl.focus(); e.preventDefault(); e.stopPropagation(); }
 break; case 36: 
 var nextEl = null; if (isListItem) {
 var nextRowEl = fEl.parentElement.parentElement.parentElement.parentElement.querySelector("li:first-child"); if (nextRowEl) {
 nextEl = nextRowEl.querySelector(".lplistitem a"); }
 }
 if (isTile) {
 nextEl = document.querySelector(".nbtilegrid .ps_grid-body>li:first-child .nuinb"); }
 kbSetFocus(nextEl,e); break; case 37: 
 var nextEl = document.querySelector(".ptnui_menu_back a"); if (nextEl)
 nextEl.click(); if (inCont) {
 nextEl = document.querySelector(".nbtilegrid .nuinb.sel"); kbSetFocus(nextEl,e); }
 break; case 38: 
 var nextEl = null; if (isTile) {
 var nextRowEl = fEl.parentElement.previousElementSibling; if (nextRowEl) {
 nextEl = nextRowEl.querySelector(".nuinb"); }
 } else {
 if (isListItem) {
 var nextRowEl = menuRowEl.parentElement.previousElementSibling; if (nextRowEl) {
 nextEl = nextRowEl.querySelector(".lplistitem a"); }
 }
 }
 kbSetFocus(nextEl,e); break; case 39: 
 if (isFolder) fEl.click(); if (isTile) {
 if (hasClass(fEl, "sel"))
 PTNavBar.SetContentFocus(); }
 break; case 40: 
 var nextEl = null; if (isTile) {
 var nextRowEl = fEl.parentElement.nextElementSibling; if (nextRowEl) {
 nextEl = nextRowEl.querySelector(".nuinb"); }
 } else {
 if (isListItem) {
 var nextRowEl = menuRowEl.parentElement.nextElementSibling; if (nextRowEl) {
 nextEl = nextRowEl.querySelector(".lplistitem a"); }
 }
 }
 kbSetFocus(nextEl,e); break; default:
 break; }
 },
 SetContentFocus : function() {
 var fEl = document.querySelector("a[sfocus]"); if (fEl)
 fEl.focus(); }
};var PTNavBarNavigator = {
 SetLastNavFolder : function(fldr) {
 try {
 if (typeof(sessionStorage) != "undefined") {
 sessionStorage.setItem("psNavBar_lastFolder", fldr); }
 } catch(ex) {
 }
 }
};
var PT_DND = {
 holdDelay: 500,
 t: null,
 setDrag: function (elem, isDrag) {
 elem.setAttribute("draggable", isDrag ? "true" : "false"); },
 startHold: function (elem) {
 
 PT_DND.t = setTimeout(function () { PT_DND.setDrag(elem, true); addClass(elem, "ps-drag-start"); }, PT_DND.holdDelay); },
 endHold: function (elem) {
 PT_DND.setDrag(elem, false);  removeClass(elem, "ps-drag-start"); clearTimeout(PT_DND.t); }
};function SetDNDGestures() {
var sAreaRows = document.querySelectorAll(".ps_box-scrollarea-row");for (var i = 0; i < sAreaRows.length; i++){
 sAreaRows[i].setAttribute("gestures", "true"); }
}

function PT_TouchDND(doc) {
 var touchStarted = false, 
 dndStarted = false,
 swipeThreshold = 80,
 tapThreshold = 150,
 dndThreshold = 400,
 tapnholdThreshold = 1000,
 startTime = 0, endTime = 0; precision = 60 / 2, 
 tapNum = 0,
 tapStarted = false,
 currX = 0, currY = 0, cachedX = 0, cachedY = 0, dndTimer = 0, tapTimer = 0,
 ptdragTimer = null, dPercision = Math.round(screen.height / 10), ptdragTimer2 = null; sendEvent = function (elem, eventName, originalEvent, data) {
 var customEvent = doc.createEvent('Event'); data = data || {}; data.x = currX; data.y = currY; data.distance = data.distance; customEvent.originalEvent = originalEvent; customEvent.initEvent(eventName, true, true); elem.dispatchEvent(customEvent); },

 this.doTouchStart = function (e) {
 var target = getEventTarget(e); var o = getHTMLObject(target, "draggable"); var oGesture = getHTMLObject(target, "gestures"); if (target.tagName == "INPUT" || target.tagName == "A" || target.tagName == "BUTTON" 
 || target.tagName == "SELECT" || target.tagName == "TEXTAREA" || (!o && !oGesture))
 return true; cachedX = currX = e.targetTouches[0].pageX; cachedY = currY = e.targetTouches[0].pageY; startTime = +new Date(); touchStarted = true; tapNum++;  clearTimeout(dndTimer); dndStarted = false; dndTimer = setTimeout(function () {
 if (cachedX >= currX - precision &&
 cachedX <= currX + precision &&
 cachedY >= currY - precision &&
 cachedY <= currY + precision) {
 if (!touchStarted) {
 if (tapNum > 1)
 sendEvent(e.target, 'doubletap', e); if ((endTime - startTime) < dndThreshold ) {
 sendEvent(e.target, 'tap', e); }
 }
 else {
 dndStarted = true; if (o) {
 var oPos = GetObjPos(o); var layer = getLayerXY(e, o, oGesture); o.setAttribute("offsetX", oPos.x + layer.x); o.setAttribute("offsetY", oPos.y + layer.y); o.style.zIndex = 100; addClass(o, "ps-drag-start"); }
 }
 }
 tapNum = 0; }, dndThreshold); },

 this.doTouchMove = function (e) {
 var target = getEventTarget(e); var o = getHTMLObject(target, "draggable"); var offsetHeight = 0
 var oGesture = getHTMLObject(target, "gestures"); if (target.tagName == "INPUT" || target.tagName == "A" || target.tagName == "BUTTON" 
 || target.tagName == "SELECT" || target.tagName == "TEXTAREA" || (!o && !oGesture)) 
 return true; currX = e.targetTouches[0].pageX; currY = e.targetTouches[0].pageY; if (Math.abs(currX - cachedX) > Math.abs(currY - cachedY))
 e.preventDefault();  if (dndStarted && o) {
 e.preventDefault(); orgX = e.pageX; orgY = e.pageY; if ((oGesture = getHTMLObject(e.target, "gestures")) == null)
 return false; if (ptdragTimer == null &&
 (currY >= oGesture.clientHeight - Math.round(oGesture.clientHeight / 10) ||
 (currY <= (document.body.clientHeight - oGesture.clientHeight)))) {
 ptdragTimer = setTimeout(function () {
 if (orgX >= currX - dPercision &&
 orgX <= currX + dPercision &&
 orgY >= currY - dPercision &&
 orgY <= currY + dPercision) {
 if (currY >= oGesture.clientHeight - Math.round(oGesture.clientHeight / 10)) {
 clearTimeout(ptdragTimer); ptdragTimer = null; oGesture.scrollTop = oGesture.scrollTop + Math.round(oGesture.clientHeight / 10); oGesture.scrollTop = oGesture.scrollTop > scrollHeight ? scrollHeight : oGesture.scrollTop; }
 else if (currY <= (document.body.clientHeight - oGesture.clientHeight)) {
 clearTimeout(ptdragTimer); ptdragTimer = null; oGesture.scrollTop = oGesture.scrollTop - Math.round(oGesture.clientHeight / 10); }
 }
 }, 100); }
 var curX = e.targetTouches[0].pageX - parseInt(o.getAttribute("offsetX")); var curY = e.targetTouches[0].pageY - parseInt(o.getAttribute("offsetY")) + oGesture.scrollTop;  o.style.top = curY + 'px'; o.style.left = curX + 'px'; o.style.right = (-1 * curX) + 'px'; o.style.bottom = (-1 * curY) + 'px'; o.style.zIndex = 100; replaceClass(o, "ps-drag-start", "ps-drag"); }
 },

 this.doTouchEnd = function (e) {
 var target = getEventTarget(e); var oGesture = getHTMLObject(target, "gestures"); var o = getHTMLObject(target, "draggable"); if (target.tagName == "INPUT" || target.tagName == "A" || target.tagName == "BUTTON" 
 || target.tagName == "SELECT" || target.tagName == "TEXTAREA" || (!o && !oGesture))
 return true; var formname; endTime = +new Date(); deltaY = cachedY - currY,
 deltaX = cachedX - currX; if (deltaX < precision && deltaY < precision) {
 if ((endTime - startTime) >= tapnholdThreshold) {
 clearTimeout(dndTimer); sendEvent(e.target, 'tapandhold', e); }
 }
 touchStarted = false; clearTimeout(ptdragTimer); ptdragTimer = null; if (dndStarted) {
 dndStarted = false; if (o) {
 removeClass(o, "ps-drag"); o.style.zIndex = -1; if (e.preventDefault) e.preventDefault();  srcValue = o.id; var dndSrc = document.getElementById("ICDNDSrc"); var ndiv = srcValue.indexOf("div"); if (ndiv != -1) {
 formname = srcValue.substring(0, ndiv); srcValue = srcValue.substring(ndiv + 3); }
 dndSrc.value = srcValue; try {
 var targetElem = document.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY); while (targetElem.getAttribute("droppable") != "true") {
 targetElem = targetElem.parentElement; }
 }
 catch (event) {
 targetElem = o; }
 var aField = targetElem.id.substring(targetElem.id.indexOf("div") + 3); var sEvent = "submitAction_" + formname + "(" + formname + " ,'" + aField + "')"; eval(sEvent); }
 }
 else {
 var eventsArr = []; if (deltaX <= -swipeThreshold)
 eventsArr.push('swipeleft'); if (deltaX >= swipeThreshold)
 eventsArr.push('swiperight'); if (deltaY <= -swipeThreshold)
 eventsArr.push('swipedown'); if (deltaY >= swipeThreshold)
 eventsArr.push('swipeup'); if (eventsArr.length) {
 for (var i = 0; i < eventsArr.length; i++) {
 var eventName = eventsArr[i]; sendEvent(e.target, eventName, e, {
 distance: {
 x: Math.abs(deltaX),
 y: Math.abs(deltaY)
 }
 }); }
 }
 }

 return false; },

 this.doTouchCancel = function (e) {
 touchStarted = false; dndStarted = false; clearTimeout(ptdragTimer); ptdragTimer = null; }
};function doSwipeDown(e) {}
function doSwipeUp(e) {}
function doSwipeLeft(e) {
 var obj = e.target; while (obj != document.body && obj.onclick == null && obj.getAttribute("href") == null) {
 if (obj.tagName == "LABEL") {
 obj = document.getElementById(obj.getAttribute("for")); if (['radio', 'checkbox'].indexOf(obj.getAttribute('type')) != -1) {
 obj.checked = !obj.checked; if (obj.onclick != null)
 obj.onclick(); if (obj.parentElement.onclick != null)
 obj.parentElement.onclick(); }
 else
 obj.focus(); return false; }
 obj = obj.parentElement; }
 if (['radio', 'checkbox'].indexOf(obj.getAttribute('type')) != -1)
 obj.checked = !obj.checked;}

function doSwipeRight(e) {
 var obj = e.target; while (obj != document.body && obj.onclick == null && obj.getAttribute("href") == null) {
 if (obj.tagName == "LABEL") {
 obj = document.getElementById(obj.getAttribute("for")); if (['radio', 'checkbox'].indexOf(obj.getAttribute('type')) != -1) {
 obj.checked = !obj.checked; if (obj.onclick != null)
 obj.onclick(); if (obj.parentElement.onclick != null)
 obj.parentElement.onclick(); }
 else
 obj.focus(); return false; }
 obj = obj.parentElement; }
 if (['radio', 'checkbox'].indexOf(obj.getAttribute('type')) != -1)
 obj.checked = !obj.checked;}

function doTap(e) {
 var obj = e.target; while (obj != document.body && obj.onclick == null && obj.getAttribute("href") == null) {
 if (obj.tagName == "LABEL") {
 obj = document.getElementById(obj.getAttribute("for")); if (['radio', 'checkbox'].indexOf(obj.getAttribute('type')) != -1) {
 obj.checked = !obj.checked; if (obj.onclick != null) 
 obj.onclick(); if (obj.parentElement.onclick != null)
 obj.parentElement.onclick(); }
 else
 obj.focus(); return false; }
 obj = obj.parentElement; }
 if (['radio', 'checkbox'].indexOf(obj.getAttribute('type')) != -1)
 obj.checked = !obj.checked; if (obj != 'undefined' && obj != null && obj.onclick != null)
 obj.onclick(); if (obj && obj.getAttribute("href") != null)
 eval(obj.getAttribute("href")); return false;}
function doTapAndHold(e) { 
 ptConsole2.active();  return false; }

function doDoubleTap(e) { }
function isTouchDisbled() {
 var dnd_els = document.querySelectorAll('[draggable=true]'); if (dnd_els.length == 0) return true; return false;}

 var touchDND = new PT_TouchDND(document);function setPSTouchHandler(obj) {
 if (typeof obj == "undefined" || !obj) return; obj.ontouchstart = touchDND.doTouchStart; obj.ontouchmove = touchDND.doTouchMove; obj.ontouchend = touchDND.doTouchEnd; obj.ontouchcancel = touchDND.doTouchCancel; obj.addEventListener("tap", doTap, false);  obj.addEventListener("swipedown", doSwipeDown, false); obj.addEventListener("swipeup", doSwipeUp, false); obj.addEventListener("swipeleft", doSwipeRight, false); obj.addEventListener("swiperight", doSwipeLeft, false); }

function setPSTouchHandlerDoc() {
 if (!isTouchDisbled() && (typeof window.setTouchEventHandler == 'undefined' || window.setTouchEventHandler == null)) {
 window.setTouchEventHandler = function () { 
 setPSTouchHandler(document); }
 setTouchEventHandler(); }
}

function setPSTouchHandlerDraggbles() {
 if (window.top != window && (isIPhone() || isIPad())) {
 var dnd_els = document.querySelectorAll('[draggable=true]'); for (var i = 0; i < dnd_els.length; ++i) {
 setPSTouchHandler(dnd_els[i]); }
 }
}
function doDragStart(e) {
 if ((obj = getHTMLObject(e.target, "draggable")) == null)
 return false; e.dataTransfer.effectAllowed = 'copy';  e.dataTransfer.setData('Text', obj.id);  addClass(obj, "ps-drag-start"); ptdragTimer = null; dPercision = Math.round(screen.height / 10); ptdragTimer2 = null; cloneElem = null;}

function doDragOver(e) {
 if (e.preventDefault) e.preventDefault();  if ((obj = getHTMLObject(e.target, "draggable")) == null)
 return false; if (typeof srcArray != 'undefined' && srcArray.length > 0) {
 var dValue = e.dataTransfer.getData('Text'); if (isValidSource(srcArray, dValue))
 e.dataTransfer.dropEffect = 'copy'; }
 else
 e.dataTransfer.dropEffect = 'copy'; return false;}

function doDragEnter(e) {
 enterX = e.pageX; enterY = e.pageY; if ((obj = getHTMLObject(e.target, "draggable")) == null)
 return false; var el = document.querySelector('.ps-drag-over'); if (el != null)
 removeClass(el, 'ps-drag-over'); rrz = {}; rrz.minX = e.x - e.offsetX; rrz.minY = e.y - e.offsetY; rrz.maxX = rrz.minX + obj.offsetWidth; rrz.maxY = rrz.minY + obj.offsetHeight; addClass(obj, "ps-drag-over"); e.stopPropagation(); e.preventDefault(); return false;}

function doDragLeave(e) {
 if ((obj = getHTMLObject(e.target, "draggable")) == null)
 return false; clearTimeout(ptdragTimer2); ptdragTimer2 = null; if (e.x < rrz.minX || e.x > rrz.maxX || e.y < rrz.minY || e.y > rrz.maxY)
 removeClass(obj, "ps-drag-over"); e.stopPropagation(); e.preventDefault(); return false;}

function doDrag(e) {
 if ((obj = getHTMLObject(e.target, "draggable")) == null)
 return false; orgX = e.pageX; orgY = e.pageY; if ((oGesture = getHTMLObject(e.target, "gestures")) == null)
 return false; if (ptdragTimer == null &&
 (e.pageY >= oGesture.clientHeight - Math.round(oGesture.clientHeight / 10) ||
 (e.pageY <= (document.body.clientHeight - oGesture.clientHeight))) ){
 ptdragTimer = setTimeout(function () {
 if (orgX >= e.pageX - dPercision &&
 orgX <= e.pageX + dPercision &&
 orgY >= e.pageY - dPercision &&
 orgY <= e.pageY + dPercision) {
 if (e.pageY >= oGesture.clientHeight - Math.round(oGesture.clientHeight / 10)) {
 clearTimeout(ptdragTimer); ptdragTimer = null; oGesture.scrollTop = oGesture.scrollTop + Math.round(oGesture.clientHeight / 10); }
 else if (e.pageY <= (document.body.clientHeight - oGesture.clientHeight)) {
 clearTimeout(ptdragTimer); ptdragTimer = null; oGesture.scrollTop = oGesture.scrollTop - Math.round(oGesture.clientHeight / 10); }
 }
 }, 100); }
 
 replaceClass(obj, "ps-drag-start", "ps-drag");}

function doDragEnd(e) {
 clearTimeout(ptdragTimer); ptdragTimer = null; clearTimeout(ptdragTimer2); ptdragTimer2 = null; if ((obj = getHTMLObject(e.target, "draggable")) == null)
 return false; removeClass(obj, "ps-drag");}

function doDrop(e) {
 var formname; if ((obj = getHTMLObject(e.target, "droppable")) == null)
 return false; if (e.preventDefault) e.preventDefault();  var dndSrc = document.getElementById("ICDNDSrc"); var dValue = e.dataTransfer.getData('Text'); if (typeof srcArray != 'undefined' && srcArray.length > 0 && !isValidSource(srcArray, dValue))
 return false; var ndiv = dValue.indexOf("div"); if (ndiv != -1) {
 formname = dValue.substring(0, ndiv); dValue = dValue.substring(ndiv + 3); }
 dndSrc.value = dValue; var aField = obj.id.substring(obj.id.indexOf("div") + 3); var sEvent = "submitAction_" + formname + "(" + formname + " ,'" + aField + "')"; eval(sEvent); return false;}

if (typeof window.setMouseEventHandler == 'undefined' || window.setMouseEventHandler == null) {
 window.setMouseEventHandler = function () {
 document.ondragstart = doDragStart; document.ondragenter = doDragEnter; document.ondragover = doDragOver; document.ondragleave = doDragLeave; document.ondrag = doDrag; document.ondragend = doDragEnd; document.ondrop = doDrop; }
}


 

function DragStartHandler(e, obj){
 e.dataTransfer.effectAllowed = 'copy';  e.dataTransfer.setData('Text', e.target.id);  addClass(obj, "ps-drag-start");} 

function DragOverHandler(e,obj, srcArray){
 if (e.preventDefault) e.preventDefault();  if (typeof srcArray != 'undefined' && srcArray.length > 0){
 var dValue = e.dataTransfer.getData('Text'); if (isValidSource(srcArray, dValue))
 e.dataTransfer.dropEffect = 'copy'; }
 else
 e.dataTransfer.dropEffect = 'copy'; return false;} 

function DragEnterHandler(e, obj){
 var el = document.querySelector('.ps-drag-over'); if (el != null)
 removeClass(el, 'ps-drag-over'); rrz = {}; rrz.minX = e.x - e.offsetX; rrz.minY = e.y - e.offsetY; rrz.maxX = rrz.minX + e.target.offsetWidth; rrz.maxY = rrz.minY + e.target.offsetHeight; addClass(obj, "ps-drag-over"); e.stopPropagation(); e.preventDefault(); return false;}

function DragLeaveHandler(e, obj){
 if (e.x < rrz.minX || e.x > rrz.maxX || e.y < rrz.minY || e.y > rrz.maxY)
 removeClass(obj, "ps-drag-over"); e.stopPropagation(); e.preventDefault(); return false;} 

function DragHandler(e, obj){
 replaceClass(obj, "ps-drag-start", "ps-drag");} 

function DragEndHandler(e, obj){
 removeClass(obj, "ps-drag");} 

function DropHandler(e,obj, srcArry){
 var formname; if (e.preventDefault) e.preventDefault();  var dndSrc = document.getElementById("ICDNDSrc"); var dValue = e.dataTransfer.getData('Text'); if (typeof srcArray != 'undefined' && srcArray.length > 0 && !isValidSource(srcArray, dValue))
 return false; var ndiv = dValue.indexOf("div"); if (ndiv != -1){
 formname = dValue.substring(0, ndiv); dValue = dValue.substring(ndiv+3); }
 dndSrc.value = dValue; var aField = obj.id.substring(obj.id.indexOf("div")+3); var sEvent = "submitAction_" + formname + "(" + formname + " ,'" + aField + "')"; eval(sEvent); return false;}

function isValidSource(srcArray, eId)
{
for(var i = 0; i < srcArray.length; i++){
 if (srcArray[i].indexOf(eId))
 return true;}
return false;}

function GetObjPos(obj){
var x = 0;var y = 0; var w = obj.offsetWidth;var h = obj.offsetHeight;if (obj.offsetParent) {
 x = obj.offsetLeft
 y = obj.offsetTop
 while (obj = obj.offsetParent){
 x += obj.offsetLeft; y += obj.offsetTop; }
}

return {x:x, y:y, w:w, h:h};} 

function TouchStartHandler(e, obj){ 

var o = e.target;while (o.getAttribute("draggable") != "true")
 o = o.parentElement;var oPos = GetObjPos(o);o.setAttribute("offsetX", oPos.x + e.layerX);o.setAttribute("offsetY", oPos.y + e.layerY);addClass(obj, "ps-drag-start");}

function TouchMoveHandler(e, obj, srcArray){
 var o = e.targetTouches[0].target; while (o.getAttribute("draggable") != "true")
 o = o.parentElement;  e.preventDefault(); var curX = e.targetTouches[0].pageX - parseInt(o.getAttribute("offsetX")); var curY = e.targetTouches[0].pageY - parseInt(o.getAttribute("offsetY")); o.style.position = "absolute"; o.style.top = curY + 'px'; o.style.left = curX + 'px';  replaceClass(obj, "ps-drag-start", "ps-drag");} 

function TouchEndHandler(e, obj, srcArray){
 var formname; removeClass(obj, "ps-drag"); if (e.preventDefault) e.preventDefault();  srcValue = obj.id; var dndSrc = document.getElementById("ICDNDSrc"); if (typeof srcArray != 'undefined' && srcArray.length > 0 && !isValidSource(srcArray, srcValue))
 return false;   var ndiv = srcValue.indexOf("div")
 if (ndiv != -1){
 formname = srcValue.substring(0, ndiv); srcValue = srcValue.substring(ndiv+3); }

 dndSrc.value = srcValue;  targetElem = document.elementFromPoint(e.changedTouches[0].pageX,e.changedTouches[0].pageY);  while (targetElem.getAttribute("draggable") != "true"){
 targetElem = targetElem.parentElement;  }
 var aField = targetElem.id.substring(obj.id.indexOf("div")+3); var sEvent = "submitAction_" + formname + "(" + formname + " ,'" + aField + "')"; eval(sEvent); return false;}


function TouchCancelHandler(e, obj, srcArray){
}

function StartDragAccessible(id) {
 var dropTargets = document.querySelectorAll('[' + 'draggable' + ']'); if (dropTargets.length) { 
 var el = document.getElementById(id); el = getHTMLObject(el, "draggable"); var srcValue = el.id; var dndSrc = document.getElementById("ICDNDSrc"); var ndiv = srcValue.indexOf("div"); if (ndiv != -1) {
 formname = el.id.substring(0, ndiv); srcValue = el.id.substring(ndiv + 3); }
 dndSrc.value = srcValue; el.setAttribute('aria-grabbed', 'true'); addClass(el, "ps-drag-start"); for (var i = 0; i < dropTargets.length; i++) {
 if (el != dropTargets[i]) {
 dropTargets[i].setAttribute('aria-dropeffect', 'move'); dropTargets[i].setAttribute('aria-grabbed', 'false'); removeClass(dropTargets[i], "ps-drag-start"); }
 }
 }
}

function EndDragAccessible(id) {
 var dropTargets = document.querySelectorAll('[' + 'draggable' + ']'); if (dropTargets.length) {
 var el = document.getElementById(id); el = getHTMLObject(el, "draggable"); var dndSrc = document.getElementById("ICDNDSrc"); var ndiv = el.id.indexOf("div"); if (ndiv != -1)
 formname = el.id.substring(0, ndiv); el.setAttribute('aria-grabbed', 'false'); for (var i = 0; i < dropTargets.length; i++) {
 if (el != dropTargets[i]) {
 dropTargets[i].setAttribute('aria-dropeffect', 'none'); dropTargets[i].setAttribute('aria-grabbed', 'false'); }
 }
 var aField = el.id.substring(el.id.indexOf("div") + 3); var sEvent = "submitAction_" + formname + "(" + formname + " ,'" + aField + "')"; eval(sEvent); dndSrc.value = ""; }
}









var ptTileUtil = {
 init : false,
 isSFF : false,
 tileWSize : 250,
 tileHSize: 197,
 tilePadd: 10,
 HCONST: 0, 
 WCONST: 1, 

 
 maxLogicalSize: 9, 

 initialize : function(){
 this.isSFF = (document.querySelector('html').getAttribute('class').indexOf('psc_form-small') >= 0) ? true: false; this.tileWSize = this.isSFF ? 152 : 250; this.tileHSize = this.isSFF ? 120 : 197; this.tilePadd = this.isSFF ? 5 : 10; this.init = true; },
 

 roundUpWSize : function (Wcurr){
 var pgEl = document.querySelector('#PT_CONTENT'); var minWDisp = ((this.tileWSize * 2) + (this.tilePadd * (2-1))); var maxW = Math.min(Wcurr, Math.max(pgEl.clientWidth, minWDisp)); var i=1; var currW = 0
 while (((currW=((this.tileWSize * i) + (this.tilePadd * (i-1)))) < maxW) && (i<this.maxLogicalSize)) 
 i++;  if (currW >= maxW) {
 if (currW > Math.max(pgEl.clientWidth, minWDisp))
 return (i-1); else
 return i; }
 return i; },

 
 roundUpHSize : function(Hcurr){
 var pgEl = document.querySelector('#PT_CONTENT'); var maxH = Math.min(Hcurr, pgEl.clientHeight); var i=1; var currH = 0; while (((currH=((this.tileHSize * i) + (this.tilePadd * (i-1)))) < maxH) && (i<this.maxLogicalSize)) 
 i++;  if (currH >= maxH) {
 if (currH > pgEl.clientHeight)
 return i-1; else
 return i; } 
 return i; },


 getCurMaxHeight : function(curHeight) {
 var pgEl = document.querySelector('#PT_CONTENT');  maxLogicalHeight = Math.floor(pgEl.clientHeight / (this.tileHSize + this.tilePadd)); return Math.min(curHeight, maxLogicalHeight); },

 getCurMaxWidth : function(curWidth) {
 var pgEl = document.querySelector('#PT_CONTENT');  maxLogicalWidth = Math.floor(pgEl.clientWidth / (this.tileWSize + this.tilePadd)); return Math.min(curWidth, maxLogicalWidth); },


 autoSizeMe : function(obj, w, h){
 if (!this.init) 
 this.initialize(); var newW = this.roundUpWSize(w); newW = (newW == 1) ? newW : Math.max(newW, 2); var newH = Math.max(this.roundUpHSize(h), 1);  if (newW)
 obj.className = obj.className.replace(/rsz_w\d/g,"rsz_w" + newW); if (newH)
 obj.className = obj.className.replace(/rsz_h\d/g,"rsz_h" + newH);  },

 getParentTileDiv : function(obj){
 
 var myParentTile = obj.parentNode; while (myParentTile && ((myParentTile.tagName != "DIV") || (myParentTile.className.indexOf("nuitile") == -1)))
 myParentTile = myParentTile.parentNode; if ((myParentTile.tagName == "DIV") && (myParentTile.className.indexOf("nuitile") != -1))
 return myParentTile; return null; },

 getAppsContentSizes: function (obj, bFrame) {
 
 var idx = 0; var hwSize = [[], []]; var fDoc = obj; try {
 if (!bFrame) {
 hwSize[this.HCONST][idx] = obj.scrollHeight; hwSize[this.WCONST][idx] = obj.scrollWidth; } else {
 fDoc = (obj.contentWindow && obj.contentWindow.document) ? obj.contentWindow.document.body : obj.contentDocument.documentElement; hwSize[this.HCONST][idx] = fDoc.scrollHeight; hwSize[this.WCONST][idx] = fDoc.scrollWidth; if (obj.contentDocument.documentElement) {
 idx++; hwSize[this.HCONST][idx] = obj.contentDocument.documentElement.scrollHeight; hwSize[this.WCONST][idx] = obj.contentDocument.documentElement.scrollWidth; }
 }
 } catch (ex) {
 hwSize[this.HCONST][idx] = 0; hwSize[this.WCONST][idx] = 0; throw ex;  } 
 
 var psAppsContent = fDoc.querySelectorAll(".ps_apps_content"); if (psAppsContent != null) {
 for (var i = 0; i < psAppsContent.length; i++) {
 idx++; hwSize[this.HCONST][idx] = psAppsContent[i].scrollHeight; hwSize[this.WCONST][idx] = psAppsContent[i].scrollWidth; }
 }

 
 psAppsContent = fDoc.getElementsByClassName("ps_box-grid ps_scrollable"); if (psAppsContent != null) {
 for (var i = 0; i < psAppsContent.length; i++) {
 idx++; hwSize[this.HCONST][idx] = psAppsContent[i].scrollHeight; hwSize[this.WCONST][idx] = psAppsContent[i].scrollWidth; }
 }

 var psAppsTab = fDoc.querySelectorAll(".ps_tabs"); if (psAppsTab != null) {
 for (var i = 0; i < psAppsTab.length; i++) {
 idx++; hwSize[this.HCONST][idx] = psAppsTab[i].scrollHeight; hwSize[this.WCONST][idx] = psAppsTab[i].scrollWidth; }
 }
 var maxh = Math.max.apply(Math, hwSize[this.HCONST]); var maxw = Math.max.apply(Math, hwSize[this.WCONST]); var maxContArr = []; maxContArr[this.HCONST] = maxh; maxContArr[this.WCONST] = maxw; return maxContArr; }
};addEventListener("message", ptRcvDocSize, false); function autoResizeDiv(obj) {
 
 if (obj.getElementsByTagName("iframe").length > 0)
 return; var objContArr = ptTileUtil.getAppsContentSizes(obj, false); var myContainer = autoResizeThis(obj, objContArr[ptTileUtil.WCONST], objContArr[ptTileUtil.HCONST], obj.id);  if (myContainer.offsetHeight < objContArr[ptTileUtil.HCONST] || myContainer.offsetWidth < objContArr[ptTileUtil.WCONST])
 obj.style.overflow = "auto"; else
 obj.style.overflow = "hidden";}

function autoResizeThis(obj, w, h, oid){
 var myParentTile = obj.parentNode; while (myParentTile && ((myParentTile.tagName != "DIV") || (myParentTile.className.indexOf("nuitile") == -1)))
 myParentTile = myParentTile.parentNode; if ((myParentTile.tagName == "DIV") && (myParentTile.className.indexOf("nuitile") != -1))
 ptTileUtil.autoSizeMe(myParentTile, w, h);  if (!myParentTile.getAttribute("data-autosize"))
 myParentTile.setAttribute("data-autosize", obj.parentNode.id);  SetGridSize(null, false); return myParentTile;}

function autoResizeFrame(obj) {
 
 try {
 var objContArr = ptTileUtil.getAppsContentSizes(obj, true);  autoResizeThis(obj, objContArr[ptTileUtil.WCONST], objContArr[ptTileUtil.HCONST], obj.parentNode.id); } 
 catch(exception){
 
 var tw = obj.parentNode.getAttribute("data-tW");  var th = obj.parentNode.getAttribute("data-tH");  if ((tw != null) && (th != null)) {
 if (!ptTileUtil.init) 
 ptTileUtil.initialize(); var wpx = ((ptTileUtil.tileWSize * tw) + (ptTileUtil.tilePadd * (tw-1))); var hpx = ((ptTileUtil.tileHSize * th) + (ptTileUtil.tilePadd * (th-1))); autoResizeThis(obj, wpx, hpx, obj.parentNode.id); }
 }
}


function ptRcvDocSize(event)
{
 
 
 if (event.source.frameElement && event.source.frameElement.parentNode) {
 if (event.source.frameElement.parentNode.getAttribute("data-bAutoSize") == null) 
 return;  if (event.data && /^w:[0-9]+,h:[0-9]+$/.test(event.data)) {
 var w = event.data.match(/w:[0-9]+/).toString(); var h = event.data.match(/h:[0-9]+/).toString(); autoResizeThis(event.source.frameElement, w.substring(2), h.substring(2), event.source.frameElement.parentNode.id);  }
 }
}

