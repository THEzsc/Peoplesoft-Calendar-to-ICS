// ==UserScript==
// @name         PS Calendar to ICS (ZJU)
// @namespace    https://github.com/yourname/ps-calendar-to-ics
// @version      0.2.1
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

  // 2024-2025学年秋冬学期行事历
  const ACADEMIC_CALENDAR_2024_2025 = {
    // 学期开始和结束
    semesterStart: new Date(2024, 8, 15), // 9月15日 - 秋冬学期课程开始
    semesterEnd: new Date(2025, 0, 10),   // 1月10日 - 考试结束
    
    // 假期和停课日期
    holidays: [
      // 中秋节、国庆节放假调休 (10月1-8日)
      { start: new Date(2024, 9, 1), end: new Date(2024, 9, 8), name: "中秋节、国庆节" },
      // 秋季校运动会停课 (10月24-26日)
      { start: new Date(2024, 9, 24), end: new Date(2024, 9, 26), name: "秋季校运动会" },
      // 复习与考试期间 (12月29-30日)
      { start: new Date(2024, 11, 29), end: new Date(2024, 11, 30), name: "复习与考试" },
      // 元旦放假 (1月1日)
      { start: new Date(2025, 0, 1), end: new Date(2025, 0, 1), name: "元旦" },
      // 复习与考试期间 (1月2-10日)
      { start: new Date(2025, 0, 2), end: new Date(2025, 0, 10), name: "复习与考试" }
    ],
    
    // 补课日期 (工作日但要上其他日期的课)
    makeupClasses: [
      { date: new Date(2024, 8, 28), replaces: new Date(2024, 9, 3) }, // 9月28日工作日，授10月3日周五课
      { date: new Date(2024, 9, 11), replaces: new Date(2024, 9, 8) }  // 10月11日工作日，授10月8日周三课
    ]
  };

  /**
   * 行事历处理函数
   */
  function isHoliday(date) {
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return ACADEMIC_CALENDAR_2024_2025.holidays.some(holiday => {
      const start = new Date(holiday.start.getFullYear(), holiday.start.getMonth(), holiday.start.getDate());
      const end = new Date(holiday.end.getFullYear(), holiday.end.getMonth(), holiday.end.getDate());
      return checkDate >= start && checkDate <= end;
    });
  }

  function isMakeupClassDay(date) {
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return ACADEMIC_CALENDAR_2024_2025.makeupClasses.find(makeup => {
      const makeupDate = new Date(makeup.date.getFullYear(), makeup.date.getMonth(), makeup.date.getDate());
      return checkDate.getTime() === makeupDate.getTime();
    });
  }

  function getOriginalDayOfWeek(date, makeupInfo) {
    if (makeupInfo) {
      // 补课日：返回被替代日期的星期
      return makeupInfo.replaces.getDay();
    }
    return date.getDay();
  }

  function shouldSkipDate(date, targetDayOfWeek) {
    // 检查是否在学期范围内
    if (date < ACADEMIC_CALENDAR_2024_2025.semesterStart || date > ACADEMIC_CALENDAR_2024_2025.semesterEnd) {
      return true;
    }
    
    // 检查是否是假期
    if (isHoliday(date)) {
      return true;
    }
    
    // 检查补课日期
    const makeupInfo = isMakeupClassDay(date);
    const effectiveDayOfWeek = getOriginalDayOfWeek(date, makeupInfo);
    
    // 只有当有效星期与目标星期匹配时才不跳过
    return effectiveDayOfWeek !== targetDayOfWeek;
  }

  /**
   * Main bootstrap: observe page and iframes, inject export buttons when schedule view is present.
   */
  function bootstrap() {
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
      if (el) return el;
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
    if (doc.getElementById("ps-ics-export-btn")) return;
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
        console.log(APP_NAME + " - 解析结果:", parsed);
        
        if (!parsed || parsed.events.length === 0) {
          alert("未找到课程表数据（请确认处于\"列表查看\"界面）。");
          return;
        }
        
        // 检查每个事件的日期生成
        for (let i = 0; i < parsed.events.length; i++) {
          const ev = parsed.events[i];
          console.log(`${APP_NAME} - 课程 ${i + 1} 原始数据:`, {
            summary: ev.summary,
            days: ev.days,
            startDate: ev.startDate.toDateString(),
            endDate: ev.endDate.toDateString(),
            startTime: ev.startTime,
            endTime: ev.endTime
          });
          
          const classDates = generateClassDates(ev);
          console.log(`${APP_NAME} - 课程 ${i + 1} "${ev.summary}" 生成日期:`, classDates.map(d => d.toDateString()));
          
          if (classDates.length === 0) {
            console.warn(`${APP_NAME} - 课程 ${i + 1} "${ev.summary}" 没有生成任何有效日期！`);
          }
        }
        
        const icsText = buildICS(parsed);
        console.log(APP_NAME + " - 生成的ICS长度:", icsText.length);
        
        if (icsText.length < 200) {
          console.warn(APP_NAME + " - ICS内容可能为空:", icsText);
        }
        
        const fileName = buildSuggestedFileName(parsed);
        triggerDownload(icsText, fileName);
      } catch (err) {
        console.error(APP_NAME, err);
        alert("导出失败：" + (err && err.message ? err.message : String(err)));
      }
    });
    (doc.body || doc.documentElement).appendChild(btn);
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
    // Strategy 1: Find the course container (DERIVED_REGFRM1_DESCR20) that contains both PAGROUPDIVIDER and CLASS_MTG_VW
    const currentTable = scope.closest('table[id*="CLASS_MTG_VW"]');
    if (currentTable) {
      // Preferred: direct closest lookup
      const courseDivClosest = currentTable.closest('div[id*="DERIVED_REGFRM1_DESCR20"]');
      if (courseDivClosest) {
        const divider = courseDivClosest.querySelector('td.PAGROUPDIVIDER');
        const t = divider ? cleanText(divider.textContent) : "";
        if (t) return t;
      }
      // Look for the parent container that has DERIVED_REGFRM1_DESCR20 in its ID
      let container = currentTable;
      for (let level = 0; level < 10 && container; level++) {
        if (container.id && container.id.includes('DERIVED_REGFRM1_DESCR20')) {
          // Found the course container, now look for PAGROUPDIVIDER within it
          const pagroupDivider = container.querySelector('td.PAGROUPDIVIDER');
          if (pagroupDivider) {
            const courseTitle = cleanText(pagroupDivider.textContent);
            if (courseTitle && courseTitle.length > 3) {
              return courseTitle;
            }
          }
          break;
        }
        container = container.parentElement;
      }
      
      // Alternative: find the div container with DERIVED_REGFRM1_DESCR20 ID
      container = currentTable;
      for (let level = 0; level < 10 && container; level++) {
        if (container.querySelector && container.querySelector('div[id*="DERIVED_REGFRM1_DESCR20"]')) {
          const courseDiv = container.querySelector('div[id*="DERIVED_REGFRM1_DESCR20"]');
          if (courseDiv) {
            const pagroupDivider = courseDiv.querySelector('td.PAGROUPDIVIDER');
            if (pagroupDivider) {
              const courseTitle = cleanText(pagroupDivider.textContent);
              if (courseTitle && courseTitle.length > 3) {
                return courseTitle;
              }
            }
          }
          break;
        }
        container = container.parentElement;
      }
    }
    
    // Strategy 2: Match by table index - find the Nth CLASS_MTG_VW table and match with Nth PAGROUPDIVIDER
    const allTables = Array.from(document.querySelectorAll('table[id*="CLASS_MTG_VW"]'));
    const allDividers = Array.from(document.querySelectorAll('td.PAGROUPDIVIDER'));
    
    if (currentTable && allTables.length === allDividers.length) {
      const tableIndex = allTables.indexOf(currentTable);
      if (tableIndex >= 0 && tableIndex < allDividers.length) {
        const courseTitle = cleanText(allDividers[tableIndex].textContent);
        if (courseTitle && courseTitle.length > 3) {
          return courseTitle;
        }
      }
    }
    
    // Strategy 3: Look for PAGROUPDIVIDER in the same document area
    const searchScope = scope.closest('#win0divSTDNT_ENRL_SSV2\\$0') || scope.closest('[id*="STDNT_ENRL_SSV2"]') || document;
    
    if (currentTable) {
      // Find all course containers in the search scope
      const courseContainers = Array.from(searchScope.querySelectorAll('div[id*="DERIVED_REGFRM1_DESCR20"]'));
      
      for (const container of courseContainers) {
        // Check if this container contains our current table
        if (container.contains(currentTable)) {
          const pagroupDivider = container.querySelector('td.PAGROUPDIVIDER');
          if (pagroupDivider) {
            const courseTitle = cleanText(pagroupDivider.textContent);
            if (courseTitle && courseTitle.length > 3) {
              return courseTitle;
            }
          }
          break;
        }
      }
    }
    
    // Strategy 4: Look for PSHYPERLINK elements that might contain course codes/names
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
    
    // Fallback: Use a generic identifier based on table position
    if (currentTable) {
      const tableIndex = allTables.indexOf(currentTable);
      if (tableIndex >= 0) {
        return `课程 ${tableIndex + 1}`;
      }
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
    const colIndex = { component: -1, daysTimes: -1, room: -1, instructor: -1, dates: -1 };
    headerCells.forEach((cell, idx) => {
      const t = cleanText(cell.textContent);
      if (/(Component|组件)/i.test(t)) colIndex.component = idx;
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
      const comp = cleanText(getCellText(cells, colIndex.component));
      const dt = cleanText(getCellText(cells, colIndex.daysTimes));
      const room = cleanText(getCellText(cells, colIndex.room));
      const instructor = cleanText(getCellText(cells, colIndex.instructor));
      const dates = cleanText(getCellText(cells, colIndex.dates));

      if (!dt || /TBA|待定|未安排/i.test(dt)) continue;
      const parsedDT = parseDaysAndTimes(dt);
      const parsedDates = parseDateRange(dates);
      if (!parsedDT || !parsedDates) continue;

      results.push({
        component: comp || "",
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

    for (const ev of parsed.events) {
      // 生成所有有效的上课日期
      const classDates = generateClassDates(ev);
      
      for (let i = 0; i < classDates.length; i++) {
        const classDate = classDates[i];
        const dtStartLocal = new Date(
          classDate.getFullYear(),
          classDate.getMonth(),
          classDate.getDate(),
          ev.startTime.h,
          ev.startTime.m,
          0,
          0
        );
        const dtEndLocal = new Date(
          classDate.getFullYear(),
          classDate.getMonth(),
          classDate.getDate(),
          ev.endTime.h,
          ev.endTime.m,
          0,
          0
        );

        lines.push("BEGIN:VEVENT");
        lines.push("UID:" + buildUID(ev, now, i)); // 添加索引以确保唯一性
        lines.push("DTSTAMP:" + dtstamp + "Z");
        lines.push(
          "DTSTART;TZID=" + TZID + ":" + toLocalStringBasic(dtStartLocal)
        );
        lines.push(
          "DTEND;TZID=" + TZID + ":" + toLocalStringBasic(dtEndLocal)
        );
        // 不使用RRULE，每个日期生成单独的事件
        const summaryText = buildEventSummary(ev, { useEmoji: false, showTypeTag: true, teacherLimit: 2, aliases: {} });
        lines.push(foldLine("SUMMARY:" + escapeText(summaryText || ev.summary || "课程")));
        const descParts = [];
        // DESCRIPTION: more details
        if (ev.instructor) descParts.push("教师:" + ev.instructor);
        if (ev.component) descParts.push("类型:" + ev.component);
        if (ev.summary) descParts.push("原始:" + ev.summary);
        if (ev.notes) descParts.push(ev.notes);
        
        // 如果是补课日，添加说明
        const makeupInfo = isMakeupClassDay(classDate);
        if (makeupInfo) {
          const originalDate = makeupInfo.replaces;
          const dateStr = `${originalDate.getMonth() + 1}月${originalDate.getDate()}日`;
          descParts.push(`补课（原定${dateStr}）`);
        }
        
        if (descParts.length) {
          lines.push(foldLine("DESCRIPTION:" + escapeText(descParts.join("\\n"))));
        }
        if (ev.location) lines.push(foldLine("LOCATION:" + escapeText(ev.location)));
        lines.push("END:VEVENT");
      }
    }

    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }

  // ===== SUMMARY Builder per specification =====
  function buildEventSummary(ev, options) {
    const opts = Object.assign({ useEmoji: false, showTypeTag: true, teacherLimit: 2, aliases: {} }, options || {});
    const courseNameRaw = ev.summary || "";
    let name = normalizePunctuation(courseNameRaw);
    name = removeNoiseTags(name, ["春季", "秋季", "重修", "辅修", "英语授课", "双语", "校选修", "MOOC"]);

    // Infer type from component/name
    const inferredType = inferTypeFrom(ev.component, name);
    let typeTag = "";
    if (opts.showTypeTag) {
      const typeTagText = formatTypeTag(inferredType, opts.useEmoji);
      // Avoid duplicate when name already contains 实验 and inferredType is lab
      if (!(inferredType === "lab" && /实验/.test(name))) {
        typeTag = typeTagText;
      }
    }

    // classGroup not available in PS table → omit
    const classTag = "";

    // Location
    const location = resolveLocation(ev.location, opts.aliases) || "";
    const locationPart = location ? " @ " + location : "";

    // Teachers
    const teachers = splitTeachers(ev.instructor);
    let teacherPart = "";
    if (teachers.length === 1) teacherPart = " · " + teachers[0];
    else if (teachers.length === 2) teacherPart = " · " + teachers[0] + "/" + teachers[1];
    else if (teachers.length >= 3) teacherPart = " · " + teachers[0] + " 等";

    const prefixEmoji = opts.useEmoji ? emojiForType(inferredType) : "";
    let summary = [prefixEmoji, name, typeTag ? " " + typeTag : "", classTag, locationPart, teacherPart].join("");
    summary = foldSpaces(summary.trim());
    summary = enforceLength(summary, 80);
    return summary;
  }

  function normalizePunctuation(s) {
    return (s || "")
      .replace(/[\uFF08]/g, "(")
      .replace(/[\uFF09]/g, ")")
      .replace(/[\uFF0C]/g, ",")
      .replace(/[\u3000]/g, " ")
      .trim();
  }

  function removeNoiseTags(name, tags) {
    let s = name;
    tags.forEach((t) => {
      const re = new RegExp("[（(]" + t + "[）)]", "g");
      s = s.replace(re, "");
    });
    return foldSpaces(s).trim();
  }

  function inferTypeFrom(component, name) {
    const comp = (component || "").toLowerCase();
    const nm = (name || "").toLowerCase();
    if (/lab|实验|实验室|上机/.test(comp) || /实验|实验课|上机/.test(nm)) return "lab";
    if (/seminar|研讨/.test(comp) || /研讨/.test(nm)) return "seminar";
    if (/practice|实训|实践/.test(comp) || /实训|实践/.test(nm)) return "practice";
    if (/discussion|讨论/.test(comp) || /讨论/.test(nm)) return "seminar";
    return "lecture";
  }

  function formatTypeTag(type, useEmoji) {
    if (!type) return "";
    if (useEmoji) {
      const emoji = emojiForType(type);
      return emoji ? emoji + "" : "";
    }
    const map = { lab: "[实验]", lecture: "[讲授]", seminar: "[研讨]", practice: "[实践]" };
    return map[type] || "";
  }

  function emojiForType(type) {
    switch (type) {
      case "lab":
        return "🧪 ";
      case "lecture":
        return "🎓 ";
      case "practice":
        return "🛠️ ";
      case "seminar":
        return "🗣️ ";
      default:
        return "";
    }
  }

  function resolveLocation(locationRaw, aliases) {
    const raw = cleanText(locationRaw || "");
    if (!raw) return "";
    if (aliases && aliases[raw]) return aliases[raw];
    return raw;
  }

  function splitTeachers(instructor) {
    if (!instructor) return [];
    const arr = String(instructor)
      .split(/[\/，,;；、\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return arr.slice(0, 3); // limit
  }

  function foldSpaces(s) {
    return (s || "").replace(/\s+/g, " ").trim();
  }

  function enforceLength(s, maxLen) {
    if (!s) return s;
    if (s.length <= maxLen) return s;
    // try to trim teacher part first (after ' · ')
    const idx = s.indexOf(" · ");
    if (idx !== -1) {
      const base = s.substring(0, idx);
      if (base.length <= maxLen) return base;
      return base.substring(0, maxLen);
    }
    return s.substring(0, maxLen);
  }

  function generateClassDates(ev) {
    const dates = [];
    const targetDaysOfWeek = ev.days.map(d => dayTokenToIndex(d));
    
    // 从课程开始日期开始，逐日检查到课程结束日期
    const currentDate = new Date(ev.startDate);
    const endDate = new Date(ev.endDate);
    
    console.log(`${APP_NAME} - 生成日期范围: ${currentDate.toDateString()} 到 ${endDate.toDateString()}`);
    console.log(`${APP_NAME} - 目标星期: ${targetDaysOfWeek} (${ev.days})`);
    
    // 临时禁用行事历过滤进行调试
    const useAcademicCalendar = false; // 设为false进行调试
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      let shouldAddDate = false;
      
      if (useAcademicCalendar) {
        // 使用行事历逻辑
        const makeupInfo = isMakeupClassDay(currentDate);
        if (makeupInfo) {
          const effectiveDayOfWeek = makeupInfo.replaces.getDay();
          if (targetDaysOfWeek.includes(effectiveDayOfWeek)) {
            shouldAddDate = true;
          }
        } else if (targetDaysOfWeek.includes(dayOfWeek)) {
          if (!shouldSkipDate(currentDate, dayOfWeek)) {
            shouldAddDate = true;
          }
        }
      } else {
        // 简单逻辑：只检查星期几
        if (targetDaysOfWeek.includes(dayOfWeek)) {
          shouldAddDate = true;
        }
      }
      
      if (shouldAddDate) {
        dates.push(new Date(currentDate));
        console.log(`${APP_NAME} - 添加日期: ${currentDate.toDateString()}`);
      }
      
      // 移动到下一天
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.log(`${APP_NAME} - 总共生成 ${dates.length} 个日期`);
    return dates.sort((a, b) => a.getTime() - b.getTime());
  }

  function buildUID(ev, now, index = 0) {
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
      index, // 添加索引以确保同一课程的不同日期有不同的UID
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


