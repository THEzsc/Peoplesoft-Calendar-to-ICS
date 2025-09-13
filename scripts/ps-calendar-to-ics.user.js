// ==UserScript==
// @name         PS Calendar to ICS (ZJU)
// @namespace    https://github.com/yourname/ps-calendar-to-ics
// @version      0.2.4-debug
// @description  将 PeopleSoft「我的每周课程表-列表查看」导出为 ICS 文件（支持中文/英文标签，Asia/Shanghai）
// @author       You
// @match        https://scrsprd.zju.edu.cn/psc/CSPRD/EMPLOYEE/HRMS/*
// @match        file:///*
// @run-at       document-idle
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  const APP_NAME = "PS Calendar to ICS";
  const TZID = "Asia/Shanghai"; // China Standard Time (no DST)
  const HOST_HINT = "scrsprd.zju.edu.cn";

  // === 2024-2025学年秋冬学期行事历 ===
  const ACADEMIC_CALENDAR_2024_2025 = {
    semesterStart: new Date(2024, 8, 15), // 9月15日 - 秋冬学期课程开始
    semesterEnd: new Date(2025, 0, 10),   // 1月10日 - 复习与考试结束
    
    // 假期和停课（这些日期不上课）
    holidays: [
      { start: new Date(2024, 9, 1), end: new Date(2024, 9, 8), name: "中秋节、国庆节放假调休" },
      { start: new Date(2024, 9, 24), end: new Date(2024, 9, 26), name: "秋季校运动会停课" },
      { start: new Date(2024, 11, 29), end: new Date(2024, 11, 30), name: "复习与考试" },
      { start: new Date(2024, 11, 31), end: new Date(2024, 11, 31), name: "浙江大学学生节" },
      { start: new Date(2025, 0, 1), end: new Date(2025, 0, 1), name: "元旦" },
      { start: new Date(2025, 0, 2), end: new Date(2025, 0, 10), name: "复习与考试" },
    ],
    
    // 调休补课：在makeupDate上originalDate星期几的课
    makeupClasses: [
      // 9月28日（周六）上10月3日（周四）的课
      { makeupDate: new Date(2024, 8, 28), originalDate: new Date(2024, 9, 3) },
      // 10月11日（周五）上10月8日（周二）的课  
      { makeupDate: new Date(2024, 9, 11), originalDate: new Date(2024, 9, 8) },
    ],
  };

  // 学期重要事项（导出为全天事件）
  const ACADEMIC_NOTES_2024_2025 = [
    { start: new Date(2024, 7, 22), end: new Date(2024, 7, 22), summary: "新生报到注册" },
    { start: new Date(2024, 7, 23), end: new Date(2024, 8, 14), summary: "本科生新生始业教育、军训（8/24本科生开学典礼）" },
    { start: new Date(2024, 7, 25), end: new Date(2024, 7, 25), summary: "UIUC校历课程开始 / ZJUI二轮选课开始" },
    { start: new Date(2024, 8, 8), end: new Date(2024, 8, 8), summary: "UIUC校历课程本科生加课截止时间" },
    { start: new Date(2024, 8, 12), end: new Date(2024, 8, 12), summary: "本科生老生报到注册" },
    { start: new Date(2024, 8, 15), end: new Date(2024, 8, 15), summary: "秋冬学期课程开始" },
    { start: new Date(2024, 8, 19), end: new Date(2024, 8, 19), summary: "本科生选课截止" },
    { start: new Date(2024, 8, 28), end: new Date(2024, 8, 28), summary: "工作日，授10月3日周五课" },
    { start: new Date(2024, 9, 1), end: new Date(2024, 9, 8), summary: "中秋节、国庆节放假调休" },
    { start: new Date(2024, 9, 11), end: new Date(2024, 9, 11), summary: "工作日，授10月8日周二课" },
    { start: new Date(2024, 9, 17), end: new Date(2024, 9, 17), summary: "UIUC校历课程本科生退课截止日期" },
    { start: new Date(2024, 9, 24), end: new Date(2024, 9, 26), summary: "秋季校运动会停课" },
    { start: new Date(2024, 10, 7), end: new Date(2024, 10, 7), summary: "本科生申请退课截止日期" },
    { start: new Date(2024, 11, 21), end: new Date(2024, 11, 21), summary: "国际校区2025年辞旧迎新活动" },
    { start: new Date(2024, 11, 26), end: new Date(2024, 11, 26), summary: "课程结束" },
    { start: new Date(2024, 11, 29), end: new Date(2024, 11, 30), summary: "复习与考试" },
    { start: new Date(2024, 11, 31), end: new Date(2024, 11, 31), summary: "浙江大学学生节" },
    { start: new Date(2025, 0, 1), end: new Date(2025, 0, 1), summary: "元旦放假" },
    { start: new Date(2025, 0, 2), end: new Date(2025, 0, 10), summary: "复习与考试" },
  ];


  // === 行事历辅助 ===
  function dateOnly(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function addDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  }
  function isHolidayDate(d) {
    const day = dateOnly(d);
    return ACADEMIC_CALENDAR_2024_2025.holidays.some(h => day >= dateOnly(h.start) && day <= dateOnly(h.end));
  }
  function findMakeupInfo(d) {
    const day = dateOnly(d);
    return ACADEMIC_CALENDAR_2024_2025.makeupClasses.find(m => dateOnly(m.makeupDate).getTime() === day.getTime());
  }


  /**
   * Main bootstrap: observe page and iframes, inject export buttons when schedule view is present.
   */
  function bootstrap() {
    console.log("[DEBUG] PS Calendar to ICS 脚本启动");
    console.log("[DEBUG] 当前URL:", window.location.href);
    tryInjectForDocument(window.document);
    // Observe top document changes (PeopleSoft is dynamic)
    observeForSchedule(window.document);

    // Handle target iframes (ps_target-iframe)
    const iframeSelector = "iframe.ps_target-iframe";
    const iframeList = Array.from(document.querySelectorAll(iframeSelector));
    iframeList.forEach((iframe) => attachIframeListener(iframe));

    // Observe future iframes added
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (
              node instanceof HTMLIFrameElement &&
              node.classList.contains("ps_target-iframe")
            ) {
              attachIframeListener(node);
            }
          });
        }
      }
    });
    obs.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
    });
    
    // Also try again after a short delay (for dynamic content)
    setTimeout(() => {
      console.log("[DEBUG] 延迟重试注入按钮...");
      tryInjectForDocument(window.document);
    }, 2000);
    
    // Additional retry for PeopleSoft's complex loading
    setTimeout(() => {
      console.log("[DEBUG] 最终重试注入按钮...");
      tryInjectForDocument(window.document);
      // Force inject a debug button if still not found
      if (!document.getElementById("ps-ics-export-btn")) {
        console.log("[DEBUG] 强制注入调试按钮");
        forceInjectDebugButton();
      }
    }, 5000);
  }
  
  function forceInjectDebugButton() {
    const btn = document.createElement("button");
    btn.id = "ps-ics-export-btn";
    btn.textContent = "导出 ICS (调试)";
    btn.style.position = "fixed";
    btn.style.right = "16px";
    btn.style.bottom = "16px";
    btn.style.zIndex = "2147483647";
    btn.style.padding = "10px 14px";
    btn.style.borderRadius = "8px";
    btn.style.border = "1px solid #d0570b";
    btn.style.background = "#d21967";
    btn.style.color = "#fff";
    btn.style.fontSize = "14px";
    btn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.25)";
    btn.style.cursor = "pointer";
    btn.title = "强制调试模式";
    btn.addEventListener("click", () => {
      console.log("[DEBUG] 强制调试按钮被点击");
      console.log("[DEBUG] 页面元素检查:");
      console.log("- win0divSTDNT_ENRL_SSV2$0:", document.querySelector('#win0divSTDNT_ENRL_SSV2\\$0'));
      console.log("- ACE_STDNT_ENRL_SSV2$0:", document.querySelector('#ACE_STDNT_ENRL_SSV2\\$0'));
      console.log("- PAGROUPDIVIDER:", document.querySelectorAll('td.PAGROUPDIVIDER').length);
      console.log("- CLASS_MTG_VW tables:", document.querySelectorAll('table[id*="CLASS_MTG_VW"]').length);
      
      // Try to parse anyway
      const parsed = parseScheduleFromDocument(document);
      console.log("[DEBUG] 强制解析结果:", parsed);
      
      if (parsed && parsed.events.length > 0) {
        const icsText = buildICS(parsed);
        console.log("[DEBUG] 生成ICS长度:", icsText.length);
        const fileName = buildSuggestedFileName(parsed);
        triggerDownload(icsText, fileName);
      } else {
        alert("调试模式：未找到课程数据。请查看控制台日志。");
      }
    });
    document.body.appendChild(btn);
  }

  function attachIframeListener(iframe) {
    // In case of cross-origin issues, try/catch
    iframe.addEventListener("load", () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        tryInjectForDocument(doc);
        observeForSchedule(doc);
      } catch (_) {
        // ignore
      }
    });
  }

  /**
   * Observe a document for schedule container appearance, then inject button.
   */
  function observeForSchedule(doc) {
    const observer = new MutationObserver(() => {
      if (findScheduleRoot(doc)) {
        injectExportButton(doc);
      }
    });
    observer.observe(doc.documentElement || doc.body, {
      subtree: true,
      childList: true,
      attributes: false,
    });
  }

  function tryInjectForDocument(doc) {
    if (findScheduleRoot(doc)) {
      injectExportButton(doc);
    }
  }

  /**
   * Find the schedule container in the given document.
   * Returns an element or null.
   */
  function findScheduleRoot(doc) {
    console.log("[DEBUG] 查找课表根元素...");
    // Typical container mentioned by user: #win0divSTDNT_ENRL_SSV2$0 > table#ACE_STDNT_ENRL_SSV2$0
    const selectors = [
      '#win0divSTDNT_ENRL_SSV2\\$0',
      '#ACE_STDNT_ENRL_SSV2\\$0',
      'div[id^="win0divSTDNT_ENRL_SSV2"]',
      'table[id^="ACE_STDNT_ENRL_SSV2"]',
      'div[id*="STDNT_ENRL_SSV2"]',
    ];
    for (const sel of selectors) {
      const el = doc.querySelector(sel);
      console.log("[DEBUG] 选择器", sel, "结果:", el ? "找到" : "未找到");
      if (el) {
        console.log("[DEBUG] 找到课表根元素:", el.id, el.tagName);
        return el;
      }
    }
    // Fallback: detect by header columns "Days & Times" / "日期与时间"
    const tables = Array.from(doc.querySelectorAll("table"));
    for (const t of tables) {
      const text = (t.textContent || "").trim();
      if (!text) continue;
      if (
        /Days\s*&\s*Times|日期[与和及]?时间|星期与时间|上课时间/i.test(text) &&
        /Room|教室|地点/i.test(text) &&
        /Instructor|教师|老师/i.test(text) &&
        /(Start\/?End Date|开始\/?结束日期|起止日期|开始日期)/i.test(text)
      ) {
        return t;
      }
    }
    return null;
  }

  function injectExportButton(doc) {
    const existingBtn = doc.getElementById("ps-ics-export-btn");
    if (existingBtn) {
      console.log("[DEBUG] 按钮已存在，跳过注入");
      return;
    }
    console.log("[DEBUG] 开始注入导出按钮");
    const btn = doc.createElement("button");
    btn.id = "ps-ics-export-btn";
    btn.textContent = "导出 ICS";
    btn.style.position = "fixed";
    btn.style.right = "16px";
    btn.style.bottom = "16px";
    btn.style.zIndex = "2147483647";
    btn.style.padding = "10px 14px";
    btn.style.borderRadius = "8px";
    btn.style.border = "1px solid #0b57d0";
    btn.style.background = "#1967d2";
    btn.style.color = "#fff";
    btn.style.fontSize = "14px";
    btn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.25)";
    btn.style.cursor = "pointer";
    btn.title = `${APP_NAME}`;
    btn.addEventListener("click", async () => {
      try {
        const parsed = parseScheduleFromDocument(doc);
        console.log("[DEBUG] 解析结果:", parsed);
        if (!parsed || parsed.events.length === 0) {
          alert("未找到课程表数据（请确认处于"列表查看"界面）。");
          return;
        }
        const icsText = buildICS(parsed);
        console.log("[DEBUG] 生成的ICS长度:", icsText.length);
        const fileName = buildSuggestedFileName(parsed);
        triggerDownload(icsText, fileName);
      } catch (err) {
        console.error(APP_NAME, err);
        alert("导出失败：" + (err && err.message ? err.message : String(err)));
      }
    });
    (doc.body || doc.documentElement).appendChild(btn);
    console.log("[DEBUG] 导出按钮已注入到", doc === window.document ? "主文档" : "iframe文档");
  }

  function buildSuggestedFileName(parsed) {
    const title = parsed.termTitle || "课程表";
    return `ZJU-${sanitizeFileName(title)}.ics`;
  }

  function sanitizeFileName(name) {
    return name.replace(/[\\/:*?"<>|]+/g, "_").slice(0, 64);
  }

  /**
   * Parse schedule data: returns { termTitle, events: Array<MeetingEvent> }
   */
  function parseScheduleFromDocument(doc) {
    const root = findScheduleRoot(doc);
    if (!root) {
      return { termTitle: detectTermTitle(doc), events: [] };
    }

    const termTitle = detectTermTitle(doc) || detectTermTitle(root) || "";

    // Strategy: find tables that look like meeting info grids
    const candidateTables = Array.from(root.querySelectorAll("table"));
    const grids = candidateTables.filter((t) => isMeetingGrid(t));
    const events = [];

    for (const grid of grids) {
      const parentBlock = findCourseBlockElement(grid);
      const courseTitle = detectCourseTitle(parentBlock) || detectCourseTitle(grid) || "课程";
      const meetings = parseMeetingGrid(grid);
      for (const m of meetings) {
        events.push({
          summary: courseTitle,
          location: m.location,
          instructor: m.instructor,
          notes: m.notes,
          days: m.days,
          startTime: m.startTime, // {h,m}
          endTime: m.endTime, // {h,m}
          startDate: m.startDate, // Date (midnight local)
          endDate: m.endDate, // Date (midnight local)
        });
      }
    }

    // Deduplicate identical events (optional)
    const uniqueEvents = dedupeEvents(events);

    return { termTitle, events: uniqueEvents };
  }

  function detectTermTitle(scope) {
    const doc = scope.ownerDocument || scope;
    // Try some common anchors
    const titleCandidates = [
      ...Array.from(doc.querySelectorAll("h1, h2, h3, .PAPAGETITLE, .PTPAGETITLE, .PTTEXT, .ps_pageheader")),
    ];
    for (const el of titleCandidates) {
      const t = cleanText(el.textContent);
      if (!t) continue;
      if (/学期|学年|Term|Session|课程表/i.test(t)) {
        return t;
      }
    }
    // Fallback to document title
    const title = (doc.title || "").trim();
    if (title) return title;
    return "";
  }

  function isMeetingGrid(table) {
    const headerText = cleanText(table.textContent);
    if (!headerText) return false;
    const hasCols =
      /(Days\s*&\s*Times|日期[与和及]?时间|星期与时间|上课时间)/i.test(headerText) &&
      /(Room|教室|地点)/i.test(headerText) &&
      /(Instructor|教师|老师|讲师)/i.test(headerText) &&
      /(Start\/?End Date|开始\/?结束日期|起止日期|开始日期)/i.test(headerText);
    if (!hasCols) return false;
    // Grid should have multiple rows
    const rows = table.querySelectorAll("tr");
    return rows.length >= 2;
  }

  function findCourseBlockElement(el) {
    // Walk up to a reasonable container that may also contain the course title
    let cur = el;
    for (let i = 0; i < 5 && cur && cur.parentElement; i++) {
      cur = cur.parentElement;
      const text = cleanText(cur.textContent);
      if (/课程|课|class|course/i.test(text)) {
        return cur;
      }
    }
    return el.parentElement || el;
  }

  function detectCourseTitle(scope) {
    if (!scope) return "";
    
    // Strategy 1: Look for PSHYPERLINK elements that might contain course codes/names
    const hyperlinks = Array.from(scope.querySelectorAll('a.PSHYPERLINK, span.PSHYPERLINK'));
    for (const link of hyperlinks) {
      const t = cleanText(link.textContent);
      if (!t) continue;
      // Skip navigation links
      if (/课程时段|section|meeting/i.test(t)) continue;
      // Look for course code patterns or meaningful titles
      if (/\b[A-Za-z]{2,5}\s*\d{2,4}\b/.test(t) || t.length > 3) {
        return t;
      }
    }
    
    // Strategy 2: Look for elements with course-related IDs
    const selectors = [
      'span[id*="CLASSNAME"], a[id*="CLASSNAME"], div[id*="CLASSNAME"]',
      'span[id*="DERIVED_SSR"], a[id*="DERIVED_SSR"], div[id*="DERIVED_SSR"]',
      'span[id*="COURSE"], a[id*="COURSE"], div[id*="COURSE"]',
    ];
    for (const sel of selectors) {
      const nodes = Array.from(scope.querySelectorAll(sel));
      for (const n of nodes) {
        const t = cleanText(n.textContent);
        if (!t) continue;
        // Prefer lines with section or class number patterns
        if (/\b\d{4,5}\b/.test(t) || /Section|节|班|Lecture|Lab|实验|讨论/i.test(t)) {
          return t;
        }
        // Common course code pattern ABCD 1234
        if (/\b[A-Za-z]{2,5}\s*\d{2,4}\b/.test(t)) {
          return t;
        }
      }
    }
    
    // Strategy 3: Look in previous sibling elements or parent containers
    let cur = scope;
    for (let i = 0; i < 3 && cur; i++) {
      const prev = cur.previousElementSibling;
      if (prev) {
        const t = cleanText(prev.textContent);
        if (t && t.length > 5 && t.length < 100) {
          // Filter out common non-course text
          if (!/已注册|学分|评分|截止日期|Status|Credits/i.test(t)) {
            return t;
          }
        }
      }
      cur = cur.parentElement;
    }
    
    // Fallback: Use a generic identifier based on table position
    const tables = Array.from(document.querySelectorAll('table[id*="CLASS_MTG_VW"]'));
    const tableIndex = tables.indexOf(scope.closest('table'));
    if (tableIndex >= 0) {
      return `课程 ${tableIndex + 1}`;
    }
    
    return "课程";
  }

  function parseMeetingGrid(table) {
    const results = [];
    const rows = Array.from(table.querySelectorAll("tr"));
    if (rows.length < 2) return results;

    // Determine column indexes by header row content
    let headerIdx = 0;
    while (headerIdx < rows.length && cleanText(rows[headerIdx].textContent) === "") {
      headerIdx++;
    }
    if (headerIdx >= rows.length) return results;
    const headerRow = rows[headerIdx];
    const headerCells = Array.from(headerRow.querySelectorAll("th, td"));
    const colIndex = { daysTimes: -1, room: -1, instructor: -1, dates: -1 };
    headerCells.forEach((cell, idx) => {
      const t = cleanText(cell.textContent);
      if (/(Days\s*&\s*Times|日期[与和及]?时间|星期与时间|上课时间)/i.test(t)) colIndex.daysTimes = idx;
      if (/(Room|教室|地点)/i.test(t)) colIndex.room = idx;
      if (/(Instructor|教师|老师|讲师)/i.test(t)) colIndex.instructor = idx;
      if (/(Start\/?End Date|开始\/?结束日期|起止日期|开始日期)/i.test(t)) colIndex.dates = idx;
    });
    const hasAll =
      colIndex.daysTimes >= 0 &&
      colIndex.room >= 0 &&
      colIndex.instructor >= 0 &&
      colIndex.dates >= 0;
    if (!hasAll) return results;

    for (let r = headerIdx + 1; r < rows.length; r++) {
      const row = rows[r];
      const cells = Array.from(row.querySelectorAll("td"));
      if (cells.length === 0) continue;
      const dt = cleanText(getCellText(cells, colIndex.daysTimes));
      const room = cleanText(getCellText(cells, colIndex.room));
      const instructor = cleanText(getCellText(cells, colIndex.instructor));
      const dates = cleanText(getCellText(cells, colIndex.dates));

      if (!dt || /TBA|待定|未安排/i.test(dt)) continue;
      const parsedDT = parseDaysAndTimes(dt);
      const parsedDates = parseDateRange(dates);
      if (!parsedDT || !parsedDates) continue;

      results.push({
        location: room || "",
        instructor: instructor || "",
        notes: "",
        days: parsedDT.days, // array of iCal BYDAY tokens
        startTime: parsedDT.startTime, // {h,m}
        endTime: parsedDT.endTime, // {h,m}
        startDate: parsedDates.startDate,
        endDate: parsedDates.endDate,
      });
    }

    return results;
  }

  function getCellText(cells, idx) {
    if (idx < 0 || idx >= cells.length) return "";
    return cells[idx].textContent || "";
  }

  function parseDaysAndTimes(text) {
    const t = cleanText(text);
    if (!t) return null;
    // Examples:
    // "MoWe 10:00AM - 11:15AM"
    // "周二 08:00 - 09:35"
    // "一三五 13:00-14:35"
    // Extract time range first
    const timeMatch = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?\s*[-~—–]\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!timeMatch) return null;
    const start = to24h(timeMatch[1], timeMatch[2], timeMatch[3]);
    const end = to24h(timeMatch[4], timeMatch[5], timeMatch[6]);

    // Extract day tokens (English or Chinese)
    const days = extractDaysOfWeek(t);
    if (!days || days.length === 0) return null;

    return {
      days,
      startTime: start,
      endTime: end,
    };
  }

  function extractDaysOfWeek(raw) {
    const s = raw.replace(/\s+/g, " ").trim();
    const days = new Set();
    // English abbreviations possibly concatenated: MoTuWeThFrSaSu or with spaces
    const enMap = {
      Mo: "MO",
      Tu: "TU",
      We: "WE",
      Th: "TH",
      Fr: "FR",
      Sa: "SA",
      Su: "SU",
      Mon: "MO",
      Tue: "TU",
      Wed: "WE",
      Thu: "TH",
      Fri: "FR",
      Sat: "SA",
      Sun: "SU",
    };
    const zhMap = {
      一: "MO",
      二: "TU",
      三: "WE",
      四: "TH",
      五: "FR",
      六: "SA",
      日: "SU",
      天: "SU",
    };

    // English: look for tokens
    const enTokens = s.match(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Mo|Tu|We|Th|Fr|Sa|Su)\b/gi);
    if (enTokens && enTokens.length) {
      enTokens.forEach((tok) => {
        const key = tok.slice(0, 1).toUpperCase() + tok.slice(1, 2).toLowerCase();
        // normalize 3-letter too
        const norm =
          enMap[tok] || enMap[key + (tok.length >= 3 ? tok.slice(2).toLowerCase() : "")];
        if (norm) days.add(norm);
      });
    }

    // Chinese: look for patterns with 周 or 星期, or standalone like 一三五
    // Extract segments after 周/星期
    const zhSegments = [];
    const zhPrefixRegex = /(周|星期)([一二三四五六日天]+)(?!\S)/g;
    let m;
    while ((m = zhPrefixRegex.exec(s)) !== null) {
      zhSegments.push(m[2]);
    }
    // Also match individual "星期X" patterns like "星期一"
    const individualZhRegex = /(周|星期)([一二三四五六日天])\b/g;
    while ((m = individualZhRegex.exec(s)) !== null) {
      zhSegments.push(m[2]);
    }
    // Standalone chain like "一三五"
    const soloMatch = s.match(/\b([一二三四五六日天]{1,7})\b/);
    if (soloMatch) zhSegments.push(soloMatch[1]);

    zhSegments.forEach((seg) => {
      for (const ch of seg.split("")) {
        const norm = zhMap[ch];
        if (norm) days.add(norm);
      }
    });

    return Array.from(days);
  }

  function to24h(hh, mm, ampm) {
    let h = parseInt(hh, 10);
    const m = parseInt(mm, 10);
    const ampmNorm = ampm ? ampm.toUpperCase() : null;
    if (ampmNorm === "PM" && h < 12) h += 12;
    if (ampmNorm === "AM" && h === 12) h = 0;
    return { h, m };
  }

  function parseDateRange(text) {
    const s = cleanText(text);
    if (!s) return null;
    // Support formats: MM/DD/YYYY - MM/DD/YYYY, YYYY/MM/DD - YYYY/MM/DD, YYYY-MM-DD 至 YYYY-MM-DD
    const dateRegex = /([0-9]{4}[\/\-][0-9]{1,2}[\/\-][0-9]{1,2}|[0-9]{1,2}[\/][0-9]{1,2}[\/][0-9]{4})/g;
    const matches = s.match(dateRegex);
    if (!matches || matches.length < 2) return null;
    const startStr = matches[0];
    const endStr = matches[1];
    const start = parseDateFlexible(startStr);
    const end = parseDateFlexible(endStr);
    if (!start || !end) return null;
    // Normalize to local midnight
    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    if (startDate > endDate) return null;
    return { startDate, endDate };
  }

  function parseDateFlexible(s) {
    // Try YYYY-MM-DD or YYYY/MM/DD
    let m = s.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
    if (m) {
      return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    }
    // For DD/MM/YYYY format (like 15/09/2025), assume DD/MM/YYYY for ZJU system
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) {
      const day = Number(m[1]);
      const month = Number(m[2]);
      const year = Number(m[3]);
      // Simple heuristic: if first number > 12, it's likely DD/MM/YYYY
      if (day > 12) {
        return new Date(year, month - 1, day);
      } else if (month > 12) {
        // First number <= 12 but second > 12, so MM/DD/YYYY
        return new Date(year, day - 1, month);
      } else {
        // Both <= 12, assume DD/MM/YYYY for ZJU
        return new Date(year, month - 1, day);
      }
    }
    return null;
  }

  function dedupeEvents(events) {
    const seen = new Set();
    const res = [];
    for (const ev of events) {
      const key = [
        ev.summary,
        ev.location,
        ev.instructor,
        ev.days.join(","),
        ev.startTime.h,
        ev.startTime.m,
        ev.endTime.h,
        ev.endTime.m,
        ev.startDate.toISOString().slice(0, 10),
        ev.endDate.toISOString().slice(0, 10),
      ].join("|");
      if (!seen.has(key)) {
        seen.add(key);
        res.push(ev);
      }
    }
    return res;
  }

  /**
   * Build ICS text from parsed data
   */
  function buildICS(parsed) {
    const lines = [];
    lines.push("BEGIN:VCALENDAR");
    lines.push("PRODID:-//" + APP_NAME + "//EN");
    lines.push("VERSION:2.0");
    lines.push("CALSCALE:GREGORIAN");
    lines.push("METHOD:PUBLISH");
    if (parsed.termTitle) lines.push(foldLine("X-WR-CALNAME:" + escapeText(parsed.termTitle)));
    lines.push("X-WR-TIMEZONE:" + TZID);
    lines.push("BEGIN:VTIMEZONE");
    lines.push("TZID:" + TZID);
    lines.push("X-LIC-LOCATION:" + TZID);
    lines.push("BEGIN:STANDARD");
    lines.push("TZOFFSETFROM:+0800");
    lines.push("TZOFFSETTO:+0800");
    lines.push("TZNAME:CST");
    lines.push("DTSTART:19700101T000000");
    lines.push("END:STANDARD");
    lines.push("END:VTIMEZONE");

    const now = new Date();
    const dtstamp = toUTCStringBasic(now);

    // 导出学期备注（全天事件）
    console.log("[DEBUG] 开始导出全天事件，共", ACADEMIC_NOTES_2024_2025.length, "个事件");
    for (const note of ACADEMIC_NOTES_2024_2025) {
      const s = dateOnly(note.start);
      const e = addDays(dateOnly(note.end), 1); // DTEND为次日
      console.log("[DEBUG] 导出全天事件:", note.summary, "从", s, "到", e);
      lines.push("BEGIN:VEVENT");
      lines.push("UID:" + buildSimpleUID("note-" + note.summary + "-" + s.getTime(), now));
      lines.push("DTSTAMP:" + dtstamp + "Z");
      lines.push("DTSTART;VALUE=DATE:" + toDateBasic(s));
      lines.push("DTEND;VALUE=DATE:" + toDateBasic(e));
      lines.push(foldLine("SUMMARY:" + escapeText(note.summary)));
      lines.push("END:VEVENT");
    }

    for (const ev of parsed.events) {
      // Compute DTSTART (first occurrence) and DTEND for that day
      const firstDate = findFirstOccurrence(ev.startDate, ev.days);
      if (!firstDate) continue;
      const dtStartLocal = new Date(
        firstDate.getFullYear(),
        firstDate.getMonth(),
        firstDate.getDate(),
        ev.startTime.h,
        ev.startTime.m,
        0,
        0
      );
      const dtEndLocal = new Date(
        firstDate.getFullYear(),
        firstDate.getMonth(),
        firstDate.getDate(),
        ev.endTime.h,
        ev.endTime.m,
        0,
        0
      );

      // UNTIL is UTC end boundary: endDate 23:59:59 local
      const untilLocal = new Date(
        ev.endDate.getFullYear(),
        ev.endDate.getMonth(),
        ev.endDate.getDate(),
        23,
        59,
        59,
        0
      );
      const untilUTC = toUTCStringBasic(untilLocal) + "Z";

      lines.push("BEGIN:VEVENT");
      lines.push("UID:" + buildUID(ev, now));
      lines.push("DTSTAMP:" + dtstamp + "Z");
      lines.push(
        "DTSTART;TZID=" + TZID + ":" + toLocalStringBasic(dtStartLocal)
      );
      lines.push(
        "DTEND;TZID=" + TZID + ":" + toLocalStringBasic(dtEndLocal)
      );
      if (ev.days && ev.days.length) {
        lines.push("RRULE:FREQ=WEEKLY;BYDAY=" + ev.days.join(",") + ";UNTIL=" + untilUTC);

        // 行事历影响：EXDATE（假期停课） & RDATE（调休补课）
        const bydays = new Set(ev.days.map(d => dayTokenToIndex(d))); // 0-6 (0=周日)
        const exdateSet = new Set();
        const rdateSet = new Set();
        
        // 1. 遍历范围内每一天，若是假期且与BYDAY匹配，则加入EXDATE
        for (let d = new Date(ev.startDate); d <= ev.endDate; d = addDays(d, 1)) {
          if (isHolidayDate(d) && bydays.has(d.getDay())) {
            const exLocal = new Date(d.getFullYear(), d.getMonth(), d.getDate(), ev.startTime.h, ev.startTime.m, 0, 0);
            const key = toLocalStringBasic(exLocal);
            if (!exdateSet.has(key)) {
              lines.push("EXDATE;TZID=" + TZID + ":" + key);
              exdateSet.add(key);
            }
          }
        }
        
        // 2. 调休补课：如果originalDate的星期几与课程的BYDAY匹配，则在makeupDate上课
        console.log("[DEBUG] 课程", ev.summary, "的上课星期:", ev.days, "对应数字:", Array.from(bydays));
        for (const makeup of ACADEMIC_CALENDAR_2024_2025.makeupClasses) {
          const originalDow = makeup.originalDate.getDay(); // 原来应该上课的星期几
          console.log("[DEBUG] 检查调休:", makeup.makeupDate, "补", makeup.originalDate, "星期", originalDow);
          if (bydays.has(originalDow)) {
            const makeupDay = dateOnly(makeup.makeupDate);
            console.log("[DEBUG] 匹配！补课日:", makeupDay, "课程范围:", dateOnly(ev.startDate), "-", dateOnly(ev.endDate));
            // 检查补课日是否在课程日期范围内
            if (makeupDay >= dateOnly(ev.startDate) && makeupDay <= dateOnly(ev.endDate)) {
              const rLocal = new Date(makeupDay.getFullYear(), makeupDay.getMonth(), makeupDay.getDate(), ev.startTime.h, ev.startTime.m, 0, 0);
              const key = toLocalStringBasic(rLocal);
              console.log("[DEBUG] 添加补课:", key);
              if (!rdateSet.has(key)) {
                lines.push("RDATE;TZID=" + TZID + ":" + key);
                rdateSet.add(key);
              }
            }
          }
        }
      }
      const summary = ev.summary || "课程";
      lines.push(foldLine("SUMMARY:" + escapeText(summary)));
      const descParts = [];
      if (ev.instructor) descParts.push("教师:" + ev.instructor);
      if (ev.notes) descParts.push(ev.notes);
      if (descParts.length) {
        lines.push(foldLine("DESCRIPTION:" + escapeText(descParts.join("\\n"))));
      }
      if (ev.location) lines.push(foldLine("LOCATION:" + escapeText(ev.location)));
      lines.push("END:VEVENT");
    }

    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }

  function toDateBasic(d) {
    return (
      d.getFullYear().toString().padStart(4, "0") +
      (d.getMonth() + 1).toString().padStart(2, "0") +
      d.getDate().toString().padStart(2, "0")
    );
  }

  function buildSimpleUID(seed, now) {
    const base = seed + "-" + now.getTime();
    let hash = 0;
    for (let i = 0; i < base.length; i++) hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
    const host = location && location.host ? location.host : HOST_HINT;
    return `${hash}@${host}`;
  }

  function buildUID(ev, now) {
    const base = [
      ev.summary,
      ev.location,
      ev.instructor,
      ev.days.join(""),
      ev.startTime.h,
      ev.startTime.m,
      ev.endTime.h,
      ev.endTime.m,
      ev.startDate.getTime(),
      ev.endDate.getTime(),
      now.getTime(),
    ].join("-");
    // Simple hash
    let hash = 0;
    for (let i = 0; i < base.length; i++) {
      hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
    }
    const host = location && location.host ? location.host : HOST_HINT;
    return `${hash}@${host}`;
  }

  function findFirstOccurrence(startDate, bydayTokens) {
    const wanted = new Set(bydayTokens.map((d) => dayTokenToIndex(d)));
    if (wanted.size === 0) return null;
    // Search up to 7 days from startDate
    for (let i = 0; i < 7; i++) {
      const d = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + i
      );
      const dow = d.getDay(); // 0=Sun
      if (wanted.has(dow)) return d;
    }
    return null;
  }

  function dayTokenToIndex(token) {
    switch (token) {
      case "SU":
        return 0;
      case "MO":
        return 1;
      case "TU":
        return 2;
      case "WE":
        return 3;
      case "TH":
        return 4;
      case "FR":
        return 5;
      case "SA":
        return 6;
      default:
        return -1;
    }
  }

  function escapeText(s) {
    return String(s)
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  function foldLine(line) {
    // RFC 5545: lines limited to 75 octets; continuation starts with one space
    const bytes = Array.from(new TextEncoder().encode(line));
    if (bytes.length <= 74) return line;
    const chunks = [];
    let cur = 0;
    while (cur < bytes.length) {
      let next = Math.min(cur + 73, bytes.length); // leave room for CRLF + space
      // avoid splitting multibyte chars in the middle
      while (next < bytes.length && (bytes[next] & 0xc0) === 0x80) {
        next++;
      }
      const slice = bytes.slice(cur, next);
      chunks.push(new TextDecoder().decode(new Uint8Array(slice)));
      cur = next;
    }
    return chunks.join("\r\n ");
  }

  function toLocalStringBasic(d) {
    return (
      d.getFullYear().toString().padStart(4, "0") +
      (d.getMonth() + 1).toString().padStart(2, "0") +
      d.getDate().toString().padStart(2, "0") +
      "T" +
      d.getHours().toString().padStart(2, "0") +
      d.getMinutes().toString().padStart(2, "0") +
      d.getSeconds().toString().padStart(2, "0")
    );
  }

  function toUTCStringBasic(d) {
    return (
      d.getUTCFullYear().toString().padStart(4, "0") +
      (d.getUTCMonth() + 1).toString().padStart(2, "0") +
      d.getUTCDate().toString().padStart(2, "0") +
      "T" +
      d.getUTCHours().toString().padStart(2, "0") +
      d.getUTCMinutes().toString().padStart(2, "0") +
      d.getUTCSeconds().toString().padStart(2, "0")
    );
  }

  function cleanText(s) {
    if (!s) return "";
    return s.replace(/\s+/g, " ").replace(/\u00A0/g, " ").trim();
  }

  function triggerDownload(content, fileName) {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "calendar.ics";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  // Start
  bootstrap();
})();


