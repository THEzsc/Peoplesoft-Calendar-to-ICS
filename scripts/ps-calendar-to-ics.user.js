// ==UserScript==
// @name         PS Calendar to ICS (ZJU)
// @namespace    https://github.com/yourname/ps-calendar-to-ics
// @version      0.3.5
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

  // 2025-2026学年秋冬学期学术日历
  const ACADEMIC_CALENDAR_2025_2026 = {
    semesterStart: new Date(2025, 8, 15), // 9月15日
    semesterEnd: new Date(2026, 0, 10),   // 1月10日（包含考试期间）
    holidays: [
      // 中秋节、国庆节放假调休
      { start: new Date(2025, 9, 1), end: new Date(2025, 9, 8), name: "中秋节、国庆节放假调休" },
      // 元旦放假
      { start: new Date(2026, 0, 1), end: new Date(2026, 0, 1), name: "元旦放假" }
    ],
    makeupClasses: [
      // 9月28日工作日，授10月3日周五课
      { date: new Date(2025, 8, 28), originalDay: 5, name: "授10月3日周五课" }, // 5 = Friday
      // 10月11日工作日，授10月8日周三课  
      { date: new Date(2025, 9, 11), originalDay: 3, name: "授10月8日周三课" }  // 3 = Wednesday
    ],
    specialEvents: [
      // 新生报到注册
      { date: new Date(2025, 7, 22), name: "新生报到注册", type: "allday" },
      // 本科生新生始业教育、军训
      { start: new Date(2025, 7, 23), end: new Date(2025, 8, 14), name: "本科生新生始业教育、军训", type: "allday" },
      // 本科生开学典礼
      { date: new Date(2025, 7, 24), name: "本科生开学典礼", type: "allday" },
      // UIUC校历课程开始
      { date: new Date(2025, 7, 25), name: "UIUC校历课程-课程开始", type: "allday" },
      // ZJUI二轮选课开始
      { date: new Date(2025, 7, 25), name: "ZJUI二轮选课开始", type: "allday" },
      // UIUC校历课程本科生加课截止时间
      { date: new Date(2025, 8, 8), name: "UIUC校历课程本科生加课截止时间", type: "allday" },
      // 本科生老生报到注册
      { date: new Date(2025, 8, 12), name: "本科生老生报到注册", type: "allday" },
      // 本科生选课截止
      { date: new Date(2025, 8, 19), name: "本科生选课截止", type: "allday" },
      // UIUC校历课程本科生退课截止日期
      { date: new Date(2025, 9, 17), name: "UIUC校历课程本科生退课截止日期", type: "allday" },
      // 秋季校运动会停课
      { start: new Date(2025, 9, 24), end: new Date(2025, 9, 26), name: "秋季校运动会停课", type: "no_class" },
      // 本科生申请退课截止日期
      { date: new Date(2025, 10, 7), name: "本科生申请退课截止日期", type: "allday" },
      // 国际校区2025年辞旧迎新活动
      { date: new Date(2025, 11, 21), name: "国际校区2025年辞旧迎新活动", type: "allday" },
      // 课程结束
      { date: new Date(2025, 11, 26), name: "课程结束", type: "allday" },
      // 复习与考试
      { start: new Date(2025, 11, 29), end: new Date(2025, 11, 30), name: "复习与考试", type: "allday" },
      // 浙江大学学生节
      { date: new Date(2025, 11, 31), name: "浙江大学学生节", type: "allday" },
      // 复习与考试（1月）
      { start: new Date(2026, 0, 2), end: new Date(2026, 0, 10), name: "复习与考试", type: "allday" }
    ]
  };

  /**
   * Main bootstrap function
   */
  function bootstrap() {
    tryInjectForDocument(window.document);
    observeForSchedule(window.document);

    // Handle target iframes
    const iframeSelector = "iframe.ps_target-iframe";
    const iframeList = Array.from(document.querySelectorAll(iframeSelector));
    iframeList.forEach((iframe) => attachIframeListener(iframe));

    // Observe future iframes
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
    iframe.addEventListener("load", () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        tryInjectForDocument(doc);
        observeForSchedule(doc);
      } catch (_) {
        // ignore cross-origin issues
      }
    });
  }

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

  function findScheduleRoot(doc) {
    // Look for course schedule container based on real HTML structure
    const selectors = [
      'div[id*="DERIVED_REGFRM1_DESCR20"]', // Course container
      'table[id*="CLASS_MTG_VW"]', // Meeting time table
      'div[id*="win0divSTDNT_ENRL_SSV2"]', // Original container
    ];

    for (const sel of selectors) {
      const elements = Array.from(doc.querySelectorAll(sel));
      for (const el of elements) {
        if (isScheduleContainer(el)) {
          return el;
        }
      }
    }

    // Fallback: look for elements containing course schedule indicators
    const fallbackSelectors = [
      'td.PAGROUPDIVIDER', // Course title divider
      'th[abbr*="课程号码"]', // Course number header
      'th[abbr*="日期和时间"]', // Date and time header
    ];

    for (const sel of fallbackSelectors) {
      const el = doc.querySelector(sel);
      if (el) {
        let parent = el;
        for (let i = 0; i < 10 && parent; i++) {
          parent = parent.parentElement;
          if (parent && isScheduleContainer(parent)) {
            return parent;
          }
        }
      }
    }

    return null;
  }

  function isScheduleContainer(el) {
    const text = cleanText(el.textContent);
    if (!text) return false;
    
    const hasScheduleContent = 
      /课程表|我的课程|课程号码|日期和时间|开始.结束日期|讲师/i.test(text) ||
      /Class Schedule|Course|Meeting Times|Instructor/i.test(text);
    
    const hasSubstantialContent = text.length > 50;
    const hasCourseTables = el.querySelectorAll('table[id*="CLASS_MTG_VW"], td.PAGROUPDIVIDER').length > 0;
    
    return hasScheduleContent && (hasSubstantialContent || hasCourseTables);
  }

  function injectExportButton(doc) {
    // Avoid duplicate buttons
    if (doc.querySelector("#ps-ics-export-btn")) return;

    const scheduleRoot = findScheduleRoot(doc);
    if (!scheduleRoot) return;

    // Create export button
    const btn = doc.createElement("button");
    btn.id = "ps-ics-export-btn";
    btn.textContent = "导出 ICS";
    btn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      padding: 8px 16px;
      background: #007cba;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-family: sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    
    btn.addEventListener("click", () => {
      try {
        console.log(APP_NAME, "开始解析课程表...");
        const parsed = parseScheduleFromDocument(doc);
        console.log(APP_NAME, "解析结果:", parsed);
        
        if (!parsed.events || parsed.events.length === 0) {
          alert("未找到课程信息。请确保您处于\"列表查看\"界面。");
          return;
        }
        
        const icsText = buildICS(parsed);
        const fileName = buildSuggestedFileName(parsed);
        triggerDownload(icsText, fileName);
        console.log(APP_NAME, "导出完成，文件名:", fileName);
      } catch (err) {
        console.error(APP_NAME, err);
        alert("导出失败：" + (err && err.message ? err.message : String(err)));
      }
    });

    // Insert button into the document
    doc.body.appendChild(btn);
    console.log(APP_NAME, "导出按钮已注入");
  }

  /**
   * Parse schedule from document using real HTML structure
   */
  function parseScheduleFromDocument(doc) {
    const events = [];
    let termTitle = detectTermTitle(doc);

    // Scope to the main schedule root to avoid duplicates elsewhere on the page
    const scheduleRoot = findScheduleRoot(doc) || doc;

    // Find all course containers under the schedule root only
    const courseContainers = Array.from(scheduleRoot.querySelectorAll('div[id*="DERIVED_REGFRM1_DESCR20"]'));
    
    console.log(APP_NAME, `找到 ${courseContainers.length} 个课程容器(已限定范围)`);

    for (const container of courseContainers) {
      try {
        const courseEvents = parseCourseContainer(container);
        events.push(...courseEvents);
      } catch (err) {
        console.warn(APP_NAME, "解析课程容器时出错:", err);
      }
    }

    return { termTitle, events };
  }

  function parseCourseContainer(container) {
    const events = [];
    
    // Get course title from PAGROUPDIVIDER
    const courseTitleElement = container.querySelector('td.PAGROUPDIVIDER');
    let currentCourseCode = "";
    let currentCourseName = "";
    
    if (courseTitleElement) {
      const fullTitle = cleanText(courseTitleElement.textContent);
      // Parse "CS 101 - 计算导论：工程与科学" format
      const match = fullTitle.match(/^([A-Z]+\s*\d+)\s*-\s*(.+)$/);
      if (match) {
        currentCourseCode = match[1].trim();
        currentCourseName = match[2].trim();
      } else {
        currentCourseName = fullTitle;
      }
    }

    console.log(APP_NAME, `解析课程: ${currentCourseCode} - ${currentCourseName}`);

    // Find the meeting times table
    const meetingTable = container.querySelector('table[id*="CLASS_MTG_VW"]');
    if (!meetingTable) {
      console.warn(APP_NAME, "未找到课程时间表");
      return events;
    }

    // Parse each row of the meeting table
    const rows = Array.from(meetingTable.querySelectorAll('tr'));
    let currentComponent = ""; // Track current component

    for (let i = 1; i < rows.length; i++) { // Skip header row
      const row = rows[i];
      const cells = Array.from(row.querySelectorAll('td'));
      
      if (cells.length < 7) continue;

      try {
        const classNumber = cleanText(cells[0].textContent);
        const section = cleanText(cells[1].textContent);
        const component = cleanText(cells[2].textContent);
        const dateTime = cleanText(cells[3].textContent);
        const room = cleanText(cells[4].textContent);
        const instructor = cleanText(cells[5].textContent);
        const startEndDate = cleanText(cells[6].textContent);

        // Update current component if not empty (handles continuation rows)
        if (component) {
          currentComponent = component;
        }

        // Skip rows without essential information
        if (!dateTime && !startEndDate) continue;

        // Parse the event
        const event = parseScheduleRow({
          courseCode: currentCourseCode,
          courseName: currentCourseName,
          classNumber,
          section,
          component: currentComponent,
          dateTime,
          room,
          instructor,
          startEndDate
        });

        if (event) {
          events.push(event);
        }

      } catch (err) {
        console.warn(APP_NAME, "解析课程行时出错:", err);
      }
    }

    return events;
  }

  function parseScheduleRow(data) {
    const { courseCode, courseName, classNumber, section, component, dateTime, room, instructor, startEndDate } = data;

    // Parse date range
    const dateRange = parseStartEndDate(startEndDate);
    if (!dateRange) {
      console.warn(APP_NAME, "无法解析日期范围:", startEndDate);
      return null;
    }

    // Parse time and days
    const timeInfo = parseDateTimeInfo(dateTime);
    if (!timeInfo) {
      console.warn(APP_NAME, "无法解析时间信息:", dateTime);
      return null;
    }

    // Build event summary using course code + component (calendar-friendly format)
    let summary = courseCode || "课程";
    if (component) {
      // Use more calendar-friendly format instead of square brackets
      summary += ` - ${component}`;
    }
    if (section) {
      summary += ` (${section})`;
    }

    return {
      summary,
      courseCode,
      courseName,
      component,
      section,
      classNumber,
      location: room || "",
      instructor: instructor || "",
      days: timeInfo.days,
      startTime: timeInfo.startTime,
      endTime: timeInfo.endTime,
      startDate: dateRange.start,
      endDate: dateRange.end
    };
  }

   function parseStartEndDate(dateStr) {
     if (!dateStr) return null;
     
     // Parse "15/09/2025 - 21/09/2025" format
     // NOTE: The dates in PeopleSoft table only show the current week display range,
     // not the actual course duration. We need to use the full semester range.
     const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s*-\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/);
     if (!match) return null;

     // Use the full academic semester range instead of the short display range
     return {
       start: ACADEMIC_CALENDAR_2025_2026.semesterStart,
       end: ACADEMIC_CALENDAR_2025_2026.semesterEnd
     };
   }

  function parseDateTimeInfo(timeStr) {
    if (!timeStr) return null;

    console.log(APP_NAME, "Parsing time string:", timeStr);

    // Helper
    const dayMap = { '日': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6 };

    // Case 1: AM/PM (e.g., 星期一 2:00PM - 3:50PM)
    let m = timeStr.match(/星期([一二三四五六日])\s+(\d{1,2})\s*:\s*(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2})\s*:\s*(\d{2})\s*(AM|PM)/i);
    if (m) {
      const [, d, sh, sm, sap, eh, em, eap] = m;
      let sH = parseInt(sh, 10);
      let eH = parseInt(eh, 10);
      const sAP = (sap || '').toUpperCase();
      const eAP = (eap || '').toUpperCase();
      if (sAP === 'PM' && sH !== 12) sH += 12;
      if (sAP === 'AM' && sH === 12) sH = 0;
      if (eAP === 'PM' && eH !== 12) eH += 12;
      if (eAP === 'AM' && eH === 12) eH = 0;
      const dayOfWeek = dayMap[d];
      if (dayOfWeek === undefined) return null;
      const res = { days: [dayOfWeek], startTime: { hour: sH, minute: parseInt(sm, 10), h: sH, m: parseInt(sm, 10) }, endTime: { hour: eH, minute: parseInt(em, 10), h: eH, m: parseInt(em, 10) } };
      console.log(APP_NAME, "Parsed time result (AM/PM):", res);
      return res;
    }

    // Case 2: 24-hour (e.g., 星期三 14:00 - 15:50)
    m = timeStr.match(/星期([一二三四五六日])\s+(\d{1,2})\s*:\s*(\d{2})\s*-\s*(\d{1,2})\s*:\s*(\d{2})/);
    if (m) {
      const [, d, sh, sm, eh, em] = m;
      const dayOfWeek = dayMap[d];
      if (dayOfWeek === undefined) return null;
      const sH = parseInt(sh, 10);
      const eH = parseInt(eh, 10);
      const res = { days: [dayOfWeek], startTime: { hour: sH, minute: parseInt(sm, 10), h: sH, m: parseInt(sm, 10) }, endTime: { hour: eH, minute: parseInt(em, 10), h: eH, m: parseInt(em, 10) } };
      console.log(APP_NAME, "Parsed time result (24h):", res);
      return res;
    }

    // Case 3: Chinese 上午/下午 (e.g., 星期二 上午 10:00 - 下午 11:50)
    m = timeStr.match(/星期([一二三四五六日])\s*(上午|下午)\s*(\d{1,2})\s*:\s*(\d{2})\s*-\s*(上午|下午)\s*(\d{1,2})\s*:\s*(\d{2})/);
    if (m) {
      const [, d, sAPcn, sh, sm, eAPcn, eh, em] = m;
      let sH = parseInt(sh, 10);
      let eH = parseInt(eh, 10);
      if (sAPcn === '下午' && sH !== 12) sH += 12;
      if (sAPcn === '上午' && sH === 12) sH = 0;
      if (eAPcn === '下午' && eH !== 12) eH += 12;
      if (eAPcn === '上午' && eH === 12) eH = 0;
      const dayOfWeek = dayMap[d];
      if (dayOfWeek === undefined) return null;
      const res = { days: [dayOfWeek], startTime: { hour: sH, minute: parseInt(sm, 10), h: sH, m: parseInt(sm, 10) }, endTime: { hour: eH, minute: parseInt(em, 10), h: eH, m: parseInt(em, 10) } };
      console.log(APP_NAME, "Parsed time result (CN AM/PM):", res);
      return res;
    }

    console.warn(APP_NAME, "Time string does not match expected formats:", timeStr);
    return null;
  }

  function detectTermTitle(doc) {
    const titleCandidates = [
      ...Array.from(doc.querySelectorAll("h1, h2, h3, .PATRANSACTIONTITLE, .PTTEXT, .ps_pageheader")),
    ];
    
    for (const el of titleCandidates) {
      const t = cleanText(el.textContent);
      if (!t) continue;
      if (/学期|学年|Term|Session|课程表/i.test(t)) {
        return t;
      }
    }
    
    const title = (doc.title || "").trim();
    if (title) return title;
    return "我的课程表";
  }

  /**
   * Academic calendar helper functions
   */
  function isHoliday(date) {
    for (const holiday of ACADEMIC_CALENDAR_2025_2026.holidays) {
      if (isDateInRange(date, holiday.start, holiday.end)) {
        return true;
      }
    }
    return false;
  }

  function isMakeupClassDay(date) {
    for (const makeup of ACADEMIC_CALENDAR_2025_2026.makeupClasses) {
      if (isSameDate(date, makeup.date)) {
        return makeup;
      }
    }
    return null;
  }

  function isSpecialEvent(date) {
    for (const event of ACADEMIC_CALENDAR_2025_2026.specialEvents) {
      if (event.start && event.end) {
        if (isDateInRange(date, event.start, event.end)) {
          return event;
        }
      } else if (event.date) {
        if (isSameDate(date, event.date)) {
          return event;
        }
      }
    }
    return null;
  }

  function shouldSkipDate(date, targetDayOfWeek) {
    // Skip if it's a holiday
    if (isHoliday(date)) {
      return true;
    }

    // Skip if it's a special no-class event
    const specialEvent = isSpecialEvent(date);
    if (specialEvent && specialEvent.type === 'no_class') {
      return true;
    }

    return false;
  }

  function generateClassDates(event) {
    // Simple generation: only use weekday matching within start/end range
    const dates = [];
    const startDate = event.startDate;
    const endDate = event.endDate;
    const targetDaysOfWeek = Array.isArray(event.days) ? event.days : [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (targetDaysOfWeek.includes(currentDate.getDay())) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(APP_NAME, `为课程 "${event.summary}" 生成了 ${dates.length} 个上课日期(简单模式)`);
    return dates;
  }

  /**
   * Build ICS text from parsed data
   */
  function buildICS(parsed) {
    const lines = [];
    const now = new Date();
    const dtstamp = toUTCStringBasic(now);

    lines.push("BEGIN:VCALENDAR");
    lines.push("PRODID:-//" + APP_NAME + "//EN");
    lines.push("VERSION:2.0");
    lines.push("CALSCALE:GREGORIAN");
    
    // Add timezone definition
    lines.push("BEGIN:VTIMEZONE");
    lines.push("TZID:" + TZID);
    lines.push("BEGIN:STANDARD");
    lines.push("DTSTART:19700101T000000");
    lines.push("TZOFFSETFROM:+0800");
    lines.push("TZOFFSETTO:+0800");
    lines.push("TZNAME:CST");
    lines.push("END:STANDARD");
    lines.push("END:VTIMEZONE");

    // Keep file small for import: skip special events for now (user request)
    // addSpecialEventsToICS(lines, now, dtstamp);

    // Add regular class events
    // Deduplicate by (summary + start/end time + location + weekday)
    const seenKeys = new Set();
    for (const ev of parsed.events) {
      const classDates = generateClassDates(ev);
      
      for (let i = 0; i < classDates.length; i++) {
        const classDate = classDates[i];
        const dtStartLocal = combineDateAndTime(classDate, ev.startTime);
        const dtEndLocal = combineDateAndTime(classDate, ev.endTime);

        const key = [
          ev.summary,
          ev.startTime && (ev.startTime.hour ?? ev.startTime.h) + ":" + (ev.startTime.minute ?? ev.startTime.m),
          ev.endTime && (ev.endTime.hour ?? ev.endTime.h) + ":" + (ev.endTime.minute ?? ev.endTime.m),
          ev.location || "",
          classDate.getDay()
        ].join("|");
        if (seenKeys.has(key) && i > 0) continue;
        seenKeys.add(key);

        lines.push("BEGIN:VEVENT");
        lines.push("UID:" + buildUID(ev, now, i));
        lines.push("DTSTAMP:" + dtstamp + "Z");
        lines.push("CREATED:" + dtstamp + "Z");
        lines.push("LAST-MODIFIED:" + dtstamp + "Z");
        lines.push("DTSTART;TZID=" + TZID + ":" + toLocalStringBasic(dtStartLocal));
        lines.push("DTEND;TZID=" + TZID + ":" + toLocalStringBasic(dtEndLocal));
        lines.push("SUMMARY:" + foldLine(ev.summary));
        lines.push("STATUS:CONFIRMED");
        lines.push("TRANSP:OPAQUE");
        
        if (ev.location) {
          lines.push("LOCATION:" + foldLine(ev.location));
        }
        
        // Build comprehensive description
        let description = [];
        if (ev.courseName && ev.courseName !== ev.courseCode) {
          description.push(`课程: ${ev.courseName}`);
        }
        if (ev.component) {
          description.push(`类型: ${ev.component}`);
        }
        if (ev.instructor) {
          description.push(`讲师: ${ev.instructor}`);
        }
        if (ev.classNumber) {
          description.push(`课程号: ${ev.classNumber}`);
        }
        
        if (description.length > 0) {
          // Use single-escaped newlines as requested
          const desc = description.join("\n");
          lines.push("DESCRIPTION:" + foldLine(desc));
        }
        
        // Add categories for better organization
        if (ev.component) {
          lines.push("CATEGORIES:" + foldLine(ev.component));
        }
        
        lines.push("END:VEVENT");
      }
    }

    lines.push("END:VCALENDAR");
    
    console.log(APP_NAME, `生成的 ICS 内容长度: ${lines.join('\r\n').length} 字符`);
    return lines.join("\r\n");
  }

  function addSpecialEventsToICS(lines, now, dtstamp) {
    for (const event of ACADEMIC_CALENDAR_2025_2026.specialEvents) {
      if (event.type === 'allday') {
        if (event.start && event.end) {
          // Multi-day all-day event
          let currentDate = new Date(event.start);
          while (currentDate <= event.end) {
            lines.push("BEGIN:VEVENT");
            lines.push("UID:" + buildSpecialEventUID(event, now, currentDate));
            lines.push("DTSTAMP:" + dtstamp + "Z");
            lines.push("CREATED:" + dtstamp + "Z");
            lines.push("LAST-MODIFIED:" + dtstamp + "Z");
            lines.push("DTSTART;VALUE=DATE:" + toDateString(currentDate));
            lines.push("DTEND;VALUE=DATE:" + toDateString(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)));
            lines.push("SUMMARY:" + foldLine(event.name));
            lines.push("DESCRIPTION:" + foldLine("学校特殊事件"));
            lines.push("STATUS:CONFIRMED");
            lines.push("TRANSP:TRANSPARENT");
            lines.push("CATEGORIES:" + foldLine("学校事件"));
            lines.push("END:VEVENT");
            currentDate.setDate(currentDate.getDate() + 1);
          }
        } else if (event.date) {
          // Single-day all-day event
          lines.push("BEGIN:VEVENT");
          lines.push("UID:" + buildSpecialEventUID(event, now));
          lines.push("DTSTAMP:" + dtstamp + "Z");
          lines.push("CREATED:" + dtstamp + "Z");
          lines.push("LAST-MODIFIED:" + dtstamp + "Z");
          lines.push("DTSTART;VALUE=DATE:" + toDateString(event.date));
          lines.push("DTEND;VALUE=DATE:" + toDateString(new Date(event.date.getTime() + 24 * 60 * 60 * 1000)));
          lines.push("SUMMARY:" + foldLine(event.name));
          lines.push("DESCRIPTION:" + foldLine("学校特殊事件"));
          lines.push("STATUS:CONFIRMED");
          lines.push("TRANSP:TRANSPARENT");
          lines.push("CATEGORIES:" + foldLine("学校事件"));
          lines.push("END:VEVENT");
        }
      }
    }
  }

  function buildUID(ev, now, index = 0) {
    const base = [
      ev.courseCode || ev.summary,
      ev.component || "",
      ev.section || "",
      ev.location,
      ev.instructor,
      ev.days.join(""),
      index.toString()
    ].filter(Boolean).join("-");
    
    const hash = simpleHash(base);
    const timestamp = Math.floor(now.getTime() / 1000);
    return `${hash}-${timestamp}@${HOST_HINT}`;
  }

  function buildSpecialEventUID(event, now, date = null) {
    const base = [
      event.name,
      event.type || "",
      date ? toDateString(date) : toDateString(event.date || event.start)
    ].filter(Boolean).join("-");
    
    const hash = simpleHash(base);
    const timestamp = Math.floor(now.getTime() / 1000);
    return `special-${hash}-${timestamp}@${HOST_HINT}`;
  }

  function buildSuggestedFileName(parsed) {
    const termPart = parsed.termTitle || "课程表";
    const now = new Date();
    const datePart = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    return `${termPart}-${datePart}.ics`;
  }

  function triggerDownload(content, filename) {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Helper functions
  function cleanText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function combineDateAndTime(date, time) {
    const result = new Date(date);
    
    // Debug logging to identify the issue
    console.log(APP_NAME, "combineDateAndTime debug:", {
      date: date,
      time: time,
      hour: time.hour || time.h,
      minute: time.minute || time.m
    });
    
    const hour = time.hour || time.h;
    const minute = time.minute || time.m;
    
    if (hour === undefined || minute === undefined) {
      console.error(APP_NAME, "Invalid time object:", time);
      return result; // Return date without time modification
    }
    
    result.setHours(hour, minute, 0, 0);
    return result;
  }

  function toLocalStringBasic(date) {
    return date.getFullYear() +
           (date.getMonth() + 1).toString().padStart(2, '0') +
           date.getDate().toString().padStart(2, '0') + 'T' +
           date.getHours().toString().padStart(2, '0') +
           date.getMinutes().toString().padStart(2, '0') +
           date.getSeconds().toString().padStart(2, '0');
  }

  function toUTCStringBasic(date) {
    return date.getUTCFullYear() +
           (date.getUTCMonth() + 1).toString().padStart(2, '0') +
           date.getUTCDate().toString().padStart(2, '0') + 'T' +
           date.getUTCHours().toString().padStart(2, '0') +
           date.getUTCMinutes().toString().padStart(2, '0') +
           date.getUTCSeconds().toString().padStart(2, '0');
  }

  function toDateString(date) {
    return date.getFullYear() +
           (date.getMonth() + 1).toString().padStart(2, '0') +
           date.getDate().toString().padStart(2, '0');
  }

  function foldLine(text) {
    // ICS line folding: max 75 octets per line
    if (!text) return "";
    
    // Escape special characters for better calendar compatibility
    text = escapeICSText(text);
    
    const maxLen = 73; // Leave room for CRLF
    if (text.length <= maxLen) return text;
    
    const lines = [];
    let pos = 0;
    while (pos < text.length) {
      if (pos === 0) {
        lines.push(text.substring(pos, pos + maxLen));
        pos += maxLen;
      } else {
        lines.push(" " + text.substring(pos, pos + maxLen - 1));
        pos += maxLen - 1;
      }
    }
    return lines.join("\r\n");
  }

  function escapeICSText(text) {
    if (!text) return "";
    
    // RFC 5545 compliant text escaping
    return text
      .replace(/\\/g, "\\\\")    // Escape backslashes first
      .replace(/,/g, "\\,")      // Escape commas
      .replace(/;/g, "\\;")      // Escape semicolons
      .replace(/\n/g, "\\n")     // Escape newlines  
      .replace(/\r/g, "");       // Remove carriage returns
  }
  
  function formatDescription(parts) {
    if (!parts || parts.length === 0) return "";
    
    // Join parts with actual line breaks for ICS format
    return parts.join("\\n");
  }

  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  function isDateInRange(date, start, end) {
    return date >= start && date <= end;
  }

  // Start the script
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }

})();
